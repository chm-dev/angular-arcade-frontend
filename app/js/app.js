'use strict';

var frontendApp = angular.module('frontendApp', [
    'ngRoute',
 //   'frontendAnimations',
    'frontendControllers',
//    'phonecatFilters',
    'frontendServices',
    'frontendDirectives',
    'ui.keypress'
]);


frontendApp.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/platforms', {
            templateUrl: 'partials/platforms.html',
            controller: 'PlatformsCtrl'
        }).
        when('/platform/:platform', {
            templateUrl: 'partials/games-list.html',
            controller: 'GamesListCtrl'
        }).
        when('/settings', {
            templateUrl: 'partials/settings2.html',
            controller: 'SettingsCtrl'
        }).
        otherwise({
            redirectTo: '/platforms'
        });
  }]);