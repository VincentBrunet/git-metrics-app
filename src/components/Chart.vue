<script>
// External depts
import axios from "axios";
import chart from "chart.js";
// Component builder
import Component from "@/core/Component";
// Start building component
var vue = new Component("Chart");

var url = "http://127.0.0.1:9080/";

vue.prop("type");

vue.prop("datasets_routes");
vue.prop("datasets_params");
vue.prop("datasets_labels");
vue.prop("datasets_colors");

vue.prop("xaxis_format");
vue.prop("yaxis_format");

// Init
vue.data("renderingOptions", null);
vue.data("renderingCanvas", null);
vue.mounted(function () {
  this.renderingOptions = {};
  this.renderingCanvas = new Chart(this.$refs.rendering, this.renderingOptions);
});

// Data update
vue.when(
  [
    "$mounted",
    "type",
    "datasets_routes",
    "datasets_params",
    "datasets_labels",
    "datasets_colors",
    "xaxis_format",
    "yaxis_format",
  ],
  async function () {

    if (this.type == "time_blocks") {
      this.do_time_blocks();
    }

  }
);

import Lambdas from "@/core/Lambdas";

vue.method("do_time_blocks", async function () {
  // Needed
  var bars = [];
  var datasets = [];
  // For each endpoint
  for (var e = 0; e < this.datasets_routes.length; e++) {
    // Request to the API
    var response = await axios.get(url + this.datasets_routes[e], {
      params: this.datasets_params[e],
    });
    // Parse results
    var results = response.data.results;
    // For each data points
    var values = [];
    for (var i = 0; i < results.length; i++) {
      // Point reading
      var point = results[i];
      // Setup bars if first endpoint
      if (e == 0) {
        var bar = Lambdas.resolve(this.xaxis_format, point);
        bars.push(bar);
      }
      // Setup values
      var value = Lambdas.resolve(this.yaxis_format, point);
      values.push(value);
    }
    // Add one dataset per endpoint
    datasets.push({
      data: values,
      label: this.datasets_labels && this.datasets_labels[e],
      backgroundColor: this.datasets_colors && this.datasets_colors[e],
    });
  }
  // Render
  this.do_bar(bars, datasets);
});

vue.method("do_bar", function (labels, datasets) {
  this.renderingOptions.type = "bar";
  this.renderingOptions.data = {
    labels: labels,
    datasets: datasets,
  };
  this.renderingOptions.options = {};
  this.renderingCanvas.update();
});

// Export
export default vue.export();
</script>

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
