const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session Setup (For Admin Login)
app.use(session({
    secret: 'rev_julius_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Multer Setup (For Image Uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.adminId) return next();
    res.redirect('/admin/login');
};

// ================= ROUTES =================

// --- Public API Routes (Frontend uses these) ---
app.get('/api/verses', (req, res) => {
    db.all("SELECT * FROM verses", [], (err, rows) => res.json(rows));
});

app.get('/api/gallery', (req, res) => {
    db.all("SELECT * FROM gallery", [], (err, rows) => res.json(rows));
});

app.get('/api/contacts', (req, res) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => res.json(rows));
});


// --- Admin Login Routes ---
app.get('/admin/login', (req, res) => res.render('login', { error: null }));

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM admins WHERE username = ?", [username], (err, admin) => {
        if (admin && bcrypt.compareSync(password, admin.password)) {
            req.session.adminId = admin.id;
            res.redirect('/admin/dashboard');
        } else {
            res.render('login', { error: "Invalid credentials" });
        }
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});


// --- Admin Dashboard Routes ---
app.get('/admin/dashboard', isAuthenticated, (req, res) => {
    db.all("SELECT * FROM verses", [], (err, verses) => {
        db.all("SELECT * FROM contacts", [], (err, contacts) => {
            db.all("SELECT * FROM gallery", [], (err, gallery) => {
                res.render('dashboard', { verses, contacts, gallery });
            });
        });
    });
});

// Add Verse
app.post('/admin/add-verse', isAuthenticated, (req, res) => {
    db.run("INSERT INTO verses (text, reference) VALUES (?, ?)", [req.body.text, req.body.reference]);
    res.redirect('/admin/dashboard');
});

// Delete Verse
app.post('/admin/delete-verse/:id', isAuthenticated, (req, res) => {
    db.run("DELETE FROM verses WHERE id = ?", [req.params.id]);
    res.redirect('/admin/dashboard');
});

// Add Contact
app.post('/admin/add-contact', isAuthenticated, (req, res) => {
    db.run("INSERT INTO contacts (type, value) VALUES (?, ?)", [req.body.type, req.body.value]);
    res.redirect('/admin/dashboard');
});

// Delete Contact
app.post('/admin/delete-contact/:id', isAuthenticated, (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id]);
    res.redirect('/admin/dashboard');
});

// Upload Image
app.post('/admin/upload-image', isAuthenticated, upload.single('image'), (req, res) => {
    if (req.file) {
        const imageUrl = '/uploads/' + req.file.filename;
        db.run("INSERT INTO gallery (image_url) VALUES (?)", [imageUrl]);
    }
    res.redirect('/admin/dashboard');
});

// Delete Image
app.post('/admin/delete-image/:id', isAuthenticated, (req, res) => {
    db.get("SELECT * FROM gallery WHERE id = ?", [req.params.id], (err, row) => {
        // (You would also delete the physical file here in production)
        db.run("DELETE FROM gallery WHERE id = ?", [req.params.id]);
        res.redirect('/admin/dashboard');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});