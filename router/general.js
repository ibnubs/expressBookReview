const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus disediakan." });
  }

  if (users[username]) {
    return res.status(400).json({ message: "Username sudah ada." });
  }

  // users[username] = { password }; // Simpan pengguna baru
  users.push({ username, password });
  console.log(`data users baru ${JSON.stringify(users)}`);
  return res.status(201).json({ message: "Customer successfully registered. Now you can login " });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.status(200).json({
    status:'success',
    books
  });
  console.log(` ini log get book ${books}`)
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Menggunakan Promise untuk mendapatkan detail buku berdasarkan ISBN
  const isbn = req.params.isbn;
  console.log(`ini log param isbn ${isbn}`);
  
  const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ message: "Book not found" });
      }
    });
  };

  getBookByIsbn(isbn)
    .then(book => {
      return res.status(200).json(book);
    })
    .catch(err => {
      return res.status(404).json(err);
    });
  // Pastikan tidak ada respons lain yang dikirim di luar Promise
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  console.log(`ini log param author ${author}`);

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject({ message: "author not found" });
      }
    });
  };

  getBooksByAuthor(author)
    .then(booksByAuthor => {
      return res.status(200).json({ booksByAuthor });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  console.log(`ini log param title ${title}`);

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({ message: "title not found" });
      }
    });
  };

  getBooksByTitle(title)
    .then(booksByTitle => {
      return res.status(200).json({ booksByTitle });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]; 
  console.log(`cekk book ${JSON.stringify(book)}`)
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "review based on isbn not found" });
  }
});

module.exports.general = public_users;
