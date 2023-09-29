const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const xss = require('xss');
const ejs = require('ejs');

const app = express();
const port = 3000;

// untuk mengurai data JSON dan URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// keamanan dengan Helmet
app.use(helmet());

// untuk manajemen sesi pengguna
app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// cookie-parser
app.use(cookieParser());

// untuk CSRF
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// untuk menyimpan CSRF token dalam cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

// EJS
app.set('view engine', 'ejs');

// untuk halaman formulir
app.get('/', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// untuk mengelola data yang dikirim dari formulir
app.post('/submit', (req, res) => {
  const { username, password } = req.body;

  res.send(`Data yang dikirim: Username: ${username}, Password: ${password}`);
});

// Memulai server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
