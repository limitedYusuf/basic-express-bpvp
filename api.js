const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

// Konfigurasi database
const sequelize = new Sequelize('latihan_express_orm', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// Model Item
const Item = sequelize.define('item', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Middleware data JSON
app.use(bodyParser.json());

// Endpoint untuk mendapatkan semua data
app.get('/api/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

// Endpoint untuk mendapatkan data berdasarkan ID
app.get('/api/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = await Item.findByPk(itemId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Data tidak ditemukan' });
  }
});

// Endpoint untuk menambahkan data baru
app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  try {
    const createdItem = await Item.create(newItem);
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ error: 'Gagal menambahkan data' });
  }
});

// Endpoint untuk memperbarui data berdasarkan ID
app.put('/api/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const item = await Item.findByPk(itemId);

  if (item) {
    try {
      await item.update(updatedItem);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: 'Gagal memperbarui data' });
    }
  } else {
    res.status(404).json({ error: 'Data tidak ditemukan' });
  }
});

// Endpoint untuk menghapus data berdasarkan ID
app.delete('/api/items/:id', async (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = await Item.findByPk(itemId);

  if (item) {
    try {
      await item.destroy();
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: 'Gagal menghapus data' });
    }
  } else {
    res.status(404).json({ error: 'Data tidak ditemukan' });
  }
});

// sync
sequelize.sync().then(() => {
  console.log('Tabel telah disinkronisasi');
  // Memulai server
  app.listen(port, () => {
    console.log(`Server API berjalan di port ${port}`);
  });
});
