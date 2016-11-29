(function () {
    'use strict';

    angular
        .module('frontend')
        .directive('commitsHistory', commitsHistory);


    function commitsHistory() {

      return {
        bindToController: {
          data: '=?'
        },
        controller: controllerFunc,
        controllerAs: 'vm',
        restrict: 'E',
        scope: {},
        templateUrl: 'app/components/commits-history/history.html'
      };


      ////////////

      /* @ngInject */
      function controllerFunc() {
        var vm = this;

        var dateFormat = d3.time.format("%Y-%m-%d");

        var data = _(vm.data).toPairs()
          .map(function(d) {return [dateFormat.parse(d[0]), d[1]]})
          .sortBy(function (d) { return d[0];})
          .value();

        var svg = d3.selectAll('.history').append('svg');

        var margin = {top: 20, right: 20, bottom: 50, left: 50},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        svg = svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.time.scale()
            .rangeRound([0, width]);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
          .tickFormat(d3.time.format("%Y-%m-%d"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var line = d3.svg.line()
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });


        x.domain(d3.extent(data, function(d) { return d[0]; }));
        y.domain(d3.extent(data, function(d) { return d[1]; }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.55em")
              .attr("transform", "rotate(-90)" );

        g.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

      }
    }


})();
