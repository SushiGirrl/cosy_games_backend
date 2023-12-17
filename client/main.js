//Fullstack version (main.js)
//buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const registerRedirectionButton = document.querySelector('#register-redirection-button');
const searchButton = document.querySelector('#search-button');
const filterSearchButton = document.querySelector('#filter-search-button');
const removeGameButton = document.querySelector('#remove-game-button');
//sections
const homePage = document.querySelector('#home-page');
const searchSection = document.querySelector('#search-section');
const loginSection = document.querySelector('#login-section');
const registrationSection = document.querySelector('#user-registration');
const profileSection = document.querySelector('#user-profile');
const gameDetailsSection = document.querySelector('#game-details-section');
//header options
const homePageHeader = document.querySelector('#home-page-header');
const cosyGamesHeader = document.querySelector('#cosy-games-search-header');
const loginHeader = document.querySelector('#login-header');
const profileHeader = document.querySelector('#profile-header');
//h2
const loginH2 = document.querySelector('#login-section h2');
const loginH3 = document.querySelector('#login-section h3');
const userRegistrationH2 = document.querySelector('#user-registration h2');
const titleElement = document.querySelector('#game-details-section h2');
//h3
const usernameH3 = document.querySelector('#user-info h3');
//list
const gameList = document.querySelector('#game-list');
const wantToPlayList = document.querySelector('#want-to-play-list');
const playedList = document.querySelector('#played-list');
const playingList = document.querySelector('#playing-list');
//div
const gameDetailsElement = document.querySelector('#game-details');
const gameListDiv = document.querySelector('#game-list-div');
//select
const platformOptions = document.querySelector('#platform');
const multiplayerOptions = document.querySelector('#multiplayer');
const sortOptions = document.querySelector('#sort-options');

//creates element globally
const messageElement = document.createElement("p");

/*
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the server (e.g., redirect to a profile page)
        })
 */
//page visibility functions
function beforeLoginBrowserVisibility() {
    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'block';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';
    gameDetailsSection.style.display = "none";

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
}
function afterLoginBrowserVisibility() {
    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'block';
    gameDetailsSection.style.display = "none";

    profileHeader.style.display = 'block';
    loginHeader.style.display = 'none';
}
function afterLogoutBrowserVisibility() {
    homePage.style.display = 'block';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
}

//registers new users
function register() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    //tests if we can log the values
    console.log(username)
    console.log(password)
    //creates user as object
    const userAsObject = {
        user_name: username,
        password: password
    }
    //tests if the user object is created
    console.log(userAsObject)
    //parses user object as string
    const userAsString =  JSON.stringify(userAsObject)
    //tests if the user object as a string works
    console.log(userAsString)

    //checks if the username and password are empty after trimming any extra whitespaces
    if(username.trim() === "" || password.trim() === "") {

        userRegistrationH2.textContent = "Failed to register, username and password can not be blank";
    }
    else {
        //fetches the POST method from the server
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: userAsString
        })
            .then(data => {
                if(data.status !== 500){
                    //redirects new user to login
                    loginH2.textContent = "Successfully registered new user!";
                    loginH3.textContent = "Now you just need to login";
                    beforeLoginBrowserVisibility();
                }else{

                    userRegistrationH2.textContent = "Registration failed, that username might already be in use";
                }
            })
            .catch(error => console.error('Error:', error));
    }
    //clears the input fields
    document.querySelector('#username').value = '';
    document.querySelector('#password').value = '';
}

//logs user in if username and password matches in the database
function login() {
    return new Promise((resolve, reject) => {
        const username = document.querySelector('#login-username').value;
        const password = document.querySelector('#login-password').value;
        //tests if we can log the values
        console.log(username)
        console.log(password)

        //creates user as object
        const userAsObject = {
            user_name: username,
            password: password
        }
        //tests if the user object is created
        console.log(userAsObject)
        //parses user object as string
        const userAsString =  JSON.stringify(userAsObject)
        //tests if the user object as a string works
        console.log(userAsString)

        //checks if the username and password are empty after trimming any extra whitespaces
        if(username.trim() === "" || password.trim() === "") {

            loginH2.textContent = "Login failed, username and password can not be blank";
            reject("Login failed");
        }
        else{
            //fetches Post from server
            fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: userAsString
            })
                .then(data => {
                    if(data.status !== 500 && data.status !== 401){

                        return data.json();
                    }else{
                        loginH2.textContent = "Login failed, try again";
                        loginH3.textContent = "The credentials provided did not match a user profile";
                        throw new Error("Login failed");
                    }
                })
                .then(data => {

                    console.log(data);
                    afterLoginBrowserVisibility();

                    //sets the user's login status to 'true' in sessionStorage
                    sessionStorage.setItem('isLoggedIn', 'true');
                    //sets the username in sessionStorage
                    sessionStorage.setItem('username', username);

                    resolve(); //resolves the Promise when login is successful
                })
                .catch(error => {
                    console.error('Error:', error);
                    reject(error); //rejects the Promise if there is an error
                });
        }
        //clears the input fields
        document.querySelector('#login-username').value = '';
        document.querySelector('#login-password').value = '';
    })
}

