const express = require('express');
const app = express();
const PORT = 3000;

// Middleware biar bisa baca JSON dari request body nanti
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Server!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});