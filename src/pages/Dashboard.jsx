import  { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
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
  const [searchTerm, setSearchTerm] = useState('');


  const filteredTodos = todos.filter((todo) => {
    const search = searchTerm.toLowerCase();
    return (
      !todo.complete &&  // 過濾掉已完成的
      (
        todo.title.toLowerCase().includes(search) ||
        todo.content?.toLowerCase().includes(search)
      )
    );
  });


  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const todos = await getAllTodos();
      setTodos(todos);
      setLoading(false);
    } catch (err) {
      console.error('取得待辦清單失敗', err);
      toast({
        title: '讀取失敗',
        description: '無法取得待辦清單資料，請稍後再試。',
        status: 'error',
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
        setUserName(user.displayName || '親愛的用戶');
        await fetchTodos();
      } else {
        toast({
          title: '尚未登入',
          description: '請先登入才能使用待辦功能',
          status: 'warning',
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
      console.error('新增失敗', err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const updated = todos.map((todo) =>
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      );
      const toggled = updated.find((t) => t.id === id);
      if (toggled) await updateTodo(toggled);
      setTodos(updated);
    } catch (err) {
      console.error('更新失敗', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error('刪除失敗', err);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    onOpen();
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    onClose();
  };

  const handleUpdateTodo = async (updatedTodo) => {
    try {
      await updateTodo(updatedTodo);
      setEditingTodo(null);
      onClose();
      await fetchTodos();
    } catch (err) {
      console.error('更新失敗', err);
    }
  };

  // 🔔 找出即將到期的事項（5 天內）
  const getNearDeadlineTodos = (todos) => {
    const today = new Date();
    return todos.filter((todo) => {
      if (!todo.deadline) return false;
      const deadline = new Date(todo.deadline);
      const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 5 && !todo.complete;
    });
  };

  const nearDeadlineTodos = getNearDeadlineTodos(todos);

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

      {/* 🔔 提醒區塊 */}
      {nearDeadlineTodos.length > 0 && (
        <Box bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="md" p={4} mb={4}>
          <Text fontWeight="bold" mb={2} color="orange.600">
            ⏰ 以下待辦事項即將到期（5 天內）：
          </Text>
          {nearDeadlineTodos.map((todo) => (
            <Box key={todo.id} mb={2}>
              <Text fontWeight="medium">{todo.title}</Text>
              <Text fontSize="sm" color="gray.600">
                截止日期：{new Date(todo.deadline).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </Box>
      )}

      <LayoutSwitcher page={page} setPage={setPage} />
      
      {page === 'list' && (
        <>
          <TodoForm onAdd={handleAddTodo} tags={tags} />
          
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="搜尋待辦標題或內容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
          />
        </InputGroup>
          <TodoList
            todos={filteredTodos}  // 只傳未完成的代辦
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
        </ModalContent>
      </Modal>
    </Box>
  );
}
