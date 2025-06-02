import React from 'react';
import { InputGroup, InputLeftElement, Input } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function ListView({
  todos,
  filter,
  setFilter,
  tags,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  searchTerm,
  setSearchTerm,
}) {
  const filteredTodos = todos.filter((todo) => {
    const search = searchTerm.toLowerCase();
    return (
      !todo.complete &&
      (
        todo.title.toLowerCase().includes(search) ||
        todo.content?.toLowerCase().includes(search)
      )
    );
  });

  return (
    <>
      <TodoForm onAdd={onAdd} tags={tags} />
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="搜尋待辦標題或內容..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="white"
        />
      </InputGroup>
      <TodoList
        todos={filteredTodos}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        filter={filter}
        setFilter={setFilter}
        tags={tags}
      />
    </>
  );
}
