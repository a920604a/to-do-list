import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ todos }) {
  const todosByDate = todos.reduce((acc, todo) => {
    if (!todo.deadline) return acc;
    const dateKey = new Date(todo.deadline).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(todo);
    return acc;
  }, {});

  return (
    <Calendar
      tileContent={({ date }) => {
        const dateKey = date.toDateString();
        const dayTodos = todosByDate[dateKey];
        return dayTodos ? (
          <Box>
            {dayTodos.map((todo) => (
              <Text key={todo.id} fontSize="xs" noOfLines={1} bg="blue.100" m="1" p="1" borderRadius="md">
                {todo.title}
              </Text>
            ))}
          </Box>
        ) : null;
      }}
    />
  );
}
