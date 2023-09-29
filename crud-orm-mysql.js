const express = require('express');
const app = express();
const { User } = require('./models');

// Create
app.post('/create', async (req, res) => {
  try {
    const user = await User.create({ name: 'John', email: 'john@example.com' });
    res.send('Data berhasil ditambahkan');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

// Read
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

// Update
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('Data tidak ditemukan');
    }
    user.name = 'Updated Name';
    await user.save();
    res.send('Data berhasil diperbarui');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

// Delete
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send('Data tidak ditemukan');
    }
    await user.destroy();
    res.send('Data berhasil dihapus');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
