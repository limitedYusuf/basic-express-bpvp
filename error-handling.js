const express = require('express');
const app = express();
const port = 3000;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan pada server!');
});

app.get('/generate-error', (req, res, next) => {
  next(new Error('Ini adalah contoh kesalahan!'));
});

app.use((req, res) => {
  res.status(404).send('Halaman tidak ditemukan');
});

// Memulai server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
