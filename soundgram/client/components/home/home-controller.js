(function(window, angular, undefined){
    angular.module('app')
    .controller('homeCtrl', ['$scope', '$http', '$state', 'userSvc',
    function($scope, $http, $state, userSvc){ //homrCtrl ustawiony jako główny w app.js

        $scope.emailInvalid = false;
        $scope.usernameInvalid = false;
        $scope.passwordInvalid = false;

        
        $scope.createUser = function(user){ //co z nullem?

            if(!isEmail(user)){
                $scope.emailInvalid = true;
            }
            else{
                $scope.emailInvalid = false;
            }
            if(!usernameIsValid(user)){
                $scope.usernameInvalid = true;
            }
            else{
                $scope.usernameInvalid = false;
            }
            if(!checkPassword(user)){
                $scope.passwordInvalid = true;
            }
            else{
                $scope.passwordInvalid = false;
            }

            console.log($scope.emailInvalid + ' ' + $scope.usernameInvalid + ' ' + $scope.passwordInvalid);
            if(!$scope.emailInvalid && !$scope.usernameInvalid && !$scope.passwordInvalid){
                $http.post('/api/user/create', user).then(function(response){
                    console.log(response)
                }, function(err){
                    console.error(err);
                })
            }
        };

        $scope.logUserIn = function(user){
            $http.post('/api/user/login', user).then(function(response){
                userSvc.token = response.data.token; //token wyświetlany poprawnie
                userSvc.user = response.data.userData; //to daje undefined! a przy json.parse unexpected character at line 1
                localStorage.setItem('token', userSvc.token);
                localStorage.setItem('user', userSvc.user); //JSON.stringify(userSvc.user)
                //console.log(response.data.token);
                $state.go('main');
            }, function(err){
                console.error(err);
            })    
        }

        var init = function(){ //tymczasowa funkcja czyszcząca na początek localStorage
            localStorage.clear()
            //console.log(localStorage.getItem('token'));
        }
        init();
        
        var isEmail = function(user){
            var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailReg.test(user.email);
        }
        var usernameIsValid = function(user) {
            var usernameReg = /^[0-9a-zA-Z_.-]+$/;
            return usernameReg.test(user.username);
        }

        var checkPassword = function checkPassword(user)
        {
            // at least one number, one lowercase letter
            // at least six characters
            var re = /(?=.*\d)(?=.*[a-z]).{6,}/; //(?=.*[A-Z]) 
            return re.test(user.user_password);
        }
    }])
})(window, window.angular)