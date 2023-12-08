//Fullstack version (main.js)
const registerButton = document.querySelector('#register-button');
const loginButton = document.querySelector('#login-button');
const logoutButton = document.querySelector('#logout-button');

function register() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    console.log(username)
    console.log(password)

    const userAsObject = {
        user_name: username,
        password: password
    }

    console.log(userAsObject)

    const userAsString =  JSON.stringify(userAsObject)

    console.log(userAsString)

    // Make a POST request to the server to handle user registration
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

    // Make a POST request to the server to handle user login
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response from the server (e.g., redirect to a profile page)
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