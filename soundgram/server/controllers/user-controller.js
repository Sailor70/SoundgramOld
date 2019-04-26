var db = require('../database/database');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(5); //do haszowania hasła

module.exports.createUser = function(req, res){
    var password = bcrypt.hashSync(req.body.user_password, salt);
    var query = "INSERT INTO users (username, user_password, email) VALUES ('" + req.body.username +
    "', '" + password + "', '" + req.body.email + "')";

    db.query(query).spread(function(result, metadata){
        res.status(200).send("Pomyślnie utworzono usera"); //200 znaczy że wszystko ok
    }).catch(function(err){
        res.status(500).send("Błąd przy tworzeniu usera " + err);
    })
}

module.exports.logIn = function(req, res){
    var submittedPassword = req.body.password; //hasło wpisane przez usera podczas logowania

    var query = "SELECT * FROM users WHERE username='" + req.body.loginName + "' OR email='" + req.body.loginName + "'";

    db.query(query).spread(function(result,metadata){ //wykonanie zapytania
        var userData = result[0]; //wynik zapytania
        var isVerified = bcrypt.compareSync(submittedPassword, userData.user_password); //sprawdzanie poprawności hasła

        var token = jwt.sign(userData, process.env.SECRET, { expiresIn: 60*60*24 })

        if(isVerified){
            delete userData.user_password;
            res.json({
                data: userData,
                token: token
            });
        }
        else {
            res.status(400).send("Nieprawidłowe hasło!");
        }
    }).catch(function(err){
        res.status(500).send("nie udało się zrealizaować zapytania " + err);
    })
}