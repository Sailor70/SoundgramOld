var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

//funkcja autoryzująca - sprawdza poprawność tokena
router.use(function(req,res,next){
    var token = req.headers['auth-token'];
    jwt.verify(token, process.env.SECRET, function(err, decoded){
        if(err){
            res.status(400).send("Token jest nieprawidłowy")
        } else {
            console.log("Id usera: ", decoded.id);
            req.user_id = decoded.id;
            next();
        }
    })
});

//GET
router.get('/get_posts', function(req,res){
    var query = "SELECT u.username, u.display_name, post.post_content, post.id, post.date_posted " + 
    "FROM users u INNER JOIN user_followed_accounts followed ON (u.id = followed.followed_id) " +
    "INNER JOIN user_posts post ON  (post.user_id = followed.followed_id) WHERE followed.user_id=" + req.user_id;

    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        })
    }).catch(function(err){
        res.status(500).send("Nie można wyświetlić teraz postów! " + err);
    })
});
//POST
router.post('/create_post', function(req, res){
    var query = "INSERT INTO user_posts (user_id, post_content, date_posted) VALUES (" +
    req.user_id + ", '" + req.body.content + "', now())";

    db.query(query).spread(function(){
        res.status(200).send("Dodano nowego posta!");
    }).catch(function(err){
        res.status(500).send(err);
    })
});

module.exports = router;