
let token = '';
let user = '';
//creates dynamically DOM elements in html

const userName = document.createElement('input'); //username input field
userName.type = 'text';

const password = document.createElement('input'); //password input field
password.type = 'text';

const tweetField = document.createElement('input');
tweetField.type = 'text';

//create button for submitting auth
const container = document.createElement('div');
const button = document.createElement('div');
const text = document.createTextNode('login');

//create button for tweets
const tweetButton = document.createElement('div');
const textButton = document.createTextNode('submit tweet');

button.appendChild(text);
button.addEventListener('click', e => {
  const user = document.querySelectorAll('input')[0].value;
  const password = document.querySelectorAll('input')[1].value;
  login(user, password);
});

tweetButton.appendChild(textButton);
tweetButton.addEventListener('click', e => {
  const tweet = document.querySelectorAll('input')[2].value;
  submitTweet(tweet);
});

container.appendChild(userName);
container.appendChild(password);
container.appendChild(button);
container.appendChild(tweetField);
container.appendChild(tweetButton);

document.body.appendChild(container);

function login(username, password){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 403) {
      alert(xhr.responseText);
    } else if(xhr.readyState === 4 && xhr.status === 200) {
      token = xhr.responseText;
      user = username;
    }
  };
  xhr.open('post', '/logon');
  xhr.send(`username=${username}&password=${password}`);
}

function submitTweet(tweet){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 403) {
      alert(xhr.responseText);
    } else if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  xhr.open('post', '/post');
  xhr.send(`username=${user}&token=${token}&message=${tweet}`);
}
