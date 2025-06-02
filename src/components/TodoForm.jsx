import React, { useState, useEffect, useRef } from 'react';
import { Input, Textarea, Button, VStack, RadioGroup, Radio, HStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

const possibleTags = ['工作', '學習', '個人', '其他'];

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoForm({ onAdd, initialValues, onUpdate, onCancel, tags = possibleTags }) {
  // 編輯模式初始化欄位
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [tag, setTag] = useState(initialValues?.tag || tags[0]);
  const [deadline, setDeadline] = useState(
    initialValues?.deadline
      ? new Date(initialValues.deadline).toISOString().slice(0, 10)
      : ''
  );

  const handleSubmit = () => {
    if (!title.trim()) return;

    const todoData = {
      id: initialValues?.id || uuidv4(),
      title,
      content,
      tag,
      complete: initialValues?.complete || false,
      created_at: initialValues?.created_at ? new Date(initialValues.created_at) : new Date(),
      updated_at: new Date(),  // 更新時間設為現在
      deadline: deadline ? new Date(deadline) : null,
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


  return (
    <VStack spacing={3} align="stretch" mb={6}>
      <Input placeholder="標題" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
          placeholder="內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => {
            const target = e.target;
            target.style.height = 'auto';           // 先重設高度
            target.style.height = `${target.scrollHeight}px`; // 根據內容調整高度
          }}
          resize="none"
          overflow="hidden"
          minH="80px"
          maxH="300px"
          ref={textareaRef}

        />

      
      <RadioGroup value={tag} onChange={setTag}>
        <HStack spacing={4}>
          {tags.map((t) => (
            <Radio key={t} value={t} colorScheme={tagColorMap[t]}>
              {t}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>

      {/* 新增截止日期欄位 */}
      <Input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        placeholder="截止日期"
      />

      <HStack spacing={4}>
        {(onUpdate && initialValues) ? (
          <>
            <Button colorScheme="blue" onClick={handleSubmit}>更新</Button>
            <Button onClick={onCancel}>取消</Button>
          </>
        ) : (
          <Button colorScheme="blue" onClick={handleSubmit}>新增</Button>
        )}
      </HStack>
    </VStack>
  );
}
