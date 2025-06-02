import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, Text, Spinner, Center, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Stats from '../components/Stats';
import LayoutSwitcher from '../components/LayoutSwitcher';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from '../utils/firebaseDb';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const tags = ['工作', '學習', '個人', '其他'];

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('全部');
  const [page, setPage] = useState('list');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const todos = await getAllTodos();
      setTodos(todos);
      setLoading(false);
    } catch (err) {
      console.error("取得待辦清單失敗", err);
      toast({
        title: "讀取失敗",
        description: "無法取得待辦清單資料，請稍後再試。",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "親愛的用戶");
        await fetchTodos();
      } else {
        toast({
          title: "尚未登入",
          description: "請先登入才能使用待辦功能",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    });

    return () => unsubscribe();
  }, [toast, fetchTodos]);

  const handleAddTodo = async (todo) => {
    try {
      await addTodo(todo);
      await fetchTodos();
    } catch (err) {
      console.error("新增失敗", err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = todos.map(todo =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      );
      const toggled = updated.find(t => t.id === id);
      if (toggled) await updateTodo(toggled);
      setTodos(updated);
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("刪除失敗", err);
    }
  };

  // 編輯打開 Modal
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    onOpen();
  };

  // 編輯取消關閉 Modal
  const handleCancelEdit = () => {
    setEditingTodo(null);
    onClose();
  };

  // 編輯提交更新
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      await updateTodo(updatedTodo);
      setEditingTodo(null);
      onClose();
      await fetchTodos();
    } catch (err) {
      console.error("更新失敗", err);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box p={5} maxW="600px" mx="auto">
      <Heading mb={2}>代辦清單</Heading>
      {userName && (
        <Text fontSize="md" color="gray.600" mb={4}>
          歡迎回來，{userName}！
        </Text>
      )}
      <LayoutSwitcher page={page} setPage={setPage} />
      {page === 'list' && (
        <>
          <TodoForm onAdd={handleAddTodo} tags={tags} />
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            filter={filter}
            setFilter={setFilter}
            tags={tags}
          />
        </>
      )}
      {page === 'stats' && <Stats todos={todos} tags={tags} />}

      {/* 編輯 Modal */}
      <Modal isOpen={isOpen} onClose={handleCancelEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編輯代辦事項</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingTodo && (
              <TodoForm
                initialValues={editingTodo}
                onUpdate={handleUpdateTodo}
                onCancel={handleCancelEdit}
                tags={tags}
              />
            )}
          </ModalBody>
          {/* ModalFooter 留空或移除，因為 TodoForm 內有送出與取消按鈕 */}
        </ModalContent>
      </Modal>
    </Box>
  );
}
