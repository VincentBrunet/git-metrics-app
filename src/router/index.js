
// Vendors
import Vue from "vue";
import Router from "vue-router";

// App pages
import Home from "@/pages/Home";
import Group from "@/pages/Group";
import Repository from "@/pages/Repository";

// Init router
Vue.use(Router);

// Define routes
export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/repository/:id",
      name: "Repository",
      component: Repository,
    },
    {
      path: "/group/:id",
      name: "Group",
      component: Group,
    },
  ],
});
