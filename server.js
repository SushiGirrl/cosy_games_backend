//Fullstack version (server.js)

//npm install express --save
const express = require("express");
//npm install mysql2 --save
const db = require("mysql2");
//npm install cors --save
const cors = require("cors");
//npm install express-session
const session = require("express-session");

const app = express();
//had change port from "4000" (IDK why)
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: "my-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

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
    connection.query(
        "SELECT * FROM games WHERE game_name = ?",
        [gameUserRequest],
        (error, results)=>{
            res.send(results);
        });
});

//Authentication implementation

//POST that handles registration of new users
app.post("/register", (req, res) => {
    const { user_name, password } = req.body;
    console.log(user_name);
    console.log(password);
    connection.query(
        "INSERT INTO users (user_name, password) VALUES (?, ?)",
        [user_name, password],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send("Registration failed, that username might already be in use.");
            } else {
                res.json({ message: "Registration successful" });
            }
        }
    );
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    connection.query(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send("Login failed");
            } else {
                if (results.length > 0) {
                    // Store user information in the session
                    req.session.user = results[0];
                    res.send("Login successful");
                } else {
                    res.status(401).send("Invalid credentials");
                }
            }
        }
    );
});

app.get("/profile", (req, res) => {
    // Check if the user is authenticated
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}!`);
    } else {
        res.status(401).send("Unauthorized");
    }
});

app.get("/logout", (req, res) => {
    // Destroy the session on logout
    req.session.destroy();
    res.send("Logout successful");
});

//catches all endpoints that don´t exist yet and returns error 404
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

//we need this part to make it work at all
app.listen(port,()=>{
    console.log("porten kører");
})