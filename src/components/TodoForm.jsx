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
export default function TodoForm({
  onAdd,
  initialValues,
  onUpdate,
  onCancel,
  tags = possibleTags,
  readOnly = false,  // 新增這個 props 控制是否只讀
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
    if (readOnly) return;  // 純檢視不送出
    if (!title.trim()) return;

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

  return (
    <VStack spacing={3} align="stretch" mb={6}>
      <Input
          placeholder="標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isReadOnly={readOnly}  // 只讀控制
      />
      <Textarea
          placeholder="內容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => {
            const target = e.target;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          resize="none"
          overflow="hidden"
          minH="80px"
          maxH="300px"
          ref={textareaRef}
          isReadOnly={readOnly}  // 只讀
      />

      <RadioGroup
        value={tag}
        onChange={readOnly ? undefined : setTag} // 只讀時不允許改變
      >
        <HStack spacing={4}>
          {tags.map((t) => (
            <Radio
              key={t}
              value={t}
              colorScheme={tagColorMap[t]}
              isDisabled={readOnly} // 只讀時禁用
            >
              {t}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>

      <Input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        placeholder="截止日期"
        isReadOnly={readOnly}
        pointerEvents={readOnly ? 'none' : 'auto'} // 防止日期選擇器彈出
      />

      <HStack spacing={4}>
        {!readOnly && (onUpdate && initialValues ? (
          <>
            <Button colorScheme="blue" onClick={handleSubmit}>更新</Button>
            <Button onClick={onCancel}>取消</Button>
          </>
        ) : (
          <Button colorScheme="blue" onClick={handleSubmit}>新增</Button>
        ))}
      </HStack>
    </VStack>
  );
}
