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

//endpoint that sends all data of all games in alphabetical order
app.get(`/games/all`,(req,res) =>{
    connection.query('SELECT * FROM games ORDER BY game_name ASC',(error, results) =>{
        res.send(results);
    });
});
app.get('/games/byRating', (req, res) => {
    connection.query('SELECT * FROM games ORDER BY rating_metascore DESC', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching games by rating');
        } else {
            res.send(results);
        }
    });
});
app.get('/games/byPrice', (req, res) => {
    connection.query('SELECT * FROM games ORDER BY price_dk ASC', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching games by price');
        } else {
            res.send(results);
        }
    });
});
app.get('/games/byLength', (req, res) => {
    connection.query('SELECT * FROM games ORDER BY length_hours DESC', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching games by length');
        } else {
            res.send(results);
        }
    });
});


//sends all data about a specific game with name taken from parameter
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
                console.log(results);
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

                    res.json({ message: "Login successful" });
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

//
app.get('/games/search', (req, res) => {
    //extracts the value of the query parameter from the query string of the URL
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

//gets game details on games associated with chosen console ordered by A-Z
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

//gets game details on games associated with chosen console ordered by rating
app.get('/games/byConsole/byRating/:console', (req, res) => {
    const selectedConsole = req.params.console;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ?' +
        'ORDER BY rating_metascore DESC',
        [selectedConsole],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and rating');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console ordered by price
app.get('/games/byConsole/byPrice/:console', (req, res) => {
    const selectedConsole = req.params.console;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ?' +
        'ORDER BY price_dk ASC',
        [selectedConsole],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and price');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console ordered by length
app.get('/games/byConsole/byLength/:console', (req, res) => {
    const selectedConsole = req.params.console;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ?' +
        'ORDER BY length_hours DESC',
        [selectedConsole],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and length');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen multiplayer ordered by A-Z
app.get('/games/byMultiplayer/byAlphabetical/:multiplayer', (req, res) => {
    const selectedMultiplayer = req.params.multiplayer;

    connection.query(
        'SELECT * FROM games ' +
        'WHERE multiplayer = ?' +
        'ORDER BY game_name ASC',
        [selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by multiplayer sorted by A-Z');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen multiplayer ordered by Rating
app.get('/games/byMultiplayer/byRating/:multiplayer', (req, res) => {
    const selectedMultiplayer = req.params.multiplayer;

    connection.query(
        'SELECT * FROM games ' +
        'WHERE multiplayer = ?' +
        'ORDER BY rating_metascore DESC',
        [selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by multiplayer sorted by Rating');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen multiplayer ordered by price
app.get('/games/byMultiplayer/byPrice/:multiplayer', (req, res) => {
    const selectedMultiplayer = req.params.multiplayer;

    connection.query(
        'SELECT * FROM games ' +
        'WHERE multiplayer = ?' +
        'ORDER BY price_dk ASC',
        [selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by multiplayer sorted by price');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen multiplayer ordered by length
app.get('/games/byMultiplayer/byLength/:multiplayer', (req, res) => {
    const selectedMultiplayer = req.params.multiplayer;

    connection.query(
        'SELECT * FROM games ' +
        'WHERE multiplayer = ?' +
        'ORDER BY length_hours DESC',
        [selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by multiplayer sorted by length');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console and chosen multiplayer ordered by A-Z
app.get('/games/byConsole/byMultiplayer/byAlphabetical/:console/:multiplayer', (req, res) => {
    const selectedConsole = req.params.console;
    const selectedMultiplayer =req.params.multiplayer;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ? AND games.multiplayer = ? ' +
        'ORDER BY games.game_name ASC',
        [selectedConsole, selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and multiplayer sorted by A-Z');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console and chosen multiplayer ordered by rating
app.get('/games/byConsole/byMultiplayer/byRating/:console/:multiplayer', (req, res) => {
    const selectedConsole = req.params.console;
    const selectedMultiplayer =req.params.multiplayer;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ? AND games.multiplayer = ? ' +
        'ORDER BY games.rating_metascore DESC',
        [selectedConsole, selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and multiplayer sorted by rating');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console and chosen multiplayer ordered by price
app.get('/games/byConsole/byMultiplayer/byPrice/:console/:multiplayer', (req, res) => {
    const selectedConsole = req.params.console;
    const selectedMultiplayer =req.params.multiplayer;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ? AND games.multiplayer = ? ' +
        'ORDER BY games.price_dk ASC',
        [selectedConsole, selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and multiplayer sorted by price');
            } else {
                res.send(results);
            }
        }
    );
});

//gets game details on games associated with chosen console and chosen multiplayer ordered by length
app.get('/games/byConsole/byMultiplayer/byLength/:console/:multiplayer', (req, res) => {
    const selectedConsole = req.params.console;
    const selectedMultiplayer =req.params.multiplayer;

    connection.query(
        'SELECT games.* FROM games_consoles ' +
        'INNER JOIN games ON games_consoles.game_id = games.game_id ' +
        'INNER JOIN consoles ON games_consoles.console_id = consoles.console_id ' +
        'WHERE consoles.console = ? AND games.multiplayer = ? ' +
        'ORDER BY games.length_hours DESC',
        [selectedConsole, selectedMultiplayer],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error fetching games by console and multiplayer sorted by length');
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