// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Box, Heading } from '@chakra-ui/react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import Stats from '../components/Stats';
import LayoutSwitcher from '../components/LayoutSwitcher';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from '../utils/subDb';

const tags = ['工作', '學習', '個人', '其他'];

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('全部');
  const [page, setPage] = useState('list');

  useEffect(() => {
    getAllTodos().then(setTodos);
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
