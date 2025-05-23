const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchTodos() {
    const res = await fetch(`${API_URL}/todos`)
    return res.json()
}

// 新增待辦時同時帶入 title 與 content
export async function addTodo(title, content) {
    const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    })
    return res.json()
}

// 更新完成狀態
export async function updateTodo(id, completed) {
    const res = await fetch(`${API_URL}/todos/${id}?completed=${completed}`, {
        method: 'PUT',
    })
    return res.json()
}

// 刪除待辦
export async function deleteTodo(id) {
    const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
    })
    return res.json()
}
