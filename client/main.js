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

//function that checks whether a user is logged in or not
//I did not finish debugging the JWT token based authorization
const checkLoggedInStatus = (url, method = 'GET') => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        },
        // Remove the body property for GET requests
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("User is not logged in");
            }
            return response.json();
        })
        .then(data => {
            console.log("User is logged in:", data.user);
        })
        .catch(error => {
            console.error("Error checking login status:", error);
        });
};

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
        /*
    .then(data => {
        localStorage.setItem('token', data.token);

        // Check logged-in status after successful login
        return checkLoggedInStatus('http://localhost:3000/api/checkLoggedIn');

    })
        */
    .then(data => {
        // Handle the response from the server (e.g., redirect to a profile page)
        console.log(data);
        afterLoginBrowserVisibility();
    })
    .catch(error => console.error('Error:', error));
}

//the function is supposed remove/destroy a token or a cookie so that
//the user no longer is authorized, but right now it just changes visibility
function logout() {
    /*
    // Remove the token from localStorage
    localStorage.removeItem('token');
     */

    fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include',
    })
        .catch(error => console.error('Error:', error));

    afterLogoutBrowserVisibility();
}

//displays all games as href in a list format
function displayAllGames() {
    fetch('http://localhost:3000/games/all', {
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
        //if search buttton is clicked when there is no input
        displayAllGames();
    }
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

//takes the value of the selected console, uses it as the argument in fetchGamesByConsole
//and then uses the fetched data as the argument in displayFilteredGames
function handleFilterButtonClick() {
    const selectedConsole = platformOptions.value;
    const selectedMultiplayer = multiplayerOptions.value;
    const selectedSort = sortOptions.value;

    //pseudocode
    /*
    //only sorting
    if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Rating") {

        //logic
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Price") {

        //logic
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "Length") {

        //logic
    }
    else if(selectedConsole === "All" && selectedMultiplayer === "Either"
        && selectedSort === "A-Z") {

        //logic
    }
    //sorting and platform
    else if(selectedConsole !== "All" && selectedMultiplayer === "Either"
        && selectedSort === "Rating") {

        //logic
    }

     */

    //fetches games based on the selected console
    fetchGamesByConsoleAlphabetical(selectedConsole)
        .then(data => {
            //displays the filtered games
            displayFilteredGames(data);
        })
        .catch(error => console.error('Error fetching games:', error));
}

//EventListeners
window.addEventListener('load', ()=>{
    afterLogoutBrowserVisibility();
})
//href elements
homePageHeader.addEventListener('click', ()=>{
    //implement authorization check
    //if user is not logged in:
    homePage.style.display = 'block';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';

    //else if user is logged in;
    /*
    homePage.style.display = 'block';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'block';
    loginHeader.style.display = 'none';
     */
})
cosyGamesHeader.addEventListener('click', ()=>{
    //implement authorization check
    //if user is not logged in:
    homePage.style.display = 'none';
    searchSection.style.display = 'block';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';

    displayAllGames();
    gameDetailsElement.innerHTML = '';

    //else if user is logged in;
    /*
    homePage.style.display = 'none';
    searchSection.style.display = 'block';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'block';
    loginHeader.style.display = 'none';
     */
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