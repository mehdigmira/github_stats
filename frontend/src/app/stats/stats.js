(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('StatsController', StatsController);

  /** @ngInject */
  function StatsController($http, $routeParams, $location, repoContributors, lastCommits) {
    var vm = this;

    vm.contributors = repoContributors;
    vm.commitsByUser = _.countBy(lastCommits, "login");
    vm.commitsByDate = _.countBy(lastCommits, function (o) { return moment(o['date']).format('YYYY-MM-DD'); })
  }
})();
