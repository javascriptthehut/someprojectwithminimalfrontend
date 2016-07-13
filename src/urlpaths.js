const fs = require('fs');
const http = require('http');
const handler = require('./handler.js');

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
  client.lrange('id:all', -13, -1, (err, lastThirteen) => { //the get method will give back an array from redis.
    if (err) throw err;
    const promises = lastThirteen.map((id) => {
      return new Promise((resolve, reject) => {
        client.hgetall('id:' + id, (error, hash)=>{
          if (error) reject(error);
          resolve(hash);
        });
      });
    });

    Promise.all(promises)
      .then((hashArray)=>{
        const json = JSON.stringify(hashArray);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(json);
      }, (errors) => {
        console.log(errors);
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
    console.log(postData, 'posted');
    client.lindex('id:all', -1, (err, reply) => { //getting the key(id:all), will get the value of that key. the lindex command gets the key form a list and a specific key
      if (err) throw err;
      if(!reply) {
        reply = 0;
      }
      const data = Number(reply) + 1;
      client.rpush('id:all', data);
      client.hmset('id:' + data, postData, (rerr, HMreply) => {
        if (rerr) throw rerr;
        console.log(HMreply);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(`post response: ${HMreply}`);
      }); //hmset sets the key's value as a hash table.

    });
  });
}

module.exports = {
  index: index,
  publicURL: publicURL,
  get: get,
  post: post,
};
