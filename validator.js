const express = require('express');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// untuk menerima data pengguna baru
app.post('/register', [
  check('username').notEmpty().withMessage('Username harus diisi'),
  check('email').isEmail().withMessage('Email tidak valid'),
  check('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
], (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  res.status(201).json({ message: 'Pengguna berhasil terdaftar' });
});

// Handler akhir
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
