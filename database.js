const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to SQLite database (creates a file named ministry.db)
const db = new sqlite3.Database('./ministry.db');

db.serialize(() => {
    // 1. Admin Table
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // 2. Verses Table
    db.run(`CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT,
        reference TEXT
    )`);

    // 3. Contacts Table (WhatsApp/Emails)
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, 
        value TEXT
    )`);

    // 4. Gallery Table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT
    )`);

    // Insert Default Admin (Username: admin, Password: password123)
    const defaultPassword = bcrypt.hashSync('password123', 10);
    db.run(`INSERT OR IGNORE INTO admins (username, password) VALUES ('admin', ?)`, [defaultPassword]);
    
    // Insert Default Data
    db.run(`INSERT OR IGNORE INTO verses (text, reference) VALUES ('God has not forgotten you. His love endures forever.', 'Psalm 138:8')`);
    db.run(`INSERT OR IGNORE INTO contacts (type, value) VALUES ('whatsapp', '0700007994')`);
});

module.exports = db;