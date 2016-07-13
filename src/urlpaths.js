const fs = require('fs');
const qs = require('querystring');
const client = require('./psql.js');

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
  const queryString = '';
  client.query(queryString, (err, res) => {

    const json = JSON.stringify('data');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(json);
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
    console.log(postData, 'posted');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('posted');
  });
}

module.exports = {
  index: index,
  publicURL: publicURL,
  get: get,
  post: post,
};
