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
