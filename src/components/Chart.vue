<template>
  <div class="comp">
    <canvas ref="rendering"></canvas>
  </div>
</template>

<style scoped>
.comp {
  position: relative;
}
</style>

<script>
// External depts
import chart from "chart.js";
// Api communication
import Api from "@/core/Api";
import Utils from "@/core/Utils";
// Component builder
import Component from "@/core/Component";
// Start building component
var vue = new Component("Chart");

// Main graph type
vue.prop("type");

// Generic params
vue.prop("name");

// Categories params
vue.prop("categories_names");
vue.prop("categories_values");
vue.prop("categories_points");
vue.prop("categories_xkey");
vue.prop("categories_ykey");
vue.prop("categories_colors");

// Categories params
vue.prop("donut_names");
vue.prop("donut_values");
vue.prop("donut_points");
vue.prop("donut_xkey");
vue.prop("donut_ykey");
vue.prop("donut_colors");

// History params
vue.prop("history_names");
vue.prop("history_points");
vue.prop("history_xkey");
vue.prop("history_ykey");
vue.prop("history_limits");
vue.prop("history_scale");
vue.prop("history_colors");

// Init
vue.data("chart", null);
vue.mounted(function () {
  if (this.chart != null) {
    this.chart.destroy();
  }
  this.chart = new Chart(this.$refs.rendering, {});
});

// Data update
vue.when(
  [
    // Base
    "$mounted",
    "type",
    // Categories
    "categories_names",
    "categories_colors",
    "categories_values",
    "categories_points",
    "categories_xkey",
    "categories_ykey",
    // Donuts
    "donut_names",
    "donut_colors",
    "donut_values",
    "donut_points",
    "donut_xkey",
    "donut_ykey",
    // History
    "history_names",
    "history_points",
    "history_xkey",
    "history_ykey",
    "history_scale",
    "history_limits",
    "history_colors",
  ],
  async function () {
    this.render();
  }
);

import Lambdas from "@/core/Lambdas";

vue.method("color", function (i, alpha) {
  var colors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618',
    '#990099', '#3B3EAC', '#0099C6', '#DD4477',
    '#66AA00', '#B82E2E', '#316395', '#994499',
    '#22AA99', '#AAAA11', '#6633CC', '#E67300',
    '#8B0707', '#329262', '#5574A6', '#3B3EAC'
  ];
  var hex = colors[i % colors.length];
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
});

vue.method("render", async function () {
  if (this.type == "categories") {
    this.render_categories();
  }
  if (this.type == "donut") {
    this.render_donut();
  }
  if (this.type == "history") {
    this.render_history();
  }
});

vue.method("render_categories", async function () {
  // Needed
  var positions = {};
  var categories = [];
  var datasets = [];
  // Read values
  if (this.categories_values) {
    for (var i = 0; i < this.categories_values.length; i++) {
      var bar = Lambdas.resolve(this.categories_xkey, this.categories_values[i]);
      categories.push(bar);
      positions[bar] = i;
    }
  }
  // Read points
  for (var i = 0; i < this.categories_points.length; i++) {
    // Dataset values
    var values = [];
    // Prepare range
    for (var j = 0; j < categories.length; j++) {
      values.push(undefined);
    }
    // Route infos
    var routeUrl = this.categories_points[i][0];
    var routeParams = this.categories_points[i][1];
    // Request to the API
    var response = await Api.get(routeUrl, routeParams);
    // Parse results
    var points = response.data.results;
    // For each data points
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      var bar = Lambdas.resolve(this.categories_xkey, point);
      var position = positions[bar];
      if (position === undefined) {
        categories.push(bar);
        positions[bar] = values.length;
        position = values.length;
        values.push(undefined);
      }
      values[position] = (values[position] || 0) + parseInt(Lambdas.resolve(this.categories_ykey, point));
    }
    // Add one dataset per endpoint
    datasets.push({
      data: values,
      label: (this.categories_names && this.categories_names[i]) || "",
      backgroundColor: (this.categories_colors && this.categories_colors[i]) || this.color(i, 0.5),
      borderWidth: 1,
    });
  }
  // Render
  var chart = {
    type: "bar",
    data: {
      labels: categories,
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: this.name,
      },
    },
  };
  // Done
  this.update(chart);
});

