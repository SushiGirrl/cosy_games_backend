//npm install express --save
const express = require("express");
//npm install mysql2 --save
const db = require("mysql2");
//npm install cors --save
const cors = require("cors");

const app = express();
//had change port from "4000" (IDK why)
const port = 3000;

app.use(cors());
app.use(express.json());

//can´t connect to server.
//Host, user, password database
const connection = db.createConnection({
    //had to change "localhost" to mysql hostname under "mannage connections"
    host: "127.0.0.1",
    user: "root",
    password: "Khfx5cvf1cb#",
    database: "cosy_games"
});
app.get(`/hello`,(req,res) =>{
    res.send('Hello');
});

//endpoint that displays all data of all games
app.get(`/games/all`,(req,res) =>{
    connection.query('SELECT * FROM games',(error, results) =>{
        res.send(results);
    });
});

app.get(`/consoles/all`,(req,res) =>{
    connection.query('SELECT * FROM consoles',(error, results) =>{
        res.send(results);
    });
});

app.get(`/users/all`,(req,res) =>{
    connection.query('SELECT * FROM users',(error, results) =>{
        res.send(results);
    });
});

app.get(`/games_consoles/all`,(req,res) =>{
    connection.query('SELECT * FROM games_consoles',(error, results) =>{
        res.send(results);
    });
});

app.get(`/users_games_status/all`,(req,res) =>{
    connection.query('SELECT * FROM users_games_status',(error, results) =>{
        res.send(results);
    });
});

app.get('/game/:name/', (req,res)=>{
    const gameUserRequest = req.params.name;
    connection.query('SELECT * FROM games WHERE game_name = ?',
        [gameUserRequest],
        (error, results)=>{
            res.send(results);
        });
});

//posts

app.post('/new_user',(req,res)=>{
    const user_name = req.body.user_name;

    console.log(user_name);
    res.send("Successful POST request");
});

//catches all endpoints that don´t exist yet and returns error 404
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

//we need this part to make it work at all
app.listen(port,()=>{
    console.log("porten kører");
})