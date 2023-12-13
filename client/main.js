//Fullstack version (main.js)
//buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const registerRedirectionButton = document.querySelector('#register-redirection-button');
const searchButton = document.querySelector('#search-button');
const filterSearchButton = document.querySelector('#filter-search-button');
//sections
const homePage = document.querySelector('#home-page');
const searchSection = document.querySelector('#search-section');
const loginSection = document.querySelector('#login-section');
const registrationSection = document.querySelector('#user-registration');
const profileSection = document.querySelector('#user-profile');
//header options
const homePageHeader = document.querySelector('#home-page-header');
const cosyGamesHeader = document.querySelector('#cosy-games-search-header');
const loginHeader = document.querySelector('#login-header');
const profileHeader = document.querySelector('#profile-header');
//h2
const loginH2 = document.querySelector('#login-section h2');
const loginH3 = document.querySelector('#login-section h3');
const userRegistrationH2 = document.querySelector('#user-registration h2');
//list
const gameList = document.querySelector('#game-list');
//div
const gameDetailsElement = document.querySelector('#game-details');
//select
const platformOptions = document.querySelector('#platform');
const multiplayerOptions = document.querySelector('#multiplayer');
const sortOptions = document.querySelector('#sort-options');

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

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
}
function afterLoginBrowserVisibility() {
    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'block';

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
            })
            .catch(error => console.error('Error:', error));
    }
    //clears the input fields
    document.querySelector('#login-username').value = '';
    document.querySelector('#login-password').value = '';
}

//the function is supposed remove/destroy a token or a cookie so that
//the user no longer is authorized, but right now it just changes visibility
function logout() {

    afterLogoutBrowserVisibility();
    //sets the user's login status to 'false' in sessionStorage
    sessionStorage.setItem('isLoggedIn', 'false');
}

//checks if the user is logged in
function isLoggedIn() {
    //retrieves the user's login status from sessionStorage
    const loggedIn = sessionStorage.getItem('isLoggedIn');

    //checks if the value is set to 'true'
    return loggedIn === 'true';
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
            //clears existing content
            gameList.innerHTML = '';
            // Iterate over the games and append them to the list
            data.forEach(game => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.textContent = game.game_name;
                //placeholder
                link.href = '#';

                listItem.appendChild(link);
                gameList.appendChild(listItem);
            })
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
            //clears existing content
            gameList.innerHTML = '';
            // Iterate over the games and append them to the list
            data.forEach(game => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.textContent = game.game_name;
                //placeholder
                link.href = '#';

                listItem.appendChild(link);
                gameList.appendChild(listItem);
            })
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
            //clears existing content
            gameList.innerHTML = '';
            // Iterate over the games and append them to the list
            data.forEach(game => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.textContent = game.game_name;
                //placeholder
                link.href = '#';

                listItem.appendChild(link);
                gameList.appendChild(listItem);
            })
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
            //clears existing content
            gameList.innerHTML = '';
            // Iterate over the games and append them to the list
            data.forEach(game => {
                const listItem = document.createElement('li');
                const link = document.createElement('a');

                link.textContent = game.game_name;
                //placeholder
                link.href = '#';

                listItem.appendChild(link);
                gameList.appendChild(listItem);
            })
        })
        .catch(error => console.error('Error:', error));
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
            // Adjust this part based on how you want to display the game details
            gameDetailsElement.innerHTML = JSON.stringify(gameDetails);
            // Add more details as needed
        })
        .catch(error => console.error('Error fetching game details:', error));
}

//gets the game name from the href-link and calls other function with the specific
//game name as the argument.
function handleGameLinkClick(event) {
    event.preventDefault(); //prevents the default behavior of the anchor element

    if (event.target.nodeName === 'A') {
        const gameName = event.target.textContent; //gets the game name from the clicked link
        displayGameDetails(gameName); //fetches and displays details for the selected game

        //visibility
        homePage.style.display = 'none';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';

        profileHeader.style.display = 'block';
        loginHeader.style.display = 'none';
    }
}

