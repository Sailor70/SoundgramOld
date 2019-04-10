(function(window, angular, undefined){ //tworze własny service do tokena i danych usera
    angular.module('app')
    .service('userSvc', [function(){
        //localStorage.clear(); //dodane
        var vm = this;
        vm.token = undefined;
        vm.user = undefined;
        
        var cachedToken = localStorage.getItem('token');
        var cachedUser  = localStorage.getItem('user');
        
        if (cachedToken){
            vm.token = JSON.parse(cachedToken);
            vm.user  = JSON.parse(cachedUser);
        }
        
    }]);
})(window, window.angular)