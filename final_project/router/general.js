const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, '\t'));
  })
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.status(500).send("Error occurred while fetching the books.");
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    let book = undefined;
    for (let key in books) {
      if (key == isbn) {
        book = books[key];
        break;
      }
    }
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => {
    res.send(book);
  })
  .catch((error) => {
    res.status(404).send({ message: error });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const author = req.params.author;
    let foundBooks = [];
    for (let key in books) {
      if (books[key].author == author) {
        foundBooks.push(books[key]);
      }
    }
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("No books found by this author");
    }
  })
  .then((books) => {
    res.send(books);
  })
  .catch((error) => {
    res.status(404).send({ message: error });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    const title = req.params.title;
    let foundBooks = [];
    for (let key in books) {
      if (books[key].title == title) {
        foundBooks.push(books[key]);
      }
    }
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then((books) => {
    res.send(books);
  })
  .catch((error) => {
    res.status(404).send({ message: error });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let reviews = undefined;
  for (let key in books) {
    if (key == isbn) {
      reviews = books[key].reviews;
    }
  }
  res.send(reviews);
});

module.exports.general = public_users;