function logout() {

    afterLogoutBrowserVisibility();
    //sets the user's login status to 'false' in sessionStorage
    sessionStorage.setItem('isLoggedIn', 'false');
    //removes the username from sessionStorage
    sessionStorage.removeItem('username');
}

//checks if the user is logged in
function isLoggedIn() {
    //retrieves the user's login status from sessionStorage
    const loggedIn = sessionStorage.getItem('isLoggedIn');

    //checks if the value is set to 'true'
    return loggedIn === 'true';
}

//gets the logged-in username
function getLoggedInUsername() {
    //retrieves the username from sessionStorage
    return sessionStorage.getItem('username');
}

//displays all games as href in a list format sorted by A-Z
function displayAllGamesAlphabetical() {
    fetch('http://localhost:3000/games/all', {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayFilteredGames(data, gameList);
        })
        .catch(error => console.error('Error:', error));
}

//displays all games as href in a list format sorted by rating
function displayAllGamesByRating() {
    fetch('http://localhost:3000/games/ByRating', {
        method: 'GET',
        credentials: 'include', // Add this line
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayFilteredGames(data, gameList);
        })
        .catch(error => console.error('Error:', error));
}

//displays all games as href in a list format sorted by price
function displayAllGamesByPrice() {
    fetch('http://localhost:3000/games/ByPrice', {
        method: 'GET',
        credentials: 'include', // Add this line
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayFilteredGames(data, gameList);
        })
        .catch(error => console.error('Error:', error));
}

//displays all games as href in a list format sorted by length
function displayAllGamesByLength() {
    fetch('http://localhost:3000/games/ByLength', {
        method: 'GET',
        credentials: 'include', // Add this line
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            displayFilteredGames(data, gameList);
        })
        .catch(error => console.error('Error:', error));
}

//displays all games of a users list as href in a list format
function displayUserList(username, status) {
    fetch(`http://localhost:3000/users/lists/?username=${username}&status=${status}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if(status === "Want to Play"){
                displayFilteredGames(data, wantToPlayList);
            }
            else if(status === "Played"){
                displayFilteredGames(data, playedList);
            }
            else if(status === "Playing"){
                displayFilteredGames(data, playingList);
            }
            else{
                console.log("status parameter had no matches")
            }
        })
        .catch(error => console.error('Error:', error));
}

//deletes row with username and gameName
function disassociateGameWithUser(username, gameName) {
    fetch('http://localhost:3000/removeUserGameStatus', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, gameName }),
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to remove user game relationship: ' + response.statusText);
            }
            return response.json();
        })
        .then(function (responseData) {
            console.log(responseData);
            console.log('User game relationship removed successfully');
        })
        .catch(function (error) {
            console.error('Error removing user game relationship:', error.message);
        });
}

//adds row to users_games_status
function associateGameWithUser(username, gameName, status) {
    fetch('http://localhost:3000/addUserGameStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            username: username,
            gameName: gameName,
            status: status
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error adding user-game relationship:', error);
        });
}
//function to handle the page when a add-to-list-button is pressed
function afterAddToListButtonClicked(){
    messageElement.innerHTML = "";
    messageElement.textContent = "Game was added to your list";
}

//function to handle adding the game to the specified list
function addToPlayList(gameName, listName) {
    const username = getLoggedInUsername()

    if(listName === 'Want to Play List'){

        console.log(`Adding ${gameName} to ${listName}`);

        const status = "Want to Play"

        associateGameWithUser(username, gameName, status);
    }
    else if(listName === 'Played List'){

        console.log(`Adding ${gameName} to ${listName}`);

        const status = "Played"

        associateGameWithUser(username, gameName, status);
    }
    else if(listName === 'Playing List'){

        console.log(`Adding ${gameName} to ${listName}`);

        const status = "Playing"

        associateGameWithUser(username, gameName, status);
    }
    else{
       console.log('listName did not match existing lists')
    }
}

function createAddToListButtons(parentElement, gameName) {

    // creates buttons div element in HTML
    const addToListButtonsDiv = document.createElement('div');
    parentElement.appendChild(addToListButtonsDiv); // Append to the specified parent element

    // creates buttons
    const wantToPlayButton = document.createElement('button');
    wantToPlayButton.textContent = "Want to Play List";
    addToListButtonsDiv.appendChild(wantToPlayButton);

    const playingButton = document.createElement('button');
    playingButton.textContent = "Playing List";
    addToListButtonsDiv.appendChild(playingButton);

    const playedButton = document.createElement('button');
    playedButton.textContent = "Played List";
    addToListButtonsDiv.appendChild(playedButton);

    //adds event listeners to the buttons
    wantToPlayButton.addEventListener('click', () => {
        addToPlayList(gameName, 'Want to Play List');
        afterAddToListButtonClicked();
    });

    playingButton.addEventListener('click', () => {
        addToPlayList(gameName, 'Playing List');
        afterAddToListButtonClicked();
    });

    playedButton.addEventListener('click', () => {
        addToPlayList(gameName, 'Played List');
        afterAddToListButtonClicked();
    });
}

function checkIfGameIsAssociatedWithUser(username, gameName) {
    fetch(`http://localhost:3000/checkGame?username=${username}&gameName=${gameName}`, {
        method: 'GET',
        credentials: 'include',
    })

        .then(response => response.json())

        .then(data => {
            //creates a boolean variable gameExists that is true if
            //the count of games is greater than 0,
            //showing that the game exists in at least one list associated with the user
            const gameExists = data[0].game_exists > 0;

            console.log(`Game exists: `,gameExists);
            //if the game IS associated with the user
            if (gameExists) {

                messageElement.textContent = "The game is on your list, remove game?";
                titleElement.appendChild(messageElement);

                removeGameButton.style.display = "block"
            }
            //if the game is NOT associated with the user
            else {
                //creates buttons that adds the game to a list
                messageElement.textContent = "Add game to list";
                titleElement.appendChild(messageElement);

                createAddToListButtons(messageElement, gameName);
            }
        })
        .catch(error => console.error('Error checking game existence:', error));
}

