import { getDatabase, ref, set, get, child, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// 你需要先安裝 uuid 套件：
// npm install uuid
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = 'todos'; // Firebase DB 路徑前綴

// 取得目前登入使用者的 uid
function getCurrentUserId() {
    const user = getAuth().currentUser;
    if (!user) {
        console.error('尚未登入');
        return null;
    }
    return user.uid;
}

// 取得所有屬於當前使用者的 todos
export async function getAllTodos() {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const db = getDatabase();
    const snapshot = await get(child(ref(db), `${DB_PATH}/${userId}`));
    if (snapshot.exists()) {
        const rawData = snapshot.val();
        return Object.entries(rawData).map(([id, data]) => ({ id, ...data }));
    } else {
        return [];
    }
}

// 新增 todo，使用 uuid 當 id
export async function addTodo(todo) {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const db = getDatabase();
    const id = uuidv4(); // 產生新的 UUID

    // 處理 deadline，如果無效就設為 10 年後
    const deadline = todo.deadline && !isNaN(new Date(todo.deadline))
        ? new Date(todo.deadline).getTime()
        : new Date(new Date().setFullYear(new Date().getFullYear() + 10)).getTime();



    await set(ref(db, `${DB_PATH}/${userId}/${id}`), {
        ...todo,
        deadline, // ✅ 明確寫入 timestamp
        created_at: Date.now(),
        updated_at: Date.now(),
        id,  // 把 id 寫進資料
    });
    return id;
}

// 更新 todo
export async function updateTodo(todo) {
    const userId = getCurrentUserId();
    if (!userId || !todo.id) return;

    const db = getDatabase();
    const updates = {};
    updates[`${DB_PATH}/${userId}/${todo.id}`] = {
        ...todo,
        updated_at: Date.now(),
    };
    await update(ref(db), updates);
}

// 刪除 todo
export async function deleteTodo(id) {
    const userId = getCurrentUserId();
    if (!userId) return;

    const db = getDatabase();
    await remove(ref(db, `${DB_PATH}/${userId}/${id}`));
}
