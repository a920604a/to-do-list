import { supabase } from './supabase';

const TABLE_NAME = 'todos';

// 取得目前登入使用者的 ID
async function getUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('取得使用者失敗:', error?.message);
    return null;
  }
  return data.user.id;
}

// 取得所有 todos（限目前使用者）
export async function getAllTodos() {
  const userId = await getUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('取得 todos 發生錯誤:', error);
    return [];
  }
  return data;
}

// 新增 todo
export async function addTodo(todo) {
  const userId = await getUserId();
  if (!userId) return;

  const todoWithUser = {
    ...todo,
    user_id: userId,
  };

  const { error } = await supabase.from(TABLE_NAME).insert([todoWithUser]);
  if (error) {
    console.error('新增 todo 發生錯誤:', error);
  }
}

// 更新 todo（確保只能更新自己的資料）
export async function updateTodo(todo) {
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from(TABLE_NAME)
    .update(todo)
    .eq('id', todo.id)
    .eq('user_id', userId); // 防止跨用戶操作

  if (error) {
    console.error('更新 todo 發生錯誤:', error);
  }
}

// 刪除 todo（限制只能刪除自己的）
export async function deleteTodo(id) {
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // 防止跨用戶操作

  if (error) {
    console.error('刪除 todo 發生錯誤:', error);
  }
}

// 清空所有屬於使用者的 todos
export async function clearTodos() {
  const userId = await getUserId();
  if (!userId) return;

  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('清除 todos 發生錯誤:', error);
  }
}
