const http = require('http');
const handler = require('./handler.js');

const server = http.createServer(handler.handler);

const port = process.env.PORT || 5000;

server.listen(port);
console.log(`listening on port ${port}`);
