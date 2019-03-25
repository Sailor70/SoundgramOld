var express = require('express');
var router = express.Router();
var db = require('../database/database');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/follow_user', function(req, res){
    //sprawdzić czy już followuje
    var checkQuery = "SELECT * FROM user_followed_accounts WHERE user_id=" + req.body.senderId +
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
            req.body.senderId + ", " + req.body.receiverId + ", now())";

            db.query(query).spread(function(){
                res.status(200).send("Dodano usera do obserwowanych");
            }).catch(function(){
                res.status(500).send("Nie udało się dodać usera do obserwowanych");
            })
        }
});

module.exports = router;