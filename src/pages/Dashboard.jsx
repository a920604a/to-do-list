import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';

import StatsView from '../components/StatsView';
import CalendarView from '../components/CalendarView';
import ListView from '../components/ListView';
import LayoutSwitcher from '../components/LayoutSwitcher';

import { getAllTodos} from '../utils/firebaseDb';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const tags = ['工作', '學習', '個人', '其他'];

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState('list'); // 預覽模式：list, stats, calendar
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const toast = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const todos = await getAllTodos();
      setTodos(todos);
    } catch (err) {
      console.error('取得待辦清單失敗', err);
      toast({
        title: '讀取失敗',
        description: '無法取得待辦清單資料，請稍後再試。',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
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

      {page === 'list' && (<ListView todos={todos} tags={tags} />)}
      {page === 'stats' && <StatsView todos={todos} tags={tags} />}
      {page === 'calendar' && <CalendarView todos={todos} />}
    </Box>
  );
}
