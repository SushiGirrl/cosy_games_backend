//npm install express --save
const express = require("express");
//npm install mysql2 --save
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(express.json());

//Host, user, password database
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Khfx5cvf1cb#",
    database:"cosy_games"
});

//we need this part to make it work at all
app.listen(port,()=>{
    console.log("porten kører");
})