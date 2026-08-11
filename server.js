const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

app.use(express.json());

// Endpoint Root & Health dari Stage 1
app.get('/', (req, res) => {
  res.status(200).json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ==========================================
// STAGE 2: Read Endpoints
// ==========================================

// 1. Data sementara (In-memory storage) dengan 3 contoh task
let tasks = [
  { id: 1, title: 'Learn Express', done: true },
  { id: 2, title: 'Build CRUD API', done: false },
  { id: 3, title: 'Push to GitHub', done: false }
];

// 2. GET /tasks - Ambil semua task
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// 3. GET /tasks/:id - Ambil 1 task berdasarkan ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);

  // Jika task dengan ID tersebut tidak ditemukan, kembalikan status 404
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.status(200).json(task);
});

// Tambah task baru
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validasi: title gak boleh kosong
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: nextId, title: title.trim(), done: false };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ error: "Task not found" });

  const { title, done } = req.body;
  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (title !== undefined) task.title = title.trim();
  if (done !== undefined) task.done = done;

  res.status(200).json(task);
});

// Hapus task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).send(); // 204 gak perlu kirim JSON body
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});