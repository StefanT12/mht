const express = require('express');
const bodyParser = require("body-parser");
//socket.io-realtime client-server through websockets, to be noted, its split into server and client
/*
Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret
so it may be used by other middleware.
*/
var cookieParser = require('cookie-parser');
//DB
const mongoose = require("mongoose");

const app = express();

//cookie parser
app.use(cookieParser())

// Bodyparser middleware
const urlencodedParser = bodyParser.urlencoded({extended : false});
app.use(bodyParser.json());
app.use(urlencodedParser) // This will parse the body and make it available for routes to use

//provide our server the client
if(process.env.NODE_ENV === 'production'){
  app.use(express.static('../client/build'))
}

// DB Config
const db = process.env.mongoURI || require("../config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

//#region routes
const userRouter = require('./routes/User');
app.use('/api/user', userRouter);

const suggestionRouter = require('./routes/Suggestion');
app.use('/api/suggestion', suggestionRouter);

const serverRouter = require('./routes/Server');
app.use('/api/server', serverRouter);

app.get('*', (request, response) =>
    response.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);
//#endregion

const port = process.env.PORT || 8080;
//listen returns an http server instance we can use later for sockets
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
