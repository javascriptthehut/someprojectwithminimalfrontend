const fs = require('fs');
const qs = require('querystring');
const client = require('./psql.js');
const uuid = require('uuid');

const tokens = {};

//serves the index page
function index(req, res) {
  fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}

//serves the public folder
function publicURL(req, res){
  const path = req.url.split('public')[1];
  const ext = req.url.split('.').pop();
  fs.readFile(`${__dirname}/../public${path}`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': `text/${ext}`});
    res.end(data);
  });
}

/* GET FROM DB: the data is delivered from the db in javascript (by using the pg module)
into the server. server then needs to parse it into JSON so that it
can send it to the fronend.
*/
function get(req, res){
  //query to get the last 12 items from postgres db
  const queryString = `SELECT * FROM tweets
                       ORDER BY msgtime DESC
                       LIMIT 12`;
  //query function to get the data
  client.query(queryString, (err, response) => {
    const json = JSON.stringify(response.rows);//get all the rows requested and JSON it.
//send a response with data type: JSON (HEADERS + DATA)
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(json);
  });
}

//login request
/*db query checks if the login name and password corresponds to what exist in
the database. the 'uuid' module generates a random token(string), */

function logon(req, res){ //when the login is sent from fronend
  let body = ''; //stringify the data from frontend
  req.on('data', (data) => { //event listener- 'on request of data', send data..
    body = body + data; //data comes in bits, in a stream. every bit that comes is then added to the body. the empty string will stringefy the data (which may come as buffer)
    if(body.length > 1e6) { //if the amount of data is bigger then 1 million!
      req.connection.destroy(); //detroy the connection.
    }
  });
  req.on('end', () => {//when data has all arrived, make a query to db.
    const postData = qs.parse(body);//parse from string to javascript, in this case an object = {username: username, password: password}
    //set a query to db:
    const queryString = `SELECT * FROM users
                         WHERE username = $1
                         AND password = $2`;
    const parameters = [postData.username, postData.password];//param are parsed objects - username and password

//check first if username and password exist in db
    client.query(queryString, parameters, (err, response) => {
      //check first if params match what exists already in db and reply accordingly
      if(response.rows.length === 0){
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('User and password combination wrong!');
      } else {
        //and if it does exist then,
        const token = uuid.v4(); //create a unique token,
        tokens[postData.username] = token; //sets the token as the value of the username key
        res.writeHead(200, {'Content-Type': 'text/plain'});//send head
        res.end(token);//respond with the created token which is now saved on server memory
        //user now has a unique token related to his username
      }
    });
  });
}

//function to add tweets into the db
function post(req, res){
  let body = '';
  req.on('data', (data) => {
    body += data; //data comes in bits, in a stream. every bit that comes id then added to the body. the empty string will stringefy the data (which may come as buffer)
    if(body.length > 1e6) { //if the amount of data is bigger then 1 million!
      req.connection.destroy(); //detroy the connection.
    }
  });
  req.on('end', () => {
    const postData = qs.parse(body);  //parsing from a query string (body) into an object
    //check first if the token of the username match the one saved on server
    if(tokens[postData.username] === postData.token){
      //sets a postgres db query to save tweet into db
      const queryString = `INSERT INTO tweets
                          (username, message, msgtime)
                          VALUES ($1, $2, $3)`;
      const parameters = [postData.username, postData.message, Date.now()];
//function to set data into db
      client.query(queryString, parameters, (err, response) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('tweet posted');
      });
    } else {
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('not logged in');
    }
  });
}

module.exports = {
  index: index,
  publicURL: publicURL,
  get: get,
  logon: logon,
  post: post,
};
