const pg = require('pg');
let DB = ''; 
if (process.env.DATABASE_URL){      //heroku
  DB = process.env.DATABASE_URL; 
  pg.defaults.ssl = true;
} else {                            //local
  DB = 'postgres:///tweetdb';
}

const client = new pg.Client(DB);
console.log(`connecting to ${DB}...`);
client.connect((err) => {
  if (err) throw err;
  console.log(`connected to ${DB}`);
});

module.exports = client;

