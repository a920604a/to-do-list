import React from 'react';
import { Box, Text, List, ListItem, Badge, useColorModeValue } from '@chakra-ui/react';

export default function CompletedTodoList({ completedTodos, visibleCount, onScroll }) {
  // **Hook 必須在函式最上方無條件呼叫**
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const scrollBarThumbColor = useColorModeValue('#a0aec0', '#718096');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      maxH="400px"
      overflowY="auto"
      onScroll={onScroll}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      p={4}
      bg={bgColor}
      boxShadow="sm"
      css={{
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: scrollBarThumbColor,
          borderRadius: '24px',
        },
      }}
    >
      <Text fontSize="lg" fontWeight="bold" mb={4} borderBottom="1px solid" borderColor={borderColor} pb={2}>
        已完成任務列表
      </Text>

      {completedTodos.length === 0 ? (
        <Text color="gray.500" textAlign="center" mt={10}>無已完成任務</Text>
      ) : (
        <List spacing={4}>
          {completedTodos.slice(0, visibleCount).map(todo => {
            const tagColorScheme = {
              工作: 'blue',
              生活: 'green',
              學習: 'purple',
              其他: 'gray',
            }[todo.tag] || 'gray';

            return (
              <ListItem
                key={todo.id}
                borderBottom="1px solid"
                borderColor={borderColor}
                py={3}
                _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
                rounded="md"
                transition="background-color 0.2s"
              >
                <Text fontWeight="semibold" fontSize="md" mb={1}>{todo.title}</Text>
                <Text fontSize="sm" color="gray.500" mb={1}>
                  完成時間: {todo.updated_at ? new Date(todo.updated_at).toLocaleString() : '未知'}
                </Text>
                <Badge colorScheme={tagColorScheme} fontSize="0.8em" px={2} py={1} rounded="full">
                  {todo.tag}
                </Badge>
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
}
