import React from 'react';
import {
  Box,
  Checkbox,
  HStack,
  Tag,
  TagLabel,
  Text,
  VStack,
  Select,
  Button,
} from '@chakra-ui/react';

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoList({ todos, onToggle, onDelete, onEdit, onView, filter, setFilter, tags }) {
  const filteredTodos = todos
    .filter((todo) => filter === '全部' || todo.tag === filter)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <VStack spacing={3} align="stretch">
      <Select value={filter} onChange={(e) => setFilter(e.target.value)} mb={3}>
        <option value="全部">全部</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>

      {filteredTodos.map((todo) => (
      <Box
        key={todo.id}
        p={4}
        borderWidth={1}
        borderRadius="md"
        boxShadow="md"
        bg={todo.complete ? 'gray.100' : 'white'}
        _hover={{ bg: 'gray.50' }}
        cursor="pointer"
        onClick={() => onView(todo)}
      >
        <HStack justify="space-between" mb={1}>
          <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
            {todo.title}
          </Text>
          <HStack spacing={2}>
            <Checkbox
              isChecked={todo.complete}
              onChange={(e) => {
                e.stopPropagation();
                onToggle(todo.id);
              }}
            >
              完成
            </Checkbox>
            <Button
              size="sm"
              colorScheme="teal"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
            >
              編輯
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
            >
              刪除
            </Button>
          </HStack>
        </HStack>
        <Text mb={2} whiteSpace="pre-wrap" color="gray.700" isTruncated>
          {todo.content || '（無內容）'}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={1}>
          建立於：{new Date(todo.created_at).toLocaleString()}
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          截止日期：{todo.deadline ? new Date(todo.deadline).toLocaleDateString() : '無'}
        </Text>
        <Text fontSize="xs" color="gray.400" mb={1}>
          最後更新：{new Date(todo.updated_at).toLocaleString()}
        </Text>
        <Tag colorScheme={tagColorMap[todo.tag] || 'gray'}>
          <TagLabel>{todo.tag}</TagLabel>
        </Tag>
      </Box>
    ))}

    </VStack>
  );
}
