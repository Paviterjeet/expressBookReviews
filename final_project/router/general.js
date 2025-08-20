const express = require('express');
let books = require("./booksdb.js");
let public_users = express.Router();

// ---------- TASK 1: Get all books ----------
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// ---------- TASK 2: Get book by ISBN ----------
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
});

// ---------- TASK 3: Get books by Author ----------
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author.toLowerCase();
    let result = [];

    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author) {
            result.push({ isbn: key, ...books[key] });
        }
    });

    return res.status(200).json(result);
});

// ---------- TASK 4: Get books by Title ----------
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title.toLowerCase();
    let result = [];

    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title) {
            result.push({ isbn: key, ...books[key] });
        }
    });

    return res.status(200).json(result);
});

// ---------- TASK 5: Get reviews by ISBN ----------
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
