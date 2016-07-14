# someprojectwithminimalfrontend

## Create database for local development

```bash
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
<!-- INSERT INTO users (username, name, password) VALUES ('Cameron', 'Knob', 'knobhead');

INSERT INTO tweets (username, message, msgtime) VALUES ('Cameron', 'I have left!', 246379863); -->

<!--
button for create user

-->

<!-- SELECT * FROM users
WHERE password = 'knobhead'
AND username = 'Cameron'; -->
