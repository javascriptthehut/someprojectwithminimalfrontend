
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
  const username = document.querySelectorAll('input')[0].value;
  const pass = document.querySelectorAll('input')[1].value;
  login(username, pass);
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
      get();
    }
  };
  xhr.open('post', '/post');
  xhr.send(`username=${user}&token=${token}&message=${tweet}`);
}

function get(){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4 && xhr.status === 403) {
      alert(xhr.responseText);
    } else if (xhr.readyState === 4 && xhr.status === 200) {
      let output = JSON.parse(xhr.responseText);
      updateDom(output);
    }
  };
  xhr.open('get', '/get');
  xhr.send();
}

const updateDom = (array) => {
  removeChildren();
  array.forEach((el) => {
    let tweet = el.message;
    let p = document.createElement('p');
    let texta = document.createTextNode(tweet);
    p.appendChild(texta);
    document.body.appendChild(p);
  });
};

function removeChildren () {
  let tweets = document.getElementsByTagName('p');
  while(tweets.length) {
    document.body.removeChild(document.body.lastChild);
  }
}

window.onload = get();
