
//creates dynamically DOM elements in html

const userName = document.createElement('input'); //username input field
userName.type = 'text';
userName.class =

const password = document.createElement('input'); //password input field
password.type = 'text';

const container = document.createElement('div');
const button = document.createElement('div');
const text = document.createTextNode('login');

button.appendChild(text);
button.addEventListener('click', e => {
  const user = document.querySelectorAll('input')[0].value;
  const password = document.querySelectorAll('input')[1].value;
});

container.appendChild(userName);
container.appendChild(password);
container.appendChild(button);

document.body.appendChild(container);

function login(user, password){

}
