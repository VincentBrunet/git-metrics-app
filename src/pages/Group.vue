<script>
// Utils
import Api from "@/core/Api";
import Component from "@/core/Component";

// Start building component
var vue = new Component("Home");

// Subcomponents
import Chart from "@/components/Chart";
vue.component("chart", Chart);

vue.computed("id", function () {
  return this.$route.params.id;
});

vue.computed("tz", function () {
  // @TODO - Guess timezone
  return 'America/Los_Angeles';
})

vue.data("charts", []);
vue.when(
  [
    // Base
    "$mounted",
    "id",
    "tz",
  ],
  async function () {
    this.render();
  }
);

vue.method("render", async function () {

  var charts = [];

  var chunks = [
    ["Days of the week", ["dow"], "{{git_commit_time_dow}}", function () {
      var values = [];
      for (var i = 0; i < 7; i++) {
        values.push({git_commit_time_dow: i});
      }
      return values;
    }()],
    ["Hours of day", ["hod"], "{{git_commit_time_hod}}:00", function () {
      var values = [];
      for (var i = 0; i < 24; i++) {
        values.push({git_commit_time_hod: i});
      }
      return values;
    }()],
  ];
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chart = {
      type: "categories",
      name: chunk[0],
      values: chunk[3],
      titles: [
      ],
      points: [
        ['commit/changes', {
          'ui_group_id': this.id,
          'timezone': this.tz,
          'timechunks': chunk[1],
        }],
      ],
      xkey: chunk[2],
      ykey: "{{value}}",
    };
    charts.push(chart);
  }

  this.charts = charts;

});

// Export
export default vue.export();
</script>

<template>
  <div class="Group">
    Group
    <h1>{{ id }}</h1>
    Charts:

    <card>
      <chart

        v-for="chart in charts"

        :type="chart.type"
        :name="chart.name"

        :categories_names="chart.titles"
        :categories_points="chart.points"
        :categories_xkey="chart.xkey"
        :categories_ykey="chart.ykey"
        :categories_values="chart.values"

        :history_names="chart.titles"
        :history_points="chart.points"
        :history_xkey="chart.xkey"
        :history_ykey="chart.ykey"
        :history_scale="chart.scale"
        :history_limits="chart.limits"

        :donut_names="chart.titles"
        :donut_points="chart.points"
        :donut_xkey="chart.xkey"
        :donut_ykey="chart.ykey"
        :donut_values="chart.values"

      >
      </chart>
    </card>

  </div>
</template>

<style scoped>
</style>


