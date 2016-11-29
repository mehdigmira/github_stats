(function () {
    'use strict';

    angular
        .module('frontend')
        .directive('commitsHistogram', commitsHistogram);


    function commitsHistogram() {

      return {
        bindToController: {
          data: '=?'
        },
        controller: controllerFunc,
        controllerAs: 'vm',
        restrict: 'E',
        scope: {},
        templateUrl: 'app/components/commits-histogram/histogram.html'
      };


      ////////////

      /* @ngInject */
      function controllerFunc() {
        var vm = this;

        var svg = d3.selectAll('.histogram').append('svg');

        var margin = {top: 20, right: 20, bottom: 70, left: 40},
            width = 600 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

        var y = d3.scale.linear().range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        svg = svg
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          x.domain(_.keys(vm.data));
          y.domain([0, _(vm.data).values().max()]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis)
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("dx", "-.8em")
              .attr("dy", "-.55em")
              .attr("transform", "rotate(-90)" );

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)

          svg.selectAll("bar")
              .data(_.toPairs(vm.data))
            .enter().append("rect")
              .style("fill", "steelblue")
              .attr("x", function(d) { return x(d[0]); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d[1]); })
              .attr("height", function(d) { return height - y(d[1]); });

      }
    }


})();
