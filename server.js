const express = require('express');
const app = express();
const PORT = 3000;

// Middleware biar bisa baca JSON dari request body nanti
app.use(express.json());

// Ganti endpoint '/' yang lama jadi ini:
app.get('/', (req, res) => {
  res.status(200).json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

// Tambah endpoint health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});