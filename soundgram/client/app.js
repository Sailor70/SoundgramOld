(function(window, angular, undefined){ //definiujemy moduł (angular.module)
    angular.module('app', ['ui.router']) //w kwadratowym moduł dependencyjny do routingu
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', function($urlRouterProvider, 
        $stateProvider, $locationProvider){
            $locationProvider.html5Mode(true); //usunięcie #! z url strony + <base> w index.html
            $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/client/components/home/home.html',
                controller: 'homeCtrl'
            })
            .state('main', {
                url: '/main',
                templateUrl: '/client/components/main/main.html',
                controller: 'mainCtrl'
            })
            $urlRouterProvider.otherwise('/');
        }])
})(window, window.angular)