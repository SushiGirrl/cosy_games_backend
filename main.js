//npm install express --save
const express = require("express");
//npm install mysql2 --save
const db = require("mysql2");
//npm install cors --save
const cors = require("cors");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

//can´t connect to server.
//Host, user, password database
const connection = db.createConnection({
    host: "localhost",
    user: "root",
    password: "Khfx5cvf1cb#",
    database: "pokemon"
});
app.get(`/hello`,(req,res) =>{
    res.send('Hello');
});

//catches all endpoints that don´t exist yet and returns error 404
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

//we need this part to make it work at all
app.listen(port,()=>{
    console.log("porten kører");
})