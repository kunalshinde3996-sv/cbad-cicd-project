import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

function App() {
  const [status, setStatus] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    axios.get(`${API}/health`)
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus('API not reachable'));

    axios.get(`${API}/tasks`)
      .then(res => setTasks(res.data.tasks))
      .catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h1>CBAD Task Manager</h1>
      <p>API Status: <strong>{status || 'checking...'}</strong></p>

      <hr />

      <h2>Tasks</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter task..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={() => {
          if (newTask) {
            setTasks([...tasks, { title: newTask, done: false }]);
            setNewTask('');
          }
        }} style={{ padding: '8px 16px' }}>Add</button>
      </div>

      {tasks.length === 0 && <p>No tasks yet.</p>}
      {tasks.map((task, i) => (
        <div key={i} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '8px', borderRadius: '4px' }}>
          {task.title}
        </div>
      ))}
    </div>
  );
}

export default App;