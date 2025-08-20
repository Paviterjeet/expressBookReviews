const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];  // store registered users

// Helper: check if user exists
const isValid = (username) => {
    return users.some(u => u.username === username);
};

// Helper: authenticate user
const authenticatedUser = (username, password) => {
    return users.some(u => u.username === username && u.password === password);
};

// ---------- TASK 6: Register new user ----------
regd_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (isValid(username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// ---------- TASK 7: Login user ----------
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;
    if (!authenticatedUser(username, password)) {
        return res.status(403).json({ message: "Invalid username or password" });
    }
    let token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
    req.session.authorization = { accessToken: token, username };
    return res.status(200).json({ message: "User successfully logged in", token });
});

// ---------- TASK 8: Add/Modify review ----------
regd_users.put("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified", reviews: books[isbn].reviews });
});

// ---------- TASK 9: Delete review ----------
regd_users.delete("/auth/review/:isbn", (req,res) => {
    let isbn = req.params.isbn;
    let username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted", reviews: books[isbn].reviews });
    }

    return res.status(404).json({ message: "No review found for this user" });
});

module.exports.authenticated = regd_users;
