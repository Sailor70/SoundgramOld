var express = require('express'); //express - framework ułatwiający tworzenie serwera www
var app = express();
var bodyParser = require('body-parser');
var db = require('./server/database/database');
var jwt = require('jsonwebtoken');

process.env.SECRET = "jakies ciulstwo";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/client', express.static(__dirname + '/client'));

//Controllers
var userController = require('./server/controllers/user-controller');

//Routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html')
})

app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.logIn);

db.sync().then(function(){
    app.listen(3000, function(){ //na porcie 3000 będzie obsługiwany serwer
        console.log("nasluchiwanie dziala!");
    })
})