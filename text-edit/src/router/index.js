import Vue from "vue";
import Router from "vue-router";
import convertData from "@/components/convertData";
import textEditor from "@/components/text-editor/index";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/text-editor",
      name: "textEditor",
      component: textEditor,
    },
    {
      path: "/convertData",
      name: "convertData",
      component: convertData,
    },
  ],
});