//displays all details for a specific game
function displayGameDetails(gameName) {

    fetch(`http://localhost:3000/game/${encodeURIComponent(gameName)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .then(gameDetails => {
            console.log(gameDetails);

            //creates HTML elements to display game details
            titleElement.textContent = gameDetails[0].game_name;

            const rootElement = document.createElement("h2");
            gameDetailsElement.appendChild(rootElement);

            const ratingElement = document.createElement('p');
            ratingElement.textContent = `Metascore Rating: ${gameDetails[0].rating_metascore}`;
            rootElement.appendChild(ratingElement);

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: ${gameDetails[0].price_dk} kr`;
            rootElement.appendChild(priceElement);

            const lengthElement = document.createElement('p');
            lengthElement.textContent = `Game Length: ${gameDetails[0].length_hours} hours`;
            rootElement.appendChild(lengthElement);

            const developmentStatusElement = document.createElement('p');
            developmentStatusElement.textContent = `Development Status: ${gameDetails[0].dev_status}`;
            rootElement.appendChild(developmentStatusElement);

            const multiplayerElement = document.createElement('p');
            multiplayerElement.textContent = `Multiplayer: ${gameDetails[0].multiplayer}`;
            rootElement.appendChild(multiplayerElement);

            const crossPlatformElement = document.createElement('p');
            crossPlatformElement.textContent = `Cross-platform: ${gameDetails[0].cross_platform}`;
            rootElement.appendChild(crossPlatformElement);

            const artstyleElement = document.createElement('p');
            artstyleElement.textContent = `Artstyle: ${gameDetails[0].artstyle}`;
            rootElement.appendChild(artstyleElement);

            if (isLoggedIn()) {
                const username = getLoggedInUsername();
                console.log(`User ${username} is logged in.`);

                checkIfGameIsAssociatedWithUser(username, gameName);
            } else {

                console.log('User is not logged in.');
            }

        })
        .catch(error => console.error('Error fetching game details:', error));
}

//gets the game name from the href-link and calls other function with the specific
//game name as the argument.
function handleGameLinkClick(event) {
    event.preventDefault(); //prevents the default behavior of the anchor element

    if (event.target.nodeName === 'A') {
        const gameName = event.target.textContent; //gets the game name from the clicked link

        gameDetailsElement.innerHTML = ''; //clears gameDetails from earlier requests

        displayGameDetails(gameName); //fetches and displays details for the selected game

        //authorization check
        if(isLoggedIn()){
            const username = getLoggedInUsername();
            console.log(`User ${username} is logged in.`);

            profileHeader.style.display = 'block';
            loginHeader.style.display = 'none';
        }
        else{
            console.log('User is not logged in.');

            profileHeader.style.display = 'none';
            loginHeader.style.display = 'block';
        }
        homePage.style.display = 'none';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';
        gameDetailsSection.style.display = "block";
    }
}

