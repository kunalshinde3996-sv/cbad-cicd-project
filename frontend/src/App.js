import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function App() {
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = () => {
    axios.get(`${API}/tasks`).then(res => setTasks(res.data.tasks));
  };

  useEffect(() => {
    axios.get(`${API}/health`)
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus('API not reachable'));
    fetchTasks();
  }, []);

  const addTask = () => {
    if (!newTask) return;
    axios.post(`${API}/tasks`, { title: newTask })
      .then(() => { setNewTask(''); fetchTasks(); });
  };

  const deleteTask = (id) => {
    axios.delete(`${API}/tasks/${id}`).then(() => fetchTasks());
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>CBAD Task Manager</h1>
      <p>API Status: <strong style={{ color: status === 'OK' ? 'green' : 'red' }}>{status || 'checking...'}</strong></p>
      <hr />
      <h2>Tasks</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Enter task..."
          style={{ flex: 1, padding: '8px', fontSize: '14px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add
        </button>
      </div>
      {tasks.length === 0 && <p style={{ color: 'grey' }}>No tasks yet.</p>}
      {tasks.map(task => (
        <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '8px', borderRadius: '4px' }}>
          <span>{task.title}</span>
          <button onClick={() => deleteTask(task.id)} style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;