<script>
// Utils
import Component from "@/core/Component";
// Subcomponents
import Chart from "@/components/Chart";
// Start building component
var vue = new Component("Repository");

vue.computed("id", function () {
  return this.$route.params.id;
});

vue.computed("tz", function () {
  // @TODO - Guess timezone
  return 'America/Los_Angeles';
})

vue.computed("charts", function () {

  var charts = [];

  var frames = [
    ["All years", "year", "{{time_year}}", "year"],
    ["All quarters", "quarter", "{{time_quarter}}", "quarter"],
    ["All months", "month", "{{time_month}}", "month"],
    ["All weeks", "week", "{{time_week}}", "week"],
    ["All days", "day", "{{time_day}}", "day"],
  ];
  for (var i = 0; i < frames.length; i++) {
    var frame = frames[i];
    charts.push({
      type: "history",
      name: frame[0],
      scale: frame[3],
      points: [
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timeframe': frame[1]}],
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timeframe': frame[1], 'git_author_ids': this.authors}],
      ],
      xkey: frame[2],
      ykey: "{{count}}",
    });
  }

  var chunks = [
    ["Time of the week", ["dow", "hod(6)"], "{{time_dow}} {{time_hod(6)}}:00"],
    ["Day of the month", ["dow"], "{{time_dow}}"],
    ["Hour of day", ["hod"], "{{time_hod}}:00"],
    ["Day of month", ["dom"], "Day {{time_dom}}"],
    ["Day of year", ["doy"], "Day {{time_doy}}"],
    ["Month of year", ["moy"], "{{time_moy}}"],
  ];
  chunks[0].push([]);
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 24/6; j++) {
      chunks[0][3].push({time_dow: i, "time_hod(6)": j*6});
    }
  }
  chunks[1].push([]);
  for (var i = 0; i < 7; i++) {
    chunks[1][3].push({time_dow: i});
  }
  chunks[2].push([]);
  for (var i = 0; i < 24; i++) {
    chunks[2][3].push({time_hod: i});
  }
  chunks[3].push([]);
  for (var i = 1; i <= 31; i++) {
    chunks[3][3].push({time_dom: i});
  }
  chunks[4].push([]);
  for (var i = 1; i <= 366; i++) {
    chunks[4][3].push({time_doy: i});
  }
  chunks[5].push([]);
  for (var i = 1; i <= 12; i++) {
    chunks[5][3].push({time_moy: i});
  }
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    charts.push({
      type: "categories",
      name: chunk[0],
      values: chunk[3],
      points: [
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timechunks': chunk[1]}],
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timechunks': chunk[1], 'git_author_ids': this.authors}],
      ],
      xkey: chunk[2],
      ykey: "{{count}}",
    });
  }

  return charts;

});

vue.data("authors", [2, 17, 21, 38, 39, 116]);
//vue.data("authors", [26, 30, 31, 35]);

vue.component("chart", Chart);

// Export
export default vue.export();
</script>

<template>
  <div class="Repository">
    Repository
    <h1>{{ id }}</h1>
    Chart:

    <chart

      v-for="chart in charts"

      :type="chart.type"
      :name="chart.name"

      :categories_names="[
        'Authors: All',
        'Authors: ' + JSON.stringify(authors),
      ]"
      :categories_colors="[
        '#eeeeee',
        '#9999ff',
      ]"
      :categories_xkey="chart.xkey"
      :categories_ykey="chart.ykey"
      :categories_values="chart.values"
      :categories_points="chart.points"

      :history_names="[
        'Authors: All',
        'Authors: ' + JSON.stringify(authors),
      ]"
      :history_colors="[
        '#eeeeee',
        '#9999ff',
      ]"
      :history_scale="chart.scale"
      :history_points="chart.points"
      :history_xkey="chart.xkey"
      :history_ykey="chart.ykey"

    >
    </chart>

  </div>
</template>

<style scoped>
</style>


