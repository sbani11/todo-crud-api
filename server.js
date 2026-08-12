const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const Database = require('better-sqlite3');

app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Buka database (otomatis bikin file tasks.db kalau belum ada)
const db = new Database('tasks.db');

// Bikin tabel kalau belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
  )
`);

// Seed 3 contoh task cuma kalau tabelnya masih kosong
const countResult = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (countResult.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Learn Express', 1); // 1 = true
  insert.run('Build CRUD API', 0); // 0 = false
  insert.run('Push to GitHub', 0);
}

// Helper untuk ubah 1/0 dari SQLite jadi true/false di JSON balasan API
const formatTask = (task) => ({ ...task, done: Boolean(task.done) });


app.get('/tasks', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks').all();
  res.status(200).json(rows.map(formatTask));
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  // Ambil pakai query parameter (?) biar aman
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!row) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.status(200).json(formatTask(row));
});

// Tambah task baru
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }

  // Insert ke SQLite
  const info = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title.trim(), 0);

  // Ambil ID yang baru aja dibikin sama database
  const newTask = {
    id: info.lastInsertRowid,
    title: title.trim(),
    done: false
  };
  
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
  res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});