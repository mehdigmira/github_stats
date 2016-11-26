(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($http, $routeParams, $location) {
    var vm = this;
    vm.search = search;
    vm.searchItem = $routeParams.searchItem === undefined ? "" : $routeParams.searchItem;
    init();

    ////

    function search() {
      $location.path('/').search({searchItem: vm.searchItem});
    }

    function init() {
      $http.get('/api/search', {
        params: {
          searchItem: vm.searchItem
        }
      }).then(function (response) {
        if (response.status === 200) {
          vm.repos = response.data.results;
        }
      });
    }
  }
})();
