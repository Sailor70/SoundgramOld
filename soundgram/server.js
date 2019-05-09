var express = require('express'); //express - framework ułatwiający tworzenie serwera www
var app = express();
var bodyParser = require('body-parser'); //body-parser parses your request and converts it into a format from which you can easily extract relevant information that you may need
var db = require('./server/database/database');
var jwt = require('jsonwebtoken');

process.env.SECRET = "music is a King of art"; //co to process?

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/client', express.static(__dirname + '/client'));

//Controllers
var userController = require('./server/controllers/user-controller');

//Routers
var secureUserRouter = require('./server/routes/user');
var securePostRouter = require('./server/routes/post');

app.use('/secure-api/user/', secureUserRouter);
app.use('/secure-api/post/', securePostRouter);

//Routes
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/index.html')
})

app.get('*', function(req, res) { //naprawa cannot GET /main - trzeba przekierować do Angulara wszystkie routy których Node nie używa
    res.sendfile(__dirname + '/client/index.html')
})


app.post('/api/user/create', userController.createUser);
app.post('/api/user/login', userController.logIn);

db.sync().then(function(){
    app.listen(4200, function(){ //na porcie 3000 będzie obsługiwany serwer
        console.log("nasluchiwanie dziala!");
    })
})