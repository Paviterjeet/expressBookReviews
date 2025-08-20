const express = require('express');
let books = require("./booksdb.js");
let public_users = express.Router();
//const axios = require("axios");

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
    let author = req.params.author;
    let result = [];
    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    });
    return res.status(200).json(result);
});

// ---------- TASK 4: Get books by Title ----------
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let result = [];
    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result.push(books[key]);
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


// ---------- TASK 10 - 13 Using Promises/Async-Await ----------

// Task 10: Get all books with Promise
public_users.get('/promise/books', function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(books);
    }).then(result => res.status(200).json(result));
});

// Task 11: Get book by ISBN with Promise
public_users.get('/promise/isbn/:isbn', function (req, res) {
    return new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Task 12: Get books by Author with async/await
public_users.get('/async/author/:author', async function (req, res) {
    let author = req.params.author;
    let result = [];
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            result.push(books[key]);
        }
    }
    res.status(200).json(result);
});

// Task 13: Get books by Title with async/await
public_users.get('/async/title/:title', async function (req, res) {
    let title = req.params.title;
    let result = [];
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            result.push(books[key]);
        }
    }
    res.status(200).json(result);
});

module.exports.general = public_users;
