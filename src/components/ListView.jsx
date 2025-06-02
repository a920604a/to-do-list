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
  useToast,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

import TodoForm from './TodoForm';
import TodoList from './TodoList';
import { usePagination } from '../hooks/usePagination';

// 請自行依照實際路徑引入 Firebase 操作函式
import { addTodo, updateTodo, deleteTodo, getAllTodos } from '../utils/firebaseDb';

export default function ListView({ initialTodos = [], tags }) {
  /*** 狀態管理 ***/
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [asc, setAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [viewingTodo, setViewingTodo] = useState(null);

  const toast = useToast();

  /*** Modal 控制 ***/
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();

  /*** 資料初始化與刷新 ***/
  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      try {
        const allTodos = await getAllTodos();
        setTodos(allTodos);
      } catch (error) {
        toast({ title: '讀取代辦失敗', status: 'error', duration: 3000, isClosable: true });
      } finally {
        setLoading(false);
      }
    }
    fetchTodos();
  }, []);

  /*** 時間解析輔助函式 ***/
  const parseTime = (val) => {
    if (!val) return 0;
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

  /*** 篩選、搜尋、排序邏輯 ***/
  const filteredTodos = useMemo(() => {
    const search = searchTerm.toLowerCase();
    let filtered = todos.filter((todo) => {
      const passFilter = filter === '全部' || todo.tag === filter;
      const passSearch = !todo.complete &&
        (todo.title?.toLowerCase().includes(search) ||
         todo.content?.toLowerCase().includes(search));
      return passFilter && passSearch;
    });

    filtered.sort((a, b) => {
      const aTime = parseTime(a[sortBy]);
      const bTime = parseTime(b[sortBy]);
      return asc ? aTime - bTime : bTime - aTime;
    });

    return filtered;
  }, [todos, searchTerm, filter, sortBy, asc]);

  /*** 分頁 Hook ***/
  const { currentData, page, maxPage, next, prev } = usePagination(filteredTodos, 5);

  /*** 新增代辦 ***/
  const handleAdd = async (newTodo) => {
    setLoading(true);
    try {
      await addTodo(newTodo);
      const allTodos = await getAllTodos();
      setTodos(allTodos);
      toast({ title: '新增成功', status: 'success', duration: 2000, isClosable: true });
      onAddClose();
    } catch (error) {
      toast({ title: '新增失敗', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  /*** 編輯代辦相關 ***/
  // 開啟編輯彈窗
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    onEditOpen();
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setEditingTodo(null);
    onEditClose();
  };

  // 更新代辦
  const handleUpdateTodo = async (updatedTodo) => {
    setLoading(true);
    try {
      await updateTodo(updatedTodo);
      const allTodos = await getAllTodos();
      setTodos(allTodos);
      toast({ title: '更新成功', status: 'success', duration: 2000, isClosable: true });
      handleCancelEdit();
    } catch (error) {
      toast({ title: '更新失敗', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  /*** 切換完成狀態 ***/
  const handleToggle = async (id) => {
    setLoading(true);
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const updatedTodo = { ...todo, complete: !todo.complete };
      await updateTodo(updatedTodo);
      const allTodos = await getAllTodos();
      setTodos(allTodos);
    } catch (error) {
      toast({ title: '更新狀態失敗', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  /*** 刪除代辦 ***/
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTodo(id);
      const allTodos = await getAllTodos();
      setTodos(allTodos);
      toast({ title: '刪除成功', status: 'success', duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: '刪除失敗', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  /*** 檢視代辦 ***/
  const handleView = (todo) => {
    setViewingTodo(todo);
    onViewOpen();
  };

  /*** JSX UI ***/
  return (
    <>
      {/* 新增代辦按鈕 */}
      <Button colorScheme="teal" mb={4} onClick={onAddOpen} isLoading={loading}>
        新增待辦
      </Button>

      {/* 搜尋框 */}
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="搜尋待辦標題或內容..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          bg="white"
          isDisabled={loading}
        />
      </InputGroup>

      {/* 排序與切換升降冪 */}
      <HStack mb={4} spacing={2}>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW="200px"
          isDisabled={loading}
        >
          <option value="created_at">建立時間</option>
          <option value="updated_at">更新時間</option>
          <option value="deadline">截止時間</option>
        </Select>
        <Button onClick={() => setAsc((prev) => !prev)} size="sm" isDisabled={loading}>
          {asc ? '升冪' : '降冪'}
        </Button>
      </HStack>

      {/* 代辦列表 */}
      <TodoList
        todos={currentData}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView} // 檢視功能
        filter={filter}
        setFilter={setFilter}
        tags={tags}
        isLoading={loading}
      />

      {/* 分頁控制 */}
      <HStack justifyContent="center" spacing={4} mt={4}>
        <Button onClick={prev} disabled={page === 1 || loading}>
          上一頁
        </Button>
        <Box>
          第 {page} 頁 / 共 {maxPage} 頁
        </Box>
        <Button onClick={next} disabled={page === maxPage || loading}>
          下一頁
        </Button>
      </HStack>

      {/* 新增代辦 Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>新增待辦</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TodoForm onAdd={handleAdd} tags={tags} isLoading={loading} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 編輯代辦 Modal */}
      <Modal isOpen={isEditOpen} onClose={handleCancelEdit} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編輯代辦事項</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editingTodo && (
              <TodoForm
                initialValues={editingTodo}
                onUpdate={handleUpdateTodo}
                onCancel={handleCancelEdit}
                tags={tags}
                isLoading={loading}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 檢視代辦 Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => {
          setViewingTodo(null);
          onViewClose();
        }}
        isCentered
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>待辦詳情</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {viewingTodo ? (
              <TodoForm
                initialValues={viewingTodo}
                tags={tags}
                readOnly={true} // 只讀模式
              />
            ) : (
              <Box>讀取中...</Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
