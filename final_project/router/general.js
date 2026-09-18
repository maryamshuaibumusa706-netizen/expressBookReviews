const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 - Sync
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Task 2 - Sync
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });

// Task 3 - Sync
public_users.get('/author/:author',function (req, res) {
  let ans = []
  for(const [isbn, book] of Object.entries(books)){
    if(book.author === req.params.author){
      ans.push(book);
    }
  }
  res.send(JSON.stringify(ans,null,4));
});

// Task 4 - Sync
public_users.get('/title/:title',function (req, res) {
  let ans = []
  for(const [isbn, book] of Object.entries(books)){
    if(book.title === req.params.title){
      ans.push(book);
    }
  }
  res.send(JSON.stringify(ans,null,4));
});

// Task 5 - Sync
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

// Task 10 - Get all books using async callback
public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
      resolve(books);
    });
    get_books.then((result)=>res.send(JSON.stringify(result,null,4)))
  });
  
  // Task 11 - Get book by ISBN using Promise
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_book = new Promise((resolve,reject)=>{
      if(books[isbn]){
          resolve(books[isbn]);
      } else {
          reject({message:"ISBN not found"});
      }
    });
    get_book.then((result)=>res.send(result)).catch((err)=>res.send(err))
  });
  
  // Task 12 - Get book by Author
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const get_author = new Promise((resolve,reject)=>{
      let filtered = [];
      for(let i in books){
          if(books[i].author === author){
              filtered.push(books[i]);
          }
      }
      if(filtered.length>0){
          resolve(filtered);
      } else {
          reject({message:"Author not found"});
      }
    });
    get_author.then((result)=>res.send(JSON.stringify(result,null,4))).catch((err)=>res.send(err))
  });
  
  // Task 13 - Get book by Title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const get_title = new Promise((resolve,reject)=>{
      let filtered = [];
      for(let i in books){
          if(books[i].title === title){
              filtered.push(books[i]);
          }
      }
      if(filtered.length>0){
          resolve(filtered);
      } else {
          reject({message:"Title not found"});
      }
    });
    get_title.then((result)=>res.send(JSON.stringify(result,null,4))).catch((err)=>res.send(err))
  });

module.exports.general = public_users;
