const express = require('express');
const app = express();
const db = require('./dbConfig');

// Create
app.post('/create', (req, res) => {
  const data = { name: 'John', email: 'john@example.com' };
  db.query('INSERT INTO users SET ?', data, (err, result) => {
    if (err) throw err;
    res.send('Data berhasil ditambahkan');
  });
});

// Read
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Update
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const newData = { name: 'Updated Name' };
  db.query('UPDATE users SET ? WHERE id = ?', [newData, id], (err, result) => {
    if (err) throw err;
    res.send('Data berhasil diperbarui');
  });
});

// Delete
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.send('Data berhasil dihapus');
  });
});

app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
