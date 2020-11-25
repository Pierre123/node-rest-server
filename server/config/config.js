//======================
//Puerto

const e = require("express");

//======================
process.env.PORT = process.env.PORT || 3000;

//======================
//Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================
//Base de Datos
//======================
let urlDB;

//if (process.env.NODE_ENV === 'dev') {
//   urlDB = 'mongodb://localhost:27017/cafe';
//} else {
urlDB = 'mongodb+srv://pierre:m9QrrLjcwtWiwkzb@cluster0.m2imy.mongodb.net/cafe';
//}

process.env.URLDB = urlDB;