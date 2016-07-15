# someprojectwithminimalfrontend

## Create database for local development

##Why?
We want to create a simple twitter-like functionality using postgres db. we decided to call it 'someprojectwithminimalfrontend' because we explicitly decided to concentrate mainly on the back-end and have the most minimal front-end possible. we have built the front-end html by using only js DOM element so that we can practice DOM manipulation. There is no css.

It a fun exercise for us to learn:

 * POSTGRES - a relational database
 * how to inquire SQL databases
 * creating a simple login functionality
 * Joining two tables by reference
 * Relation between db and server
 * Data structures
 * DOM manipulation
 * More Node.js


##What?

It a very basic twiiter like application which recieves a login with username and password and then lets you post tweets for the duration of that session. you cannot post tweets if your login info is incorrect.
The index page is done dynamically through DOM manipulation and has only three fields for login and tweet message.

##How?

We have build the database first by adding two tables - users and tweets.
The urlpath file contains all the handler path functions serving different files
as well as querying the db. the data is then passed to the front-end every time an
xhr request is fired. we then manipulate the DOM in order to display the input fields and
tweets posted.



##commands to use on local bash in order to set up db:

```
createdb tweetdb
psql tweetdb
CREATE EXTENSION chkpass;
CREATE TABLE users (
  username  varchar(20)  primary key  not null,
  name      varchar(50)               not null,
  password  chkpass                   not null
);

CREATE TABLE tweets (
  id         serial          primary key                  not null,
  username   varchar(20)     references users(username),
  message    varchar(140)                                 not null,
  msgtime    bigint                                       not null
);
```

```
 INSERT INTO users (username, name, password) VALUES ('fluffy', 'cat', 'biscuits');
```
```
 INSERT INTO tweets (username, message, msgtime) VALUES ('fluffy', 'gimme food', 246379863); -->
```
