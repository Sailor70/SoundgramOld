(function(window, angular, undefined){
    angular.module('app', ['ui.router']) //w kwadratowym moduł dependencyjny do routingu
    .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, 
        $stateProvider){
            $stateProvider.state('home', {
                url: '/',
                templateUrl: '/client/components/home/home.html',
                controller: 'homeCtrl'
            })
            $urlRouterProvider.otherwise('/');
        }])
})(window, window.angular)