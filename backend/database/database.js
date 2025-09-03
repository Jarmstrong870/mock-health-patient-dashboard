// Import the SQLite3 driver (better-sqlite3 is synchronous & very simple to use)
const Database = require("better-sqlite3");
const path = require("path");

// ---------------------------------------------------------------------------
// STEP 1 - Open (or create) the SQLite database file inside the /database folder
// ---------------------------------------------------------------------------
// Using path.join ensures cross-platform compatibility (Windows, Mac, Linux)
const dbPath = path.join(__dirname, "staff.db"); // will create in backend/database/
const db = new Database(dbPath);

console.log(` Connected to SQLite database at ${dbPath}`);

// ---------------------------------------------------------------------------
// STEP 2 - Create the 'users' table if it doesn’t already exist
// ---------------------------------------------------------------------------
// - id: unique identifier for each user
// - username: staff login username (must be unique)
// - email: staff work email (must be unique)
// - password: hashed password (we NEVER store plain text)
// - created_at: timestamp of when account was created
// ---------------------------------------------------------------------------
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log(" Users table is ready (or already exists).");

// ---------------------------------------------------------------------------
// STEP 3 - Functions for interacting with the database
// ---------------------------------------------------------------------------

// Function to add a new user
function addUser(username, email, hashedPassword) {
  const stmt = db.prepare(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
  );
  return stmt.run(username, email, hashedPassword); // returns info about the insert
}

// Function to find a user by username
function findUserByUsername(username) {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  return stmt.get(username); // .get() returns one row or undefined
}

// (Optional) Function to find a user by email
function findUserByEmail(email) {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  return stmt.get(email);
}

// Export functions so they can be used in index.js (backend routes)
module.exports = {
  addUser,
  findUserByUsername,
  findUserByEmail,
};
