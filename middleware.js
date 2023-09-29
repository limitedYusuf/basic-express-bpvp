const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const helmet = require('helmet');

const app = express();
const port = 3000;

// untuk mengurai data JSON dan URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// keamanan dengan Helmet
app.use(helmet());

app.use(session({
   secret: 'yusuf-tampan', // kalau diganti auto error :v
   resave: false,
   saveUninitialized: true,
}));

// Passport Configuration
passport.use(new LocalStrategy(
   (username, password, done) => {
      const user = users.find((user) => user.username === username);
      if (!user || user.password !== password) {
         return done(null, false, { message: 'Username atau password tidak valid' });
      }
      return done(null, user);
   }
));
passport.serializeUser((user, done) => {
   done(null, user.id);
});
passport.deserializeUser((id, done) => {
   const user = users.find((user) => user.id === id);
   done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());

// Daftar pengguna
const users = [
   { id: 1, username: 'admin', password: 'password', role: 'admin' },
   { id: 2, username: 'user1', password: 'password', role: 'user' },
   { id: 3, username: 'user2', password: 'password', role: 'user' },
];

// untuk mendaftarkan pengguna
app.post('/register', (req, res) => {
   const { username, password, role } = req.body;
   const id = users.length + 1;
   users.push({ id, username, password, role });
   res.status(201).send('User registered successfully');
});

// untuk menampilkan daftar pengguna
app.get('/users', (req, res) => {
   res.json(users);
});

// untuk masuk (login)
app.post('/login',
   passport.authenticate('local', {
      successRedirect: '/checkRole',
      failureRedirect: '/login',
   })
);

// checkRole
app.get('/checkRole', (req, res) => {
   if (req.isAuthenticated()) {
      if (req.user.role === 'admin') {
         // Jika pengguna adalah admin, arahkan ke halaman admin
         res.redirect('/admin/dashboard');
      } else if (req.user.role === 'user') {
         // Jika pengguna adalah user biasa, arahkan ke halaman user
         res.redirect('/user/dashboard');
      }
   } else {
      res.redirect('/login');
   }
});

// otorisasi untuk admin
function isAdmin(req, res, next) {
   if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // Lanjutkan jika pengguna adalah admin
   }
   res.status(403).send('Akses dilarang');
}

// otorisasi untuk pengguna biasa
function isUser(req, res, next) {
   if (req.isAuthenticated() && req.user.role === 'user') {
      return next(); // Lanjutkan jika pengguna adalah user
   }
   res.status(403).send('Akses dilarang');
}

// untuk halaman admin yang hanya dapat diakses oleh admin
app.get('/admin/dashboard', isAdmin, (req, res) => {
   res.send('Selamat datang di dashboard admin, ' + req.user.username + '!');
});

// untuk halaman pengguna yang hanya dapat diakses oleh pengguna biasa
app.get('/user/dashboard', isUser, (req, res) => {
   res.send('Selamat datang di dashboard pengguna, ' + req.user.username + '!');
});

// untuk halaman login
app.get('/login', (req, res) => {
   res.send('Halaman Login');
});

// untuk logout
app.get('/logout', (req, res) => {
   req.session.destroy((err) => {
      res.redirect('/login');
   });
});

// untuk halaman utama
app.get('/', (req, res) => {
   res.send('Hello, World!');
});

// Memulai server
app.listen(port, () => {
   console.log(`Server berjalan di port ${port}`);
});
