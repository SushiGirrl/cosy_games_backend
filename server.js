//Fullstack version (server.js)

//npm install express --save
const express = require("express");
//npm install mysql2 --save
const db = require("mysql2");
//npm install cors --save
const cors = require("cors");
//npm install bcrypt
const bcrypt = require("bcrypt");
//npm install jsonwebtoken
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:63342',
    credentials: true
}));

app.use(express.json());

//establishes connection to my database
const connection = db.createConnection({
    //MySQL hostname (can be found under "manage connections")
    host: "127.0.0.1",
    user: "root",
    password: "Khfx5cvf1cb#",
    database: "cosy_games"
});

//endpoint that sends all data of all games
app.get(`/games/all`,(req,res) =>{
    connection.query('SELECT * FROM games ORDER BY game_name ASC',(error, results) =>{
        res.send(results);
    });
});
//endpoint that sends all data of all consoles
app.get(`/consoles/all`,(req,res) =>{
    connection.query('SELECT * FROM consoles',(error, results) =>{
        res.send(results);
    });
});
//endpoint that sends all data of all users
app.get(`/users/all`,(req,res) =>{
    connection.query('SELECT * FROM users',(error, results) =>{
        res.send(results);
    });
});
//endpoint that sends all data of all games_consoles
app.get(`/games_consoles/all`,(req,res) =>{
    connection.query('SELECT * FROM games_consoles',(error, results) =>{
        res.send(results);
    });
});
//endpoint that sends all data of all users_games_status
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

//--------------Authentication implementation----------------//

//authentication middleware to check the token
const checkToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    console.log("From checkToken: ",token);
    jwt.verify(token, "your-secret-key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        console.log(decoded);

        req.user = decoded; //attach the decoded user information to the request
        next();
    });
};

//POST that handles registration of new users
app.post("/register", (req, res) => {
    const { user_name, password } = req.body;
    console.log(user_name);
    console.log(password);

    //hashes the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);

    connection.query(
        "INSERT INTO users (user_name, password) VALUES (?, ?)",
        [user_name, hashedPassword],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send("Registration failed, that username might already be in use");
            } else {
                res.json({ message: "Registration successful" });
            }
        }
    );
});

//POST that handles login
app.post("/login", (req, res) => {
    const { user_name, password } = req.body;
    console.log(user_name);
    console.log(password);

    connection.query(
        "SELECT * FROM users WHERE user_name = ?",
        [user_name],
        (error, results) => {
            //if there is not a matching username and password in the database
            //then it is an error 500 and login fails
            if (error) {
                console.error(error);
                res.status(500).send("Login failed");
            } else {
                if (results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
                    //user is authenticated, generate a JWT token
                    const token = jwt.sign({ userId: results[0].id, username: results[0].user_name },
                        "your-secret-key", { expiresIn: "1h" });
                    console.log("From /login: ",token);

                    res.json({ token });
                    console.log(JSON.parse(token));
                } else {
                    //tests if there are any results
                    //there won´t be any results if input is empty
                    console.log(results);
                    res.status(401).send("Invalid credentials");
                }
            }
        }
    );
});

app.get("/logout", (req, res) => {
    //you can clear any client-side storage or handle additional cleanup here
    res.send("Logout successful");
});

//protected endpoint
app.get("/api/checkLoggedIn", checkToken, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

//protected profile endpoint
app.get("/profile", checkToken, (req, res) => {
    //the user is authenticated, and user information is available in req.user
    res.send(`Welcome, ${req.user.username}!`);
});

app.get('/games/search', (req, res) => {
    const searchQuery = req.query.query;

    connection.query(
        'SELECT * FROM games WHERE game_name LIKE ?',
        [`%${searchQuery}%`],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console
app.get('/games/byConsole/:console', (req, res) => {
    const selectedConsole = req.params.console;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ?' +
        'ORDER BY games.game_name ASC',
        [selectedConsole],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console');
            } else {
                res.send(results);
            }
        }
    );
});


//catches all endpoints that don´t exist yet and returns error 404
app.get('*',(req,res) =>{
    res.sendStatus(404);
});

//we need this part to make it work at all
app.listen(port,()=>{
    console.log("porten kører");
})