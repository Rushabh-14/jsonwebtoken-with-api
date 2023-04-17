const express = require('express');

const port = 9000;

const app = express();
     
const db = require('./config/mongoose');

const jwt = require('./config/passport-jwt-strategy');
const sjwt = require('./config/passport-jwt-strategy-student');

app.use(express.urlencoded());

const cookie = require('cookie-parser');

const session = require('express-session');

app.use(session({
    name : 'rushabh',
    secret : 'apis',
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge : 1000*60*60
    }
}));
app.use(cookie());

app.use('/',require('./routes'));

app.listen(port,(err)=>{
    if(err){
        console.log("server not start");
        return false;
    }
    console.log("Server start on port :- "+port);
})