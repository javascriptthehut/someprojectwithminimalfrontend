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

const queryString = `SELECT * FROM users
                     WHERE password = $1
                     AND username = $2`;
const postData = {
  username: 'Cameron',
  password: 'knobhead'
};
const parameters = [postData.password, postData.username];

client.query(queryString, parameters, (err, res) => {
  console.log(res.rows);
});

module.exports = client;
