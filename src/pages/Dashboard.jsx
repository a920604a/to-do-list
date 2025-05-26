// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Spinner, Center, useToast } from '@chakra-ui/react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Stats from '../components/Stats';
import LayoutSwitcher from '../components/LayoutSwitcher';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from '../utils/subDb';
import { supabase } from "../utils/supabase";

const tags = ['工作', '學習', '個人', '其他'];

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('全部');
  const [page, setPage] = useState('list');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const toast = useToast();

  const getUserId = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("取得使用者失敗", error.message);
      toast({
        title: "登入狀態錯誤",
        description: "請重新登入。",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return null;
    }
    if (user) {
      setUserName(user.user_metadata?.full_name || "親愛的用戶");
      return user.id;
    }
    return null;
  };

  const fetchTodos = async () => {
    try {
      const todos = await getAllTodos();
      setTodos(todos);
    } catch (err) {
      console.error("取得待辦清單失敗", err);
      toast({
        title: "讀取失敗",
        description: "無法取得待辦清單資料，請稍後再試。",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const userId = await getUserId();
      if (userId) await fetchTodos();
      else {
        alert("請先登入以查看待辦事項");
      }
      setLoading(false);
    };
    initialize();
  }, []);

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
          <TodoForm onAdd={handleAddTodo} />
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            filter={filter}
            setFilter={setFilter}
            tags={tags}
          />
        </>
      )}
      {page === 'stats' && <Stats todos={todos} tags={tags} />}
    </Box>
  );
}
