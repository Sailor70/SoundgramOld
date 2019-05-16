(function(window, angular, undefined){
    angular.module('app')
    .controller('mainCtrl', ['$scope', '$state', '$http', 'userSvc',
    function($scope, $state, $http, userSvc){
        $scope.userData = userSvc.user;
        //console.log($scope.userData);
        $scope.newPost = undefined;
        $scope.userFollowed = [];
        $scope.users = [];
        $scope.followedPosts = [];
        $scope.searchFilter = '';

        var config = {
            headers: {
                'auth-token': userSvc.token
            }
        }
        //Functions
        $scope.filterData = function (user) {
            return anyNameStartsWith(user.username, $scope.searchFilter);
        };

        function anyNameStartsWith (fullname, search) {

            //validate if name is null or not a string if needed
            if (search === '')
              return true;
          
            var delimeterRegex = /[ _-]+/; //wyrazy rozdzielone znakami spacja _ - w dowolnej ilości i kolejności (2 wyrazy)
            //split the fullname into individual names
            var names = fullname.split(delimeterRegex); //rozdziela wyrazy na podstawie podanego regexu
          
            //do any of the names in the array start with the search string
            return names.some(function(name) { //sprawdza czy którykolwiek z elementów spełnia warunek, jeśli któryś spełnia to zwraca true
                return name.toLowerCase().indexOf(search.toLowerCase()) === 0; //zwraca true jeśli name zaczyna się od search (jest na pozycji 0)
            });
        }
        
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

        $scope.submitPost = function(content){
            var requestData = {
                content: content
            }

            $http.post('/secure-api/post/create_post', requestData, config).then(function(response){
                $scope.newPost = "";
                console.log("Post was properly submitted");
            }), function(err){
                console.error(err);
            }
        }
        //posty

        $http.get('/secure-api/post/get_posts', config).then(function(response){
            $scope.followedPosts = response.data.data;
        }, function(err){
            console.error(err);
        });
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

        //pobranie listy userów którzy nie są na liście obserwowanych
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