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
//GET ENDPOINTS
router.get('/get_followed', function(req, res){
    var query = "SELECT followed.followed_id, followed.date_followed, u.username, u.display_name" +
    " FROM user_followed_accounts followed INNER JOIN users u ON(u.id = followed.followed_id) WHERE user_id=" + req.user_id; //"SELECT * FROM user_followed_accounts WHERE user_id=" + req.user_id

    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        });
    }).catch(function(err){
        res.status(500).send(err);
    })
});

router.get('/get_users', function(req, res){ //pobranie wszystkich userów z bazy
    var query = "SELECT id, username, first_name, last_name FROM users WHERE id <> "+req.user_id + " AND id NOT IN (SELECT followed_id FROM user_followed_accounts WHERE user_id = "+ req.user_id +")"; //"SELECT id, username, first_name, last_name FROM users WHERE id <> " + req.user_id + " AND id NOT IN (SELECT followed_id FROM user_followed_accounts WHERE user_id = "+ req.user_id +")"

    db.query(query).spread(function(result, metadata){
        res.json({
            data: result
        });
    }).catch(function(err){
        res.status(500).send(err);
    })
});

//POST ENDPOINTS
router.post('/follow_user', function(req, res){
    var checkQuery = "SELECT * FROM user_followed_accounts WHERE user_id=" + req.user_id + //korzystamy z odtokenowanego id
    " AND followed_id=" + req.body.receiverId;
        
        db.query(checkQuery).spread(function(result, metadata){
            if(result.length === 0){
                insertToFollowed();
            }else{
                res.status(400).send("Już obserwujesz tego użytkownika!");
            }
        }).catch(function(err){
            res.status(500).send("Nie udało się dodać usera do obserwowanych " + err);
        });

        function insertToFollowed(){ //dodaj do obserwowanych
            var query = "INSERT INTO user_followed_accounts (user_id, followed_id, date_followed) VALUES (" + 
            req.user_id + ", " + req.body.receiverId + ", now())";

            db.query(query).spread(function(){
                res.status(200).send("Dodano usera do obserwowanych");
            }).catch(function(){
                res.status(500).send("Nie udało się dodać usera do obserwowanych");
            })
        }
});

router.delete('/unfollow_user/:followed_id', function(req, res){
    var query = "DELETE FROM user_followed_accounts WHERE user_id=" + req.user_id +
    " AND followed_id=" + req.params.followed_id;

    db.query(query).spread(function(){
        res.status(200).send("Usunięto usera z obserwowanych");
    }).catch(function(err){
        res.status(500).send("Nie udało się usunąć usera z obserwowanych: " + err);
    })
});

module.exports = router;