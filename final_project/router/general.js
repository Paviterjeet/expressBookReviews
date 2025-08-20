const express = require('express');
let books = require("./booksdb.js");
let public_users = express.Router();
const axios = require("axios"); // for Task 13

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


// ========== TASK 10–13 ==========

// TASK 10: Get all books using Promise
public_users.get('/promise/books', (req, res) => {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ message: err }));
});

// TASK 11: Get book by ISBN using Promise
public_users.get('/promise/isbn/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// TASK 12: Get books by Author using Promise
public_users.get('/promise/author/:author', (req, res) => {
    let author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        let result = [];
        Object.keys(books).forEach(key => {
            if (books[key].author.toLowerCase() === author) {
                result.push({ isbn: key, ...books[key] });
            }
        });
        if (result.length > 0) resolve(result);
        else reject("No books found for this author");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// TASK 13: Get books by Title using async-await + Axios
public_users.get('/async/title/:title', async (req, res) => {
    try {
        let title = req.params.title.toLowerCase();
        // Call your own API using axios
        let response = await axios.get("http://localhost:5000/"); // base books list
        let booksData = response.data;

        let result = [];
        Object.keys(booksData).forEach(key => {
            if (booksData[key].title.toLowerCase() === title) {
                result.push({ isbn: key, ...booksData[key] });
            }
        });

        if (result.length > 0) return res.status(200).json(result);
        return res.status(404).json({ message: "No books found with this title" });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching data" });
    }
});


module.exports.general = public_users;
