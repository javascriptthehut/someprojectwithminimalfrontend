const psql = require('./psql.js');
const urlpaths = require('./urlpaths.js');

function handler(req, res) {
  const url = req.url;

  if(url === '/'){
    urlpaths.index(req, res);
  } else if(url.includes('public')) {
    urlpaths.publicURL(req, res);
  } else if (url.includes('get')){
    urlpaths.get(req, res);
  } else if (url.includes('post')){
    urlpaths.post(req, res);
  } else {
    res.writeHead(404);
    res.end('arghhh!');
  }
};

module.exports = handler;
