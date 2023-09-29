const express = require('express');
const app = express();
const port = 3000;

// ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
   res.send('Ini adalah halaman beranda');
});

app.get('/user/:id', (req, res) => {
   const userId = req.params.id;
   const userData = {
      name: 'John Doe',
      email: 'john@example.com'
   };

   res.render('user', { user: userData });
});

app.use(express.json());

// Middleware pada tingkat rute
let authorized = false;
app.get('/secure', (req, res, next) => {
   if (authorized) {
      next(); // Lanjutkan
   } else {
      res.status(401).send('Tidak diizinkan');
   }
});

app.get('/profile', (req, res) => {
   // Mengatur status kode respons
   res.status(200);

   // Mengatur header respons
   res.setHeader('Content-Type', 'text/html');

   // Mengirim konten respons
   res.send('<h1>Profil Pengguna</h1>');
});

app.listen(port, () => {
   console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
