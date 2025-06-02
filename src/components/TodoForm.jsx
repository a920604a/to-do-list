import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button, VStack, RadioGroup, Radio, HStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoForm({ onAdd, onUpdate, initialValues, onCancel, tags }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(tags?.[0] || '其他');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setContent(initialValues.content || '');
      setTag(initialValues.tag || tags?.[0] || '其他');
    }
  }, [initialValues, tags]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const todo = {
      id: initialValues?.id || uuidv4(),
      title,
      content,
      tag,
      complete: initialValues?.complete || false,
      created_at: initialValues?.created_at || new Date(),
    };
    if (onUpdate) {
      onUpdate(todo);
    } else if (onAdd) {
      onAdd(todo);
      setTitle('');
      setContent('');
      setTag(tags?.[0] || '其他');
    }
  };

  return (
    <VStack spacing={3} align="stretch" mb={6}>
      <Input placeholder="標題" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="內容" value={content} onChange={(e) => setContent(e.target.value)} />
      <RadioGroup value={tag} onChange={setTag}>
        <HStack spacing={4}>
          {tags.map((t) => (
            <Radio key={t} value={t} colorScheme={tagColorMap[t]}>
              {t}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      <Button colorScheme="blue" onClick={handleSubmit}>
        {onUpdate ? '更新任務' : '新增任務'}
      </Button>
      {onCancel && (
        <Button onClick={onCancel} colorScheme="gray">
          取消
        </Button>
      )}
    </VStack>
  );
}
