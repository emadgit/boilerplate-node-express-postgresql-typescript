# boilerplate-node-express-postgresql-typescript

Boilerplate of a node.js express postgresql powered by typescript.

It contain all common middlewares ( To handle things like cors, body request parsing, server and client error handling )

Also used the awesome `Watson` for logging and much more cool stuff ;)

## How to use

Run yarn in root folder :

`yarn`

There is a `.env.sample` file which show you what are the enviremonment variables used in this boilerplate, you need to
create your own `.env` file and provide those vairables with actual data. `.env` is already added in .gitignore file to avoid commiting your credentials to github ;)

You need to set the folowing :

Your `PostgreSql connection string`
`URL` and `PORT` for your server
and `ENVIRONMENT` which in your local can set to `development`

Once you done with these, you are good to go :

`yarn start`
