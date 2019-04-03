(function(window, angular, undefined){
    angular.module('app')
    .controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc',
    function($scope, $state, $http, userSvc){
        $scope.userData = userSvc.user;
        //console.log($scope.userData);

        $scope.userFollowed = [];
        $scope.users = [];

        //Functions

        $scope.addUser = function(userId){
            var requestData = {
                //dodać usera do followowanych
            }
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
            console.err(err);
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
            console.err(err);
        })
    }]);
})(window, window.angular)