import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'todos_local'

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // 載入 localStorage 資料
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setTodos(JSON.parse(stored))
    }
  }, [])

  // 寫入 localStorage
  function saveTodos(newTodos) {
    setTodos(newTodos)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
  }

  function handleAdd() {
    if (!title.trim()) return
    const newTodo = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      completed: false,
    }
    saveTodos([newTodo, ...todos])
    setTitle('')
    setContent('')
  }

  function handleToggle(id) {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    saveTodos(newTodos)
  }

  function handleDelete(id) {
    const newTodos = todos.filter(todo => todo.id !== id)
    saveTodos(newTodos)
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 我的代辦清單 (純前端版)</h2>
      <div style={styles.inputGroup}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="輸入標題"
          style={styles.input}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd() }}
        />
      </div>
      <div style={styles.inputGroup}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="輸入內容"
          rows={3}
          style={styles.textarea}
        />
      </div>
      <button onClick={handleAdd} style={styles.addButton}>＋ 新增</button>

      <ul style={styles.list}>
        {todos.map(({ id, title, content, completed }) => (
          <li key={id} style={{ ...styles.listItem, opacity: completed ? 0.6 : 1 }}>
            <input
              type="checkbox"
              checked={completed}
              onChange={() => handleToggle(id)}
              style={styles.checkbox}
            />
            <div style={styles.todoContent}>
              <span
                style={{
                  ...styles.todoTitle,
                  textDecoration: completed ? 'line-through' : 'none',
                  color: completed ? '#888' : '#222',
                }}
              >
                {title}
              </span>
              <p style={styles.todoText}>{content}</p>
            </div>
            <button onClick={() => handleDelete(id)} style={styles.deleteButton}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    padding: 24,
    borderRadius: 10,
    boxShadow: '0 4px 12px rgb(0 0 0 / 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 24,
    userSelect: 'none',
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #ccc',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s ease',
  },
  addButton: {
    width: '100%',
    padding: '12px 0',
    fontSize: 16,
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginBottom: 24,
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
    maxHeight: 400,
    overflowY: 'auto',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: '10px 16px',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'flex-start',
    boxShadow: '0 1px 4px rgb(0 0 0 / 0.05)',
    transition: 'background-color 0.15s ease',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 16,
    marginTop: 6,
    cursor: 'pointer',
  },
  todoContent: {
    flexGrow: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  todoText: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
    whiteSpace: 'pre-wrap',
  },
  deleteButton: {
    backgroundColor: '#ff4d4f',
    border: 'none',
    borderRadius: 6,
    color: 'white',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 18,
    userSelect: 'none',
    transition: 'background-color 0.2s ease',
    marginLeft: 12,
  },
}
