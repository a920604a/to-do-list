import React, { useState } from 'react';
import { Input, Textarea, Button, VStack, RadioGroup, Radio, HStack } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

const possibleTags = ['工作', '學習', '個人', '其他'];

const tagColorMap = {
  工作: 'red',
  學習: 'green',
  個人: 'blue',
  其他: 'gray',
};

export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState(possibleTags[0]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: uuidv4(),
      title,
      content,
      tag,
      complete: false,
      create_at: new Date(),
    });
    setTitle('');
    setContent('');
    setTag(possibleTags[0]);
  };

  return (
    <VStack spacing={3} align="stretch" mb={6}>
      <Input placeholder="標題" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea placeholder="內容" value={content} onChange={(e) => setContent(e.target.value)} />
      <RadioGroup value={tag} onChange={setTag}>
        <HStack spacing={4}>
          {possibleTags.map((t) => (
            <Radio key={t} value={t} colorScheme={tagColorMap[t]}>
              {t}
            </Radio>
          ))}
        </HStack>
      </RadioGroup>
      <Button colorScheme="blue" onClick={handleSubmit}>新增</Button>
    </VStack>
  );
}
