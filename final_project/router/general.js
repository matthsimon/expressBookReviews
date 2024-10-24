const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(409).json({message: "User already exists"});
    } else {
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).send("User " + username + " registered");
    }
  } else {
    return res.status(400).json({message: "Credentials missing"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const fetch_books = new Promise((resolve, reject) => {
    resolve(books);
  });

  fetch_books.then(books => {
    res.status(200).send(JSON.stringify(books, null, " "));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const fetch_book = new Promise((resolve, reject) => {
    let book = books[req.params.isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  fetch_book.then(book => {
    res.status(200).send(JSON.stringify(book, null, " "));
  }).catch(err => {
    res.status(404).json({message: err});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const fetch_books = new Promise((resolve, reject) => {
    let book_by_author = [];
    for (let book of Object.values(books)) {
      if (book.author === req.params.author) {
        book_by_author.push(book);
      }
    }

    if (book_by_author.length > 0) {
      resolve(book_by_author);
    } else {
      reject("No book found");
    }
  });

  fetch_books.then(books => {
    res.status(200).send(JSON.stringify(books, null, " "));
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const fetch_books = new Promise((resolve, reject) => {
    let book_by_title = [];
    for (let book of Object.values(books)) {
      if (book.title === req.params.title) {
        book_by_title.push(book);
      }
    }

    if (book_by_title.length > 0) {
      resolve(book_by_title);
    } else {
      reject("No book found");
    }
  });

  fetch_books.then(books => {
    res.status(200).send(JSON.stringify(books, null, " "));
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const fetch_review = new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(book.reviews);
    } else {
      reject("Book not found");
    }
  });

  fetch_review.then(reviews => {
    res.status(200).send(JSON.stringify(reviews, null, " "));
  }).catch(err => {
    res.status(404).json({message: err});
  });
});

module.exports.general = public_users;