//only displays games that have been filtered in some way
//is called both when user clicks the search button and filter search button
function displayFilteredGames(filteredGames) {
    //clears existing content
    gameList.innerHTML = '';

    //iterates over the filtered games and appends them to the list
    filteredGames.forEach(game => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.textContent = game.game_name;
        link.href = '#';

        listItem.appendChild(link);
        gameList.appendChild(listItem);
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
                displayFilteredGames(data);
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
            displayFilteredGames(data);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Price") {

        fetchGamesByConsoleByPrice(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Length") {

        fetchGamesByConsoleByLength(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data);
        })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "A-Z") {

        //fetches games based on the selected console
        fetchGamesByConsoleAlphabetical(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data);
        })
        .catch(error => console.error('Error fetching games:', error));
    }
    //sorting and multiplayer
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Rating") {

        fetchGamesByMultiplayerByRating(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Price") {

        fetchGamesByMultiplayerByPrice(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Length") {

        fetchGamesByMultiplayerByLength(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole === "All" && selectedMultiplayer !== "Either"
        && selectedSort === "A-Z") {

        fetchGamesByMultiplayerAlphabetical(selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    //sorting, platform and multiplayer
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Rating") {

        fetchGamesByConsoleByMultiplayerByRating(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Price") {

        fetchGamesByConsoleByMultiplayerByPrice(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "Length") {

        fetchGamesByConsoleByMultiplayerByLength(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
    else if(selectedConsole !== "All" && selectedMultiplayer !== "Either"
        && selectedSort === "A-Z") {

        fetchGamesByConsoleByMultiplayerByAlphabetical(selectedConsole, selectedMultiplayer)
            .then(data => {
                //displays the filtered games
                displayFilteredGames(data);
            })
            .catch(error => console.error('Error fetching games:', error));
    }
}

//EventListeners
window.addEventListener('load', ()=>{
    afterLogoutBrowserVisibility();
})
//href elements
homePageHeader.addEventListener('click', ()=>{
    //authorization check
    if (isLoggedIn()) {

        console.log('User is logged in.');

        homePage.style.display = 'block';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';

        profileHeader.style.display = 'block';
        loginHeader.style.display = 'none';
    } else {

        console.log('User is not logged in.');

        homePage.style.display = 'block';
        searchSection.style.display = 'none';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';

        profileHeader.style.display = 'none';
        loginHeader.style.display = 'block';
    }
})
cosyGamesHeader.addEventListener('click', ()=>{
    //authorization check
    if(isLoggedIn()){

        homePage.style.display = 'none';
        searchSection.style.display = 'block';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';

        profileHeader.style.display = 'block';
        loginHeader.style.display = 'none';
    }
    else{

        homePage.style.display = 'none';
        searchSection.style.display = 'block';
        loginSection.style.display = 'none';
        registrationSection.style.display = 'none';
        profileSection.style.display = 'none';

        profileHeader.style.display = 'none';
        loginHeader.style.display = 'block';
    }

    displayAllGamesAlphabetical();
    //clears the game details div from the page
    gameDetailsElement.innerHTML = '';
})
loginHeader.addEventListener('click', ()=>{
    beforeLoginBrowserVisibility();
    loginH2.textContent = "Login";
    loginH3.textContent = "";
})
profileHeader.addEventListener('click', ()=>{
    afterLoginBrowserVisibility();
})

//add event listeners to each anchor element
gameList.addEventListener('click', handleGameLinkClick);

//buttons
registerRedirectionButton.addEventListener('click', ()=>{

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

loginButton.addEventListener('click', ()=>{
    login();
})

logoutButton.addEventListener('click', ()=>{
    logout();
})

searchButton.addEventListener('click', searchGames);

filterSearchButton.addEventListener('click', handleFilterButtonClick);