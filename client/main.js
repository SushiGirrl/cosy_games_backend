//Fullstack version (main.js)
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');

/*
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the server (e.g., redirect to a profile page)
        })
 */


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
}

function logout() {
    // Make a GET request to the server to handle user logout
    fetch('/logout')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the server (e.g., redirect to a login page)
        })
        .catch(error => console.error('Error:', error));
}

registerButton.addEventListener('click', ()=>{
    register();
})

loginButton.addEventListener('click', ()=>{
    login();
})

logoutButton.addEventListener('click', ()=>{
    logout();
})