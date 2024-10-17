const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log(`cek ada data user gak ${JSON.stringify(users)}`);
  const { username, password } = req.body; // Mengambil username dan password dari body permintaan

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" }); // Menangani kesalahan otentikasi
  }

  const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' }); // Membuat token JWT

  return res.status(200).json({
    message: 'customer successfuly login in',
    token: token
  }); // Mengembalikan token kepada pengguna
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const token = req.headers.authorization;
  console.log(`ini log token ${token}`);
  const decoded = jwt.verify(token, 'your_jwt_secret'); // Ganti jwtSecret dengan 'your_jwt_secret'
  const username = decoded.username;

  if (books[isbn]) {
      if (!books[isbn].reviews) {
          books[isbn].reviews = {};
      }
      books[isbn].reviews[username] = review;
      res.status(200).json({ message: "Review added/updated successfully" });
  } else {
      res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, 'your_jwt_secret'); // Ganti jwtSecret dengan 'your_jwt_secret'
  const username = decoded.username;

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.status(200).json({ message: "Review deleted successfully" });
  } else {
      res.status(404).json({ message: "Review not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
