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

vue.computed("tl", function () {
  return ["2019-01-01", "2020-01-01"];
});

vue.computed("authors", function () {
  return [2, 17, 21, 38, 39, 116];
});
//vue.computed("authors", [26, 30, 31, 35]);

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

  for (var i = 0; i < frames.length; i++) {
    var frame = frames[i];
    charts.push({
      type: "history",
      name: frame[0] + " 2019 ONLY",
      scale: frame[3],
      points: [
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timeframe': frame[1], "timelimits": this.tl}],
        ['commit/count', {'git_repository_ids': [this.id], 'timezone': this.tz, 'timeframe': frame[1], "timelimits": this.tl, 'git_author_ids': this.authors}],
      ],
      xkey: frame[2],
      ykey: "{{count}}",
      limits: this.tl,
    });
  }

  var chunks = [
    ["Time of the week", ["dow", "hod(6)"], "{{time_dow}} {{time_hod(6)}}:00", function () {
      var values = [];
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 24/6; j++) {
          values.push({time_dow: i, "time_hod(6)": j*6});
        }
      }
      return values;
    }()],
    ["Days of the week", ["dow"], "{{time_dow}}", function () {
      var values = [];
      for (var i = 0; i < 7; i++) {
        values.push({time_dow: i});
      }
      return values;
    }()],
    ["Hours of day", ["hod"], "{{time_hod}}:00", function () {
      var values = [];
      for (var i = 0; i < 24; i++) {
        values.push({time_hod: i});
      }
      return values;
    }()],
    ["Days of month", ["dom"], "Day {{time_dom}}", function () {
      var values = [];
      for (var i = 1; i <= 31; i++) {
        values.push({time_dom: i});
      }
      return values;
    }()],
    ["Days of year", ["doy"], "Day {{time_doy}}", function () {
      var values = [];
      for (var i = 1; i <= 366; i++) {
        values.push({time_doy: i});
      }
      return values;
    }()],
    ["Weeks of year", ["woy"], "Week {{time_woy}}", function () {
      var values = [];
      for (var i = 1; i <= 53; i++) {
        values.push({time_woy: i});
      }
      return values;
    }()],
    ["Months of year", ["moy"], "{{time_moy}}", function () {
      var values = [];
      for (var i = 1; i <= 12; i++) {
        values.push({time_moy: i});
      }
      return values;
    }()],
    ["Quarters of year", ["qoy"], "{{time_qoy}}", function () {
      var values = [];
      for (var i = 1; i <= 4; i++) {
        values.push({time_qoy: i});
      }
      return values;
    }()],
  ];
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
      :history_limits="chart.limits"

    >
    </chart>

  </div>
</template>

<style scoped>
</style>


