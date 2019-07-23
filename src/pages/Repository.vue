<script>
// Utils
import Api from "@/core/Api";
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

vue.computed("tl2019", function () {
  return ["2019-01-01", "2020-01-01"];
});
vue.computed("tl2018", function () {
  return ["2018-01-01", "2019-01-01"];
});

// Data update
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

  var group_list = (await Api.get("group/list", {"git_repository_id": this.id, "orders": ["git_repository_id", "ui_group_name", "ui_group_id"]})).data.results;
  var group_list_ids = [];
  var group_list_names = [];
  var group_map = {};
  for (var i = 0; i < group_list.length; i++) {
    var group_item = group_list[i];
    group_map[group_item.name] = group_item.id;
    group_list_ids.push(group_item.id);
    group_list_names.push(group_item.name);
  }

  var chart = {
    type: "categories",
    name: "People",
    titles: [],
    values: [],
    points: [],
    xkey: "Peeps",
    ykey: "{{value}}",
  };
  for (var j = 0; j < group_list.length; j++) {
    var group = group_list[j];
    chart.titles.push(group.name);
    chart.points.push(["change/total", {
      "git_repository_id": this.id,
      "git_file_path": "Assets/Scripts/Nanome/*.cs",
      "ui_group_id": group.id,
      "orders": ["ui_group_name"],
      "timelimits": this.tl2019,
    }]);
  }
  charts.push(chart);

  charts.push({
    type: "categories",
    name: "Peops",
    titles: ["all", "2018", "2019"],
    points: [
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
      }],
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
        "timelimits": this.tl2018,
      }],
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
        "timelimits": this.tl2019,
      }]
    ],
    values: [],
    xkey: "{{ui_group_name}}",
    ykey: "{{value}}",
  });

  charts.push({
    type: "donut",
    name: "Peops",
    titles: ["all", "2018", "2019"],
    points: [
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
      }],
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
        "timelimits": this.tl2018,
      }],
      ["change/total", {
        "git_repository_id": this.id,
        "git_file_path": "Assets/Scripts/Nanome/*.cs",
        "orders": ["ui_group_name"],
        "timelimits": this.tl2019,
      }],
    ],
    values: [],
    xkey: "{{ui_group_name}}",
    ykey: "{{value}}",
  });

  var frames = [
    ["All years", "year", "{{git_commit_time_year}}", "year"],
    ["All quarters", "quarter", "{{git_commit_time_quarter}}", "quarter"],
    ["All months", "month", "{{git_commit_time_month}}", "month"],
    ["All weeks", "week", "{{git_commit_time_week}}", "week"],
    //["All days", "day", "{{git_commit_time_day}}", "day"],
  ];

  for (var i = 0; i < frames.length; i++) {
    var frame = frames[i];
    var chart = {
      type: "history",
      name: frame[0],
      scale: frame[3],
      titles: [],
      points: [],
      xkey: frame[2],
      ykey: "{{value}}",
    };
    for (var j = 0; j < group_list.length; j++) {
      var group = group_list[j];
      chart.titles.push(group.name);
      chart.points.push(["change/total", {
        'git_repository_id': this.id,
        'git_file_path': "Assets/Scripts/Nanome/*.cs",
        'ui_group_id': group.id,
        'timezone': this.tz,
        'timeframe': frame[1],
      }]);
    }
    charts.push(chart);
  }
  var chunks = [
    /*
    ["Time of the week", ["dow", "hod(6)"], "{{git_commit_time_dow}} {{git_commit_time_hod(6)}}:00", function () {
      var values = [];
      for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 24/6; j++) {
          values.push({git_commit_time_dow: i, "git_commit_time_hod(6)": j*6});
        }
      }
      return values;
    }()],
    */
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
    /*
    ["Days of month", ["dom"], "Day {{git_commit_time_dom}}", function () {
      var values = [];
      for (var i = 1; i <= 31; i++) {
        values.push({git_commit_time_dom: i});
      }
      return values;
    }()],
    ["Days of year", ["doy"], "Day {{git_commit_time_doy}}", function () {
      var values = [];
      for (var i = 1; i <= 366; i++) {
        values.push({git_commit_time_doy: i});
      }
      return values;
    }()],
    ["Weeks of year", ["woy"], "Week {{git_commit_time_woy}}", function () {
      var values = [];
      for (var i = 1; i <= 53; i++) {
        values.push({git_commit_time_woy: i});
      }
      return values;
    }()],
    ["Months of year", ["moy"], "{{git_commit_time_moy}}", function () {
      var values = [];
      for (var i = 1; i <= 12; i++) {
        values.push({git_commit_time_moy: i});
      }
      return values;
    }()],
    ["Quarters of year", ["qoy"], "{{git_commit_time_qoy}}", function () {
      var values = [];
      for (var i = 1; i <= 4; i++) {
        values.push({git_commit_time_qoy: i});
      }
      return values;
    }()],
    */
  ];
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chart = {
      type: "categories",
      name: chunk[0],
      values: chunk[3],
      titles: [],
      points: [],
      xkey: chunk[2],
      ykey: "{{value}}",
    };
    for (var j = 0; j < group_list.length; j++) {
      var group = group_list[j];
      chart.titles.push(group.name);
      chart.points.push(['commit/changes', {
        'git_repository_id': this.id,
        'ui_group_id': group.id,
        'timezone': this.tz,
        'timechunks': chunk[1],
      }]);
    }
    charts.push(chart);
  }

  this.charts = charts;

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

  </div>
</template>

<style scoped>
</style>


