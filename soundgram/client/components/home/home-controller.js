(function(window, angular, undefined){
    angular.module('app')
    .controller('homeCtrl', ['$scope', '$http', '$state', 'userSvc',
    function($scope, $http, $state, userSvc){ //homrCtrl ustawiony jako główny w app.js
        
        $scope.createUser = function(user){ //co z nullem?
            $http.post('/api/user/create', user).then(function(response){
                console.log(response)
            }, function(err){
                console.error(err);
            })
        };

        $scope.logUserIn = function(user){
            $http.post('/api/user/login', user).then(function(response){
                //localStorage.clear();
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
    }])
})(window, window.angular)