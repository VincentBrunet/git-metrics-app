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

vue.data("data", "hello");

vue.prop("prop", "default");

vue.data("authors", [26, 30, 31, 35]);

vue.when(["$mounted", "id"], function () {
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
      :type="'time_blocks'"

      :datasets_routes="[
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dow', 'hod']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dow', 'hod'], 'git_author_ids': authors},
      ]"
      :datasets_labels="[
        'Commits in an average day',
        'Specific to vincent?',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
      ]"

      :xaxis_format="'{{time_dow}} {{time_hod}}:00'"
      :yaxis_format="'{{count}}'"
    >
    </chart>


    <chart
      :type="'time_blocks'"

      :datasets_routes="[
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dow']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dow'], 'git_author_ids': authors},
      ]"
      :datasets_labels="[
        'Commits in an average day',
        'Specific to vincent?',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
      ]"

      :xaxis_format="'{{time_dow}}'"
      :yaxis_format="'{{count}}'"
    >
    </chart>

    <chart
      :type="'time_blocks'"
      :datasets_routes="[
        'commit/count',
        'commit/count',
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['hod']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['hod'], 'git_author_ids': [28]},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['hod'], 'git_author_ids': [26, 30, 31, 35]},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['hod'], 'git_author_ids': [5, 8, 37]},
      ]"
      :datasets_labels="[
        'Commits in an average day',
        'Specific to Jacqui',
        'Specific to Ethan',
        'Specific to Ty',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
        '#99ff99',
        '#ff9999',
      ]"

      :xaxis_format="'{{time_hod}}:00'"
      :yaxis_format="'{{count}}'"
    >
    </chart>

    <chart
      :type="'time_blocks'"

      :datasets_routes="[
        'commit/count',
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dom']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dom'], 'git_author_ids': [28]},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['dom'], 'git_author_ids': [26, 30, 31, 35]},
      ]"
      :datasets_labels="[
        'Commits in an average month',
        'Specific to 1',
        'Specific to 2',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
        '#99ff99',
      ]"

      :xaxis_format="'{{time_dom}}'"
      :yaxis_format="'{{count}}'"
    >
    </chart>

    <chart
      :type="'time_blocks'"

      :datasets_routes="[
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['doy']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['doy'], 'git_author_ids': authors},
      ]"
      :datasets_labels="[
        'Commits in an average year',
        'Specific to vincent?',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
      ]"

      :xaxis_format="'Day {{time_doy}}'"
      :yaxis_format="'{{count}}'"
    >
    </chart>

    <chart
      :type="'time_blocks'"

      :datasets_routes="[
        'commit/count',
        'commit/count',
      ]"
      :datasets_params="[
        {'timezone': 'America/Los_Angeles', 'timechunks': ['moy']},
        {'timezone': 'America/Los_Angeles', 'timechunks': ['moy'], 'git_author_ids': authors},
      ]"
      :datasets_labels="[
        'Commits per months',
        'Specific to vincent?',
      ]"
      :datasets_colors="[
        '#eeeeee',
        '#9999ff',
      ]"

      :xaxis_format="'{{time_moy}}'"
      :yaxis_format="'{{count}}'"
    >
    </chart>
  </div>
</template>

<style scoped>
</style>


