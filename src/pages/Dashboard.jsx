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
  const [userId, setUserId] = useState(null);
  const toast = useToast();

  const fetchTodos = async () => {
    try {
      if (!userId) return;
      const todos = await getAllTodos(userId);
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

      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("登入 session 設定失敗", error.message);
          alert("登入失敗，請重新嘗試");
          setLoading(false);
          return;
        }

        window.history.replaceState(null, '', window.location.pathname);
      }

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast({
          title: "登入失敗",
          description: "請重新登入",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      setUserName(user.user_metadata?.full_name || "親愛的用戶");
      setUserId(user.id);

      try {
        const todos = await getAllTodos(user.id);
        setTodos(todos);
      } catch (err) {
        console.error("讀取失敗", err);
      }

      setLoading(false);
    };

    initialize();
  }, [toast]);

  const handleAddTodo = async (todo) => {
    try {
      await addTodo(todo, userId);
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
