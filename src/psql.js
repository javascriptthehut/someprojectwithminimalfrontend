
//setting relation to postgres db

const pg = require('pg');
let DB = '';

if (process.env.DATABASE_URL){      //heroku
  DB = process.env.DATABASE_URL;
  pg.defaults.ssl = true;
} else {                            //local
  DB = 'postgres:///tweetdb';
}

//sets a new postgres client
const client = new pg.Client(DB);
console.log(`connecting to ${DB}...`);
client.connect((err) => {
  if (err) throw err;
  console.log(`connected to ${DB}`);
});

//mosule will be used in urlpaths as 'client.' in order to establish connection to db
module.exports = client;
