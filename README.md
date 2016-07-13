# someprojectwithminimalfrontend

## Create database for local development

```bash
createdb tweetdb
psql tweetdb
CREATE TABLE users (
  username  varchar(20)  primary key  not null,
  name      varchar(50)               not null,
  password  chkpass                   not null
);

CREATE TABLE tweets (
  id       serial          primary key                  not null,
  user     varchar(20)     references users(username),
  message  varchar(140)                                 not null,
  msgtime  timestamp [(p)]                              not null
);
```
