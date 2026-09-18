const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

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

// Task 10 - Async Promise
public_users.get('/async/books',function (req, res) {
  let myPromise = new Promise((resolve,reject)=>{
    resolve(books);
  })
  myPromise.then((result)=>{
    res.send(JSON.stringify(result,null,4));
  })
});

// Task 11 - Async ISBN with Promise
public_users.get('/async/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject)=>{
    if(books[isbn]){
      resolve(books[isbn]);
    }else{
      reject({message:"ISBN not found"});
    }
  })
  myPromise.then((result)=>{res.send(result)}).catch((err)=>{res.send(err)})
});

// Task 12 - Async Author
public_users.get('/async/author/:author',function (req, res) {
  const author = req.params.author;
  let myPromise = new Promise((resolve,reject)=>{
    let ans = []
    for(const [isbn, book] of Object.entries(books)){
      if(book.author === author){
        ans.push(book);
      }
    }
    resolve(ans);
  })
  myPromise.then((result)=>{res.send(JSON.stringify(result,null,4))})
});

// Task 13 - Async Title
public_users.get('/async/title/:title',function (req, res) {
  const title = req.params.title;
  let myPromise = new Promise((resolve,reject)=>{
    let ans = []
    for(const [isbn, book] of Object.entries(books)){
      if(book.title === title){
        ans.push(book);
      }
    }
    resolve(ans);
  })
  myPromise.then((result)=>{res.send(JSON.stringify(result,null,4))})
});

module.exports.general = public_users;
