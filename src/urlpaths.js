const fs = require('fs');
const qs = require('querystring');
const client = require('./psql.js');
const uuid = require('uuid');

const tokens = {};

function index(req, res) {
  fs.readFile(`${__dirname}/../public/index.html`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}

function publicURL(req, res){
  const path = req.url.split('public')[1];
  const ext = req.url.split('.')[3];
  fs.readFile(`${__dirname}/../public${path}`, (err, data) => {
    if (err) throw err;
    res.writeHead(200, {'Content-Type': `text/${ext}`});
    res.end(data);
  });
}

/* GET FROM DB: the query comes from the db in javascript (by using the pg module)
into the server. server then needs to parse it into JSON so that it
can send it to fronend
*/
function get(req, res){
  const queryString = `SELECT * FROM tweets
                       ORDER BY msgtime DESC
                       LIMIT 12`;
  client.query(queryString, (err, response) => {

    const json = JSON.stringify(res.rows);//get all the rows requested and JSON it.

    const json = JSON.stringify(response.rows);

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(json);
  });
}

//login request
/*db query checks if the login name and password corresponds to what exist in
the database. the 'uuid' module generates a random token(string), */
function logon(req, res){ //when the login is sent from fronend
  let body = ''; //stringify the data from fronend
  req.on('data', (data) => {
    body += data; //data comes in bits, in a stream. every bit that comes id then added to the body. the empty string will stringefy the data (which may come as buffer)
    if(body.length > 1e6) { //if the amount of data is bigger then 1 million!
      req.connection.destroy(); //detroy the connection.
    }
  });
  req.on('end', () => {//when data has all arrived then query db..
    const postData = qs.parse(body);//parse from string to javascript, in this case an object = {username: username, password: password}
    const queryString = `SELECT * FROM users
                         WHERE username = $1
                         AND password = $2`;
    const parameters = [postData.username, postData.password];//match objects username and password

//check first if username and password exist in db
    client.query(queryString, parameters, (err, response) => {
      if(response.rows.length === 0){
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('User and password combination wrong!');
      } else {
        //if it does exist,
        const token = uuid.v4(); //create a unique token,
        tokens[postData.username] = token; //sets the token as the value of the username key
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(token);//respond with the created token
      }
    });
  });
}

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
    if(tokens[postData.username] === postData.token){
      const queryString = `INSERT INTO tweets
                          (username, message, msgtime)
                          VALUES ($1, $2, $3)`;
      const parameters = [postData.username, postData.message, Date.now()];

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