vue.method("render_donut", async function () {
  // Needed
  var positions = {};
  var categories = [];
  var datasets = [];
  // Read values
  if (this.donut_values) {
    for (var i = 0; i < this.donut_values.length; i++) {
      var bar = Lambdas.resolve(this.donut_xkey, this.donut_values[i]);
      categories.push(bar);
      positions[bar] = i;
    }
  }
  // Read points
  for (var i = 0; i < this.donut_points.length; i++) {
    // Dataset values
    var values = [];
    // Prepare range
    for (var j = 0; j < categories.length; j++) {
      values.push(undefined);
    }
    // Route infos
    var routeUrl = this.donut_points[i][0];
    var routeParams = this.donut_points[i][1];
    // Request to the API
    var response = await Api.get(routeUrl, routeParams);
    // Parse results
    var points = response.data.results;
    var colors = [];
    // For each data points
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      var bar = Lambdas.resolve(this.donut_xkey, point);
      var position = positions[bar];
      if (position === undefined) {
        categories.push(bar);
        positions[bar] = values.length;
        position = values.length;
        values.push(undefined);
      }
      values[position] = (values[position] || 0) + parseInt(Lambdas.resolve(this.donut_ykey, point));
      colors[position] = (this.donut_colors && this.donut_colors[position]) || this.color(position, 0.5);
    }
    // Add one dataset per endpoint
    datasets.push({
      data: values,
      label: (this.donut_names && this.donut_names[i]) || "name",
      backgroundColor: colors,
      borderColor: colors,
      borderWidth: 1,
    });
  }
  // Render
  var chart = {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: this.name,
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItems, data) {
            var tooltipItem = tooltipItems[0];
            return data.datasets[tooltipItem.datasetIndex].label;
          },
          label: function(tooltipItem, data) {
            return data.labels[tooltipItem.index];
          }
        }
      }
    },
  };
  // Done
  this.update(chart);
});

vue.method("render_history", async function () {
  // Make datasets
  var datasets = [];
  // Read points
  for (var i = 0; i < this.history_points.length; i++) {
    // Route infos
    var routeUrl = this.history_points[i][0];
    var routeParams = this.history_points[i][1];
    // Request to the API
    var response = await Api.get(routeUrl, routeParams);
    // Parse results
    var points = response.data.results;
    var values = [];
    var times = {};
    // For each data points
    for (var j = 0; j < points.length; j++) {
      var point = points[j];
      var x = new Date(Lambdas.resolve(this.history_xkey, point));
      var y = parseInt(Lambdas.resolve(this.history_ykey, point));
      if (times[x] === undefined) {
        var value = {
          x: x,
          y: y,
        };
        times[x] = value;
        values.push(value);
      }
      else {
        times[x].y += y;
      }
    }
    // Add one dataset per endpoint
    datasets.push({
      data: values,
      label: (this.history_names && this.history_names[i]) || "",
      backgroundColor: (this.history_colors && this.history_colors[i]) || this.color(i, 0.5),
      borderWidth: 1,
    });
  }
  // Time limits
  var min = ((this.history_limits || {}).min) || ((this.history_limits || [])[0]);
  var max = ((this.history_limits || {}).max) || ((this.history_limits || [])[1]);
  // Render
  var chart = {
    type: "bar",
    data: {
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: this.name,
      },
      scales: {
        xAxes: [{
          type: 'time',
          distribution: "linear",
          bounds: "data",
          offset: true,
          time: {
            unit: this.history_scale,
            min: min,
            max: max,
          },
          ticks: {
            autoSkip: true,
            source: "auto",
          }
        }],
      },
    },
  };
  // Done
  this.update(chart);
});

vue.method("update", async function (chart) {

  chart.options.tooltips = {
    backgroundColor: '#FFF',
    titleFontSize: 16,
    titleFontColor: this.color(0, 0.9),
    bodyFontColor: '#000',
    bodyFontSize: 14,
    displayColors: false,
    caretSize: 8,
    cornerRadius: 8,
    borderWidth: 1,
    bodySpacing: 8,
    borderColor: this.color(0, 0.5),
  };

  if (this.chart != null) {
    this.chart.destroy();
  }
  this.chart = new Chart(this.$refs.rendering, chart);
});

// Export
export default vue.export();
</script>
