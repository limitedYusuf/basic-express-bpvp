const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const app = express();
const port = 3000;

// untuk mengurai data JSON dan URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// EJS
app.set('view engine', 'ejs');

const uploadDirectory = path.join(__dirname, 'uploads');

// set multer
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDirectory);
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
   },
});
const upload = multer({ storage });

app.get('/', (req, res) => {
   res.render('upload');
});

app.post('/upload', upload.single('image'), (req, res) => {
   if (req.file) {
      // Jika gambar berhasil diunggah, tampilkan pesan sukses
      res.send('Gambar berhasil diunggah: ' + req.file.filename);
   } else {
      // Jika gagal, tampilkan pesan error
      res.send('Gagal mengunggah gambar');
   }
});

// Memulai server
app.listen(port, () => {
   console.log(`Server berjalan di port ${port}`);
});
