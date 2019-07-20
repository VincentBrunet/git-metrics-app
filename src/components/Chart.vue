<template>
  <div class="comp">
    <canvas ref="rendering"></canvas>
  </div>
</template>

<script>
// External depts
import axios from "axios";
import chart from "chart.js";
// Component builder
import Component from "@/core/Component";
// Start building component
var vue = new Component("Chart");

var url = "http://127.0.0.1:7080/";

// Main graph type
vue.prop("type");

// Generic params
vue.prop("name");

// Categories params
vue.prop("categories_names");
vue.prop("categories_colors");
vue.prop("categories_values");
vue.prop("categories_points");
vue.prop("categories_xkey");
vue.prop("categories_ykey");

// History params
vue.prop("history_names");
vue.prop("history_scale");
vue.prop("history_colors");
vue.prop("history_points");
vue.prop("history_xkey");
vue.prop("history_ykey");
vue.prop("history_limits");

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
    // History
    "history_names",
    "history_scale",
    "history_colors",
    "history_points",
    "history_xkey",
    "history_ykey",
    "history_limits",
  ],
  async function () {
    this.render();
  }
);

import Lambdas from "@/core/Lambdas";

vue.method("render", async function () {
  if (this.type == "categories") {
    this.render_categories();
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
    var response = await axios.get(url + routeUrl, {
      params: routeParams,
    });
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
      label: this.categories_names && this.categories_names[i],
      backgroundColor: this.categories_colors && this.categories_colors[i],
      borderColor: this.categories_colors[i],
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
    var response = await axios.get(url + routeUrl, {
      params: routeParams,
    });
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
      label: this.history_names && this.history_names[i],
      backgroundColor: this.history_colors && this.history_colors[i],
      borderColor: this.history_colors[i],
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
  this.update(chart);
});

vue.method("update", async function (chart) {
  if (this.chart != null) {
    this.chart.destroy();
  }
  this.chart = new Chart(this.$refs.rendering, chart);
});

// Export
export default vue.export();
</script>

<style scoped>
.comp {
  position: relative;
}
</style>
