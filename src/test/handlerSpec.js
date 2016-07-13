/*
Serves index.html
creates new tweet
lists latest tweets
search tweets
*/
const http = require('http');
const tape = require('tape');
const shot = require('shot');
const pg = require('pg');
const handler = require('../handler.js');

tape('test a get request to the / endpoint', (t) => {
  shot.inject(handler, {method: 'get', url: '/'}, (res) => {
    t.equal(res.statusCode, 200, '/ has status code of 200');
    t.ok(res.payload.includes('<!DOCTYPE'), 'finds the index.html file');//check if its truthy - 'if something exist is true', like an array,string(also empty) is true but zero(0), undefinied, false, "", null and nun are not
    t.equal(res.headers['Content-Type'], 'text/html', 'respond with type/html');// you can test if it sees also a js file or a css file ect.
    t.end();
  });
});

tape('testing for 404 an ened point which won\'t be handling', (t) => {
  shot.inject(handler, {method: 'get', url: '/9027597835'}, (res) => {
    t.equal(res.statusCode, 404, '/something has status code of 404');
    t.end();
  });
});

tape('serves public folder', (t) => {
  shot.inject(handler, {method: 'get', url: '../public/script.js'}, (res) => {
    t.equal(res.statusCode, 200, '/ has status code of 200');
    t.equal(res.headers['Content-Type'], 'text/js', 'respond with text/js');// you can test if it sees also a js file or a css file ect.
    t.end();
  });
});

// tape('returns a list of tweets on /get', function(t){
//   shot.inject(handler, {method: 'get', url: '/get'}, function(res)
// }
