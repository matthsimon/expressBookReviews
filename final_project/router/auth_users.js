const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let user = users.filter(u => u.username === username);
  return user.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let user = users.filter(u => u.username === username && u.password === password);
  return user.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Credentials missing"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User " + username + " logged in");
  } else {
    return res.status(403).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let book = books[req.params.isbn];

  if (!req.body.review) {
    return res.status(400).json({message: "Missing review"});
  }

  if (book) {
    book.reviews[username] = req.body.review;
    return res.status(200).send("Review of book " + req.params.isbn + " for " + username + " updated");
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let book = books[req.params.isbn];

  if (book) {
    delete book.reviews[username];
    return res.status(200).send("Review of book " + req.params.isbn + " for " + username + " deleted");
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
