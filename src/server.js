//npm
const http = require('http');
//exports
const handler = require('./handler.js');

const server = http.createServer(handler);

const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);
