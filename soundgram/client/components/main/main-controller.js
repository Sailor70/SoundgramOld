(function(window, angular, undefined){
    angular.module('app')
    .controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc',
    function($scope, $state, $http, userSvc){
        $scope.userData = userSvc.user;
        //console.log($scope.userData);

        $scope.userFollowed = [];
        $scope.users = [];

        var config = {
            headers: {
                'auth-token': userSvc.token
            }
        }
        //Functions

        $scope.followUser = function(userId){
            var data = {
                'receiverId': userId
            }
            $http.post('/secure-api/user/follow_user', data, config).then(function(response){
                console.log("Dodano usera do obserwowanych!")
            }, function(err){
                console.error(err);
            })
        }

        $scope.unfollowUser = function(userId){
            
            $http.delete('/secure-api/user/unfollow_user/' + userId , config).then(function(response){
                console.log("Usunięto usera z obserwowanych!")
            }, function(err){
                console.error(err);
            })
        }
        //lista follow'owanych userów
        $http({
            method: "GET",
            url: '/secure-api/user/get_followed',
            headers: {
                'auth-token': userSvc.token
            }
        }).then(function(response){
            $scope.userFollowed = response.data.data;
        }, function(err){
            console.error(err);
        });

        //pobranie listy wszystkich userów
        $http({
            method: "GET",
            url: '/secure-api/user/get_users',
            headers: {
                'auth-token': userSvc.token
            }
        }).then(function(response){
            $scope.users = response.data.data;
        }, function(err){
            console.error(err);
        })
    }]);
})(window, window.angular)