import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Textarea,
  Button,
  VStack,
  RadioGroup,
  Radio,
  HStack,
  FormControl,
  FormLabel,
  Box,
  Icon,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const possibleTags = ['工作', '學習', '個人', '其他'];

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoForm({
  onAdd,
  initialValues,
  onUpdate,
  onCancel,
  tags = possibleTags,
  readOnly = false,
}) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [tag, setTag] = useState(initialValues?.tag || tags[0]);
  const [deadline, setDeadline] = useState(
    initialValues?.deadline
      ? new Date(initialValues.deadline).toISOString().slice(0, 10)
      : ''
  );

  const handleSubmit = () => {
    if (readOnly || !title.trim()) return;

    const todoData = {
      id: initialValues?.id || uuidv4(),
      title,
      content,
      tag,
      complete: initialValues?.complete || false,
      created_at: initialValues?.created_at ? new Date(initialValues.created_at) : new Date(),
      updated_at: new Date(),
      deadline: deadline && !isNaN(new Date(deadline))
        ? new Date(deadline)
        : new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
    };

    if (onAdd && !initialValues) {
      onAdd(todoData);
      setTitle('');
      setContent('');
      setTag(tags[0]);
      setDeadline('');
    }

    if (onUpdate && initialValues) {
      onUpdate(todoData);
    }
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={6}
      borderRadius="xl"
      boxShadow="md"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s"
    >
      {readOnly && (
        <Badge colorScheme="yellow" mb={2}>
          檢視模式
        </Badge>
      )}

      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>標題</FormLabel>
          <Input
            placeholder="輸入標題"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            isReadOnly={readOnly}
          />
        </FormControl>

        <FormControl>
          <FormLabel>內容</FormLabel>
          <Textarea
            placeholder="輸入詳細內容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              const target = e.target;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
            resize="none"
            overflow="hidden"
            minH="100px"
            maxH="300px"
            ref={textareaRef}
            isReadOnly={readOnly}
          />
        </FormControl>

        <FormControl>
          <FormLabel>分類標籤</FormLabel>
          <RadioGroup value={tag} onChange={readOnly ? undefined : setTag}>
            <HStack spacing={4}>
              {tags.map((t) => (
                <Radio
                  key={t}
                  value={t}
                  colorScheme={tagColorMap[t]}
                  isDisabled={readOnly}
                >
                  {t}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>
            <HStack spacing={2}>
              <Icon as={FiCalendar} />
              <span>截止日期</span>
            </HStack>
          </FormLabel>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            isReadOnly={readOnly}
            pointerEvents={readOnly ? 'none' : 'auto'}
          />
        </FormControl>

        {!readOnly && (
          <HStack justify="flex-end" pt={2}>
            {onUpdate && initialValues ? (
              <>
                <Button colorScheme="blue" onClick={handleSubmit}>
                  更新
                </Button>
                <Button variant="outline" onClick={onCancel}>
                  取消
                </Button>
              </>
            ) : (
              <Button colorScheme="teal" onClick={handleSubmit}>
                新增
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
