(function() {
  'use strict';

  angular
    .module('frontend')
    .controller('StatsController', StatsController);

  /** @ngInject */
  function StatsController($location, repoContributors, lastCommits) {
    var vm = this;

    vm.tab = 1;

    vm.contributors = repoContributors;
    vm.commitsByUser = _.countBy(lastCommits, "login");
    vm.commitsByDate = _.countBy(lastCommits, function (o) { return moment(o['date']).format('YYYY-MM-DD'); })

    vm.goHome = goHome;

    ///////////

    function goHome() {
      $location.path('/').search({});
    }
  }
})();
