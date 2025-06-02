import React, { useEffect, useMemo, useState } from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
  HStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { usePagination } from '../hooks/usePagination';

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  // 新增排序欄位 state，預設以 create_at 排序
  const [sortBy, setSortBy] = useState('create_at');

  // 新增排序方向 state，true 表示升冪，false 表示降冪
  const [asc, setAsc] = useState(true);

  // 統一時間格式處理函式
  const parseTime = (val) => {
    if (!val) return 0;

    // Firebase Timestamp object（具備 toDate 方法）
    if (val.toDate && typeof val.toDate === 'function') {
      return val.toDate().getTime();
    }

    if (typeof val === 'string') {
      return new Date(val).getTime();
    }

    if (typeof val === 'number') {
      return val;
    }

    return 0;
  };

useEffect(() => {
  // 當 todos 更新時，重置搜尋和排序   
  console.log('Todos 更新，重置搜尋和排序',todos); 

  }, [todos, searchTerm, sortBy, asc]);


  // 搜尋 + 排序過濾資料
  const filteredTodos = useMemo(() => {
    const search = searchTerm.toLowerCase();

    // 先過濾
    let filtered = todos.filter(
      (todo) =>
        !todo.complete &&
        (todo.title?.toLowerCase().includes(search) ||
          todo.content?.toLowerCase().includes(search))
    );

    // 再排序
    filtered.sort((a, b) => {
      const aTime = parseTime(a[sortBy]);
      const bTime = parseTime(b[sortBy]);
      return asc ? aTime - bTime : bTime - aTime;
    });

    return filtered;
  }, [todos, searchTerm, sortBy, asc]);

  const handleAdd = (newTodo) => {
    onAdd(newTodo);
    onClose();
  };

  const { currentData, page, maxPage, next, prev } = usePagination(filteredTodos, 5);

  return (
    <>
      {/* 新增待辦按鈕 */}
      <Button colorScheme="teal" mb={4} onClick={onOpen}>
        新增待辦
      </Button>

      {/* 搜尋輸入框 */}
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

      {/* 排序選單 */}
      <HStack mb={4} spacing={2}>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} maxW="200px">
          <option value="created_at">建立時間</option>
          <option value="updated_at">更新時間</option>
          <option value="deadline">截止時間</option>
        </Select>
        <Button onClick={() => setAsc((prev) => !prev)} size="sm">
          {asc ? '升冪' : '降冪'}
        </Button>
      </HStack>

      {/* 待辦列表 */}
      <TodoList
        todos={currentData}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        filter={filter}
        setFilter={setFilter}
        tags={tags}
      />

      {/* 分頁控制 */}
      <HStack justifyContent="center" spacing={4} mt={4}>
        <Button onClick={prev} disabled={page === 1}>
          上一頁
        </Button>
        <Box>
          第 {page} 頁 / 共 {maxPage} 頁
        </Box>
        <Button onClick={next} disabled={page === maxPage}>
          下一頁
        </Button>
      </HStack>

      {/* 新增任務彈跳視窗 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新增待辦</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TodoForm onAdd={handleAdd} tags={tags} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
