// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
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
    const [userName, setUserName] = useState("");

  const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
          setUserName(user.user_metadata?.full_name || "親愛的用戶");
          return user.id;
      }
      return null;
  };


  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const userId = await getUserId();

        if (!userId) {
            console.warn("未登入，無法獲取待辦事項");
            alert("請先登入以查看待辦事項");
            setLoading(false);
            return;
        }
      getAllTodos().then(setTodos);
    }
    initialize();
  }, []);

  const handleAddTodo = async (todo) => {
    await addTodo(todo);
    const newTodos = await getAllTodos();
    setTodos(newTodos);
  };

  const handleToggle = async (id) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    );
    const toggled = updated.find(t => t.id === id);
    if (toggled) await updateTodo(toggled);
    setTodos(updated);
  };

  const handleDelete = async  (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };


  return (
    <Box p={5} maxW="600px" mx="auto">
      <Heading mb={4}>代辦清單</Heading>
      <LayoutSwitcher page={page} setPage={setPage} />
      {page === 'list' && (
        <>
          <TodoForm onAdd={handleAddTodo} />
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} filter={filter} setFilter={setFilter} tags={tags} />
        </>
      )}
      {page === 'stats' && <Stats todos={todos} tags={tags} />}
    </Box>
  );
}