//only displays games that have been filtered in some way
//is called both when user clicks the search button and filter search button
function displayFilteredGames(filteredGames, parentElement) {
    //clears existing content
    parentElement.innerHTML = '';

    //iterates over the filtered games and appends them to the list
    filteredGames.forEach(game => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.textContent = game.game_name;
        link.href = '#';

        listItem.appendChild(link);
        parentElement.appendChild(listItem);
    });
}
//takes the value of the search input, fetches data that contains the search input
//and calls displayFilteredGames with the fetched data as the argument
function searchGames() {
    const searchInput = document.querySelector('#search-input').value;
    if (searchInput.trim() !== '') {
        //fetch games based on the search input
        fetch(`http://localhost:3000/games/search?query=${encodeURIComponent(searchInput)}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                //display the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error:', error));
    }else{
        //if search button is clicked when there is no input
        displayAllGamesAlphabetical();
    }
    document.querySelector('#search-input').value = "";
}

//function to fetch games based on the selected console/platform
function fetchGamesByConsoleAlphabetical(selectedConsole) {
    return fetch(`http://localhost:3000/games/byConsole/${encodeURIComponent(selectedConsole)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//function to fetch games based on the selected console/platform sorted by rating
function fetchGamesByConsoleByRating(selectedConsole) {
    return fetch(`http://localhost:3000/games/byConsole/byRating/${encodeURIComponent(selectedConsole)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//function to fetch games based on the selected console/platform sorted by price
function fetchGamesByConsoleByPrice(selectedConsole) {
    return fetch(`http://localhost:3000/games/byConsole/byPrice/${encodeURIComponent(selectedConsole)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//function to fetch games based on the selected console/platform sorted by length
function fetchGamesByConsoleByLength(selectedConsole) {
    return fetch(`http://localhost:3000/games/byConsole/byLength/${encodeURIComponent(selectedConsole)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by multiplayer sorted by A-Z
function fetchGamesByMultiplayerAlphabetical(selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byMultiplayer/byAlphabetical/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by multiplayer sorted by rating
function fetchGamesByMultiplayerByRating(selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byMultiplayer/byRating/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by multiplayer sorted by price
function fetchGamesByMultiplayerByPrice(selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byMultiplayer/byPrice/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by multiplayer sorted by length
function fetchGamesByMultiplayerByLength(selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byMultiplayer/byLength/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by console and multiplayer sorted by A-Z
function fetchGamesByConsoleByMultiplayerByAlphabetical(selectedConsole, selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byConsole/byMultiplayer/byAlphabetical/${encodeURIComponent(selectedConsole)}/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by console and multiplayer sorted by rating
function fetchGamesByConsoleByMultiplayerByRating(selectedConsole, selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byConsole/byMultiplayer/byRating/${encodeURIComponent(selectedConsole)}/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by console and multiplayer sorted by price
function fetchGamesByConsoleByMultiplayerByPrice(selectedConsole, selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byConsole/byMultiplayer/byPrice/${encodeURIComponent(selectedConsole)}/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//fetched game data by console and multiplayer sorted by length
function fetchGamesByConsoleByMultiplayerByLength(selectedConsole, selectedMultiplayer) {
    return fetch(`http://localhost:3000/games/byConsole/byMultiplayer/byLength/${encodeURIComponent(selectedConsole)}/${encodeURIComponent(selectedMultiplayer)}`, {
        method: 'GET',
        credentials: 'include',
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            throw error; //re-throw the error to be caught in the calling code
        });
}

//takes the value of the selected console, uses it as the argument in fetchGamesByConsole
//and then uses the fetched data as the argument in displayFilteredGames
function handleFilterButtonClick() {
    const selectedConsole = platformOptions.value;
    const selectedMultiplayer = multiplayerOptions.value;
    const selectedSort = sortOptions.value;

    //only sorting
    if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Rating") {

        displayAllGamesByRating();
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Price") {

        displayAllGamesByPrice();
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Length") {

        displayAllGamesByLength();
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "A-Z") {

        displayAllGamesAlphabetical()
    }
    //sorting and platform
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Rating") {

        fetchGamesByConsoleByRating(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data, gameList);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Price") {

        fetchGamesByConsoleByPrice(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data, gameList);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Length") {

        fetchGamesByConsoleByLength(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data, gameList);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "A-Z") {

        //fetches games based on the selected console
        fetchGamesByConsoleAlphabetical(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data, gameList);
        })
        .catch(error => console.error('Error fetching games:', error));
    }
    //sorting and multiplayer
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Rating") {

        fetchGamesByMultiplayerByRating(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Price") {

        fetchGamesByMultiplayerByPrice(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Length") {

        fetchGamesByMultiplayerByLength(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "A-Z") {

        fetchGamesByMultiplayerAlphabetical(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    //sorting, platform and multiplayer
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Rating") {

        fetchGamesByConsoleByMultiplayerByRating(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Price") {

        fetchGamesByConsoleByMultiplayerByPrice(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Length") {

        fetchGamesByConsoleByMultiplayerByLength(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "A-Z") {

        fetchGamesByConsoleByMultiplayerByAlphabetical(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data, gameList);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
}

//EventListeners
window.addEventListener('load', ()=>{
    afterLogoutBrowserVisibility();
    removeGameButton.style.display = 'none';
})
//href elements
homePageHeader.addEventListener('click', ()=>{
    //authorization check
    if (isLoggedIn()) {

        const username = getLoggedInUsername();
        console.log(`User ${username} is logged in.`);

        homePage.style.display = 'block';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';
        gameDetailsSection.style.display = "none";

        profileHeader.style.display = 'block';
        loginHeader.style.display = 'none';
    } else {

        console.log('User is not logged in.');

        homePage.style.display = 'block';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';
        gameDetailsSection.style.display = "none";

        profileHeader.style.display = 'none';
        loginHeader.style.display = 'block';
    }
})
cosyGamesHeader.addEventListener('click', ()=>{
    //authorization check
    if(isLoggedIn()){
        const username = getLoggedInUsername();
        console.log(`User ${username} is logged in.`);

        loginHeader.style.display = 'none';
        profileHeader.style.display = 'block';
    }
    else{

        console.log('User is not logged in.');

        loginHeader.style.display = 'block';
        profileHeader.style.display = 'none';
    }

    homePage.style.display = 'none';
    searchSection.style.display = 'block';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';
    gameDetailsSection.style.display = 'none';

    displayAllGamesAlphabetical();
    //clears the game details div from the page
    gameDetailsElement.innerHTML = '';
    removeGameButton.style.display = 'none';
})
loginHeader.addEventListener('click', ()=>{
    beforeLoginBrowserVisibility();
    loginH2.textContent = "Login";
    loginH3.textContent = "";
})
profileHeader.addEventListener('click', ()=>{

    afterLoginBrowserVisibility();

    const username = getLoggedInUsername();
    usernameH3.textContent = `Username: ` + username;

    displayUserList(username, "Want to Play");
    displayUserList(username, "Played");
    displayUserList(username, "Playing");
})

//lists
//add event listeners to each anchor element
gameList.addEventListener('click', handleGameLinkClick);

wantToPlayList.addEventListener('click', handleGameLinkClick)

playedList.addEventListener('click', handleGameLinkClick);

playingList.addEventListener('click', handleGameLinkClick);

//buttons
registerRedirectionButton.addEventListener('click', ()=>{

    userRegistrationH2.textContent = "";

    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'block';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
})
registerButton.addEventListener('click', ()=>{
    register();
})

loginButton.addEventListener('click', ()=> {

    login()
        .then(() => {

            const username = getLoggedInUsername();
            usernameH3.textContent = `Username: ` + username;

            displayUserList(username, "Want to Play");
            displayUserList(username, "Played");
            displayUserList(username, "Playing");

            console.log('Code after successful login');
        })
        .catch(error => {

            console.error('Login failed:', error);
        });
});

logoutButton.addEventListener('click', ()=>{
    logout();
})

removeGameButton.addEventListener('click', ()=>{

    messageElement.textContent = "";

    const username = getLoggedInUsername();
    usernameH3.textContent = `Username: ` + username;

    const gameName = titleElement.textContent;
    console.log(gameName);

    //function to remove game
    disassociateGameWithUser(username, gameName);

    //redirection to cosy games page
    loginHeader.style.display = 'none';
    profileHeader.style.display = 'block';

    homePage.style.display = 'none';
    searchSection.style.display = 'block';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';
    gameDetailsSection.style.display = 'none';

    displayAllGamesAlphabetical();
    //clears the game details div from the page
    gameDetailsElement.innerHTML = '';
    removeGameButton.style.display = 'none';
})

searchButton.addEventListener('click', () => {
    searchGames();
    gameListDiv.scrollIntoView({ behavior: 'smooth' });
});

filterSearchButton.addEventListener('click', handleFilterButtonClick);