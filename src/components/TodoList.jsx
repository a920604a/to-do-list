import React from 'react';
import { Box, Checkbox, HStack, Tag, TagLabel, Text, VStack, Select } from '@chakra-ui/react';

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoList({ todos, onToggle, filter, setFilter, tags }) {
  const filteredTodos = todos
    .filter(todo => filter === '全部' || todo.tag === filter)
    .sort((a, b) => new Date(b.create_at) - new Date(a.create_at));

  return (
    <VStack spacing={3} align="stretch">
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} mb={3}>
        <option value="全部">全部</option>
        {tags.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>

      {filteredTodos.map((todo) => (
        <Box key={todo.id} p={3} borderWidth={1} borderRadius="md">
          <HStack justify="space-between" mb={1}>
            <Text fontWeight="bold">{todo.title}</Text>
            <Checkbox isChecked={todo.complete} onChange={() => onToggle(todo.id)}>完成</Checkbox>
          </HStack>
          <Text mb={1}>{todo.content}</Text>
          <Text fontSize="sm" color="gray.500" mb={1}>
            建立於：{new Date(todo.create_at).toLocaleString()}
          </Text>
          <Tag colorScheme={tagColorMap[todo.tag] || 'gray'}>
            <TagLabel>{todo.tag}</TagLabel>
          </Tag>
        </Box>
      ))}
    </VStack>
  );
}
