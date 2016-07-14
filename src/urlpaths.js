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

/* the get method comes from client side(fronend) in js */
function get(req, res){
  const queryString = `SELECT * FROM tweets
                       ORDER BY msgtime DESC
                       LIMIT 12`;
  client.query(queryString, (err, response) => {

    const json = JSON.stringify(response.rows);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(json);
  });
}

function logon(req, res){
  let body = '';
  req.on('data', (data) => {
    body += data; //data comes in bits, in a stream. every bit that comes id then added to the body. the empty string will stringefy the data (which may come as buffer)
    if(body.length > 1e6) { //if the amount of data is bigger then 1 million!
      req.connection.destroy(); //detroy the connection.
    }
  });
  req.on('end', () => {
    const postData = qs.parse(body);  //{username: username, password: password}
    const queryString = `SELECT * FROM users
                         WHERE username = $1
                         AND password = $2`;
    const parameters = [postData.username, postData.password];

    client.query(queryString, parameters, (err, response) => {
      if(response.rows.length === 0){
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end('User and password combination wrong!');
      } else {
        const token = uuid.v4();
        tokens[postData.username] = token;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(token);
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
