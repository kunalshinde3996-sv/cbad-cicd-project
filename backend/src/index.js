const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CBAD API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Tasks routes
app.get('/tasks', async (req, res) => {
  res.json({ tasks: [], message: 'Tasks endpoint working' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});