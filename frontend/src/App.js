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

  const canAdd = newTask.trim().length > 0;

  const addTask = () => {
    if (!canAdd) return;
    axios.post(`${API}/tasks`, { title: newTask.trim() })
      .then(() => { setNewTask(''); fetchTasks(); });
  };

  const deleteTask = (id) => {
    axios.delete(`${API}/tasks/${id}`).then(() => fetchTasks());
  };

  const toggleDone = (task) => {
    axios.patch(`${API}/tasks/${task.id}`, { done: !task.done })
      .then(() => fetchTasks());
  };

  const ok = status === 'OK';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            CBAD Task Manager
          </h1>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
              ok
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            API: {status || 'checking...'}
          </span>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
          <div className="mb-5 flex gap-3">
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="What needs to be done?"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:ring-indigo-900"
            />
            <button
              onClick={addTask}
              disabled={!canAdd}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-600"
            >
              Add
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center dark:border-slate-700">
              <p className="text-base font-medium text-slate-500 dark:text-slate-400">No tasks yet</p>
              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Add your first task above.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map(task => {
                const done = !!task.done;
                return (
                  <li
                    key={task.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500"
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleDone(task)}
                      aria-label={`Mark "${task.title}" as ${done ? 'incomplete' : 'complete'}`}
                      className="h-5 w-5 cursor-pointer rounded border-slate-300 accent-indigo-600"
                    />
                    <span
                      className={`flex-1 break-words text-sm ${
                        done
                          ? 'text-slate-400 line-through dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
