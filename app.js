const express = require("express");
const todosRoutes = require('./routes/tododb.js'); // Import routes
const db = require("./database/db.js"); // Import database connection
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Default ke port 3000 jika PORT tidak disediakan

// Middleware untuk parsing body dan session
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Gunakan default jika SESSION_SECRET tidak tersedia
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

// Konfigurasi EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Route untuk halaman utama
app.get("/", (req, res) => {
    res.render("index", {
        layout: 'layout/mainlayout.ejs'
    });
});

// Route untuk tampilan TODO dengan database
app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM pegawai_kebun', (err, todos) => {
        if (err) {
            console.error("Database query error:", err.message);
            return res.status(500).send('Internal Server Error');
        }
        res.render('todo', {
            layout: 'layout/mainlayout.ejs',
            todos: todos
        });
    });
});

// Gunakan routes dari `tododb.js`
app.use('/api/todos', todosRoutes);

// Middleware untuk menangani halaman 404
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
