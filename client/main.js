//Fullstack version (main.js)
//buttons
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');
const registerRedirectionButton = document.querySelector('#register-redirection-button');
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

/*
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the server (e.g., redirect to a profile page)
        })
 */
function loginBrowserVisibility() {
    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'block';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
}

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
            loginBrowserVisibility();

        }else{
            userRegistrationH2.textContent = "Registration failed, that username might already be in use.";
        }
    })
    .catch(error => console.error('Error:', error));
}

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
        .catch(error => console.error('Error:', error));

    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'block';

    profileHeader.style.display = 'block';
    loginHeader.style.display = 'none';
}

function logout() {
    // Make a GET request to the server to handle user logout
    fetch('http://localhost:3000/logout')
        .catch(error => console.error('Error:', error));

    homePage.style.display = 'block';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
    loginHeader.style.display = 'block';
}

window.addEventListener('load', ()=>{
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'none';

    profileHeader.style.display = 'none';
})
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
    loginBrowserVisibility();
    loginH2.textContent = "Login";
    loginH3.textContent = "";
})
profileHeader.addEventListener('click', ()=>{
    homePage.style.display = 'none';
    searchSection.style.display = 'none';
    loginSection.style.display = 'none';
    registrationSection.style.display = 'none';
    profileSection.style.display = 'block';

    profileHeader.style.display = 'block';
    loginHeader.style.display = 'none';
})
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