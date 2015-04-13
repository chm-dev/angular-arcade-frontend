'use strict';

/* Services */

var frontendServices = angular.module('frontendServices', ['ngResource']);

frontendServices.factory('platform', ['$resource',
  function ($resource) {

        return $resource('games/:platform.json', {}, {
            query: {
                method: 'GET',
                params: {
                    platform: 'platforms'
                },
                isArray: true
            }
        });
  }]);