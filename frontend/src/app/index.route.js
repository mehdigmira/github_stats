(function() {
  'use strict';

  angular
    .module('frontend')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .when('/stats', {
        templateUrl: 'app/stats/stats.html',
        controller: 'StatsController',
        controllerAs: 'vm',
        resolve: {
          repoContributors: function ($http, $route) {
              var repo = $route.current.params.repo;
              return $http.get('/api/contributors/' + repo).then(
                function(response) {
                  return response.data.results;
                }
              );
          },
          lastCommits: function ($http, $route) {
              var repo = $route.current.params.repo;
              return $http.get('/api/last-commits/' + repo).then(
                function(response) {
                  return response.data.results;
                }
              );
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
