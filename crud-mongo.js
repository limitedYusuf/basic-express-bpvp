const express = require('express');
const app = express();

const mongoose = require('mongoose');

// koneksi ke MongoDB
mongoose.connect('mongodb://localhost/crud', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Terhubung ke MongoDB');

  db.db.createCollection('mycollection', (err, res) => {
    if (err) throw err;
    console.log('Basis data "crud" dan koleksi "mycollection" berhasil dibuat.');
    db.close();
  });
});

db.on('error', (err) => {
  console.error('Koneksi MongoDB error:', err);
});

// model Mongoose
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Create
app.post('/create', async (req, res) => {
  const newUser = new User({ name: 'John', email: 'john@example.com' });
  try {
    await newUser.save();
    res.send('Data berhasil ditambahkan');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

// Read
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
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
    const updatedUser = await User.findByIdAndUpdate(id, { name: 'Updated Name' });
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
    await User.findByIdAndDelete(id);
    res.send('Data berhasil dihapus');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
});

app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
