const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory tasks (no DB needed for demo)
let tasks = [];
let idCounter = 1;

app.get('/', (req, res) => {
  res.json({ message: 'CBAD API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/tasks', (req, res) => {
  res.json({ tasks });
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const task = { id: idCounter++, title, done: false };
  tasks.push(task);
  res.json({ task });
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});