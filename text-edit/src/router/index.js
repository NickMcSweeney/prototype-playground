import Vue from "vue";
import Router from "vue-router";
import editor from "@/components/editor";
// import altEditor from "@/components/altEditor";
// import keyBoundEdit from "@/components/keyBoundEdit";
// import convertData from "@/components/convertData";
import textEditor from "@/components/text-editor";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "editor",
      component: editor,
    },
    {
      path: "/text-editor",
      name: "textEditor",
      component: textEditor,
    },
    // {
    //   path: "/editor",
    //   name: "altEditor",
    //   component: altEditor,
    // },
    // {
    //   path: "/keyBoundEdit",
    //   name: "keyBoundEdit",
    //   component: keyBoundEdit,
    // },
    // {
    //   path: "/convertData",
    //   name: "convertData",
    //   component: convertData,
    // },
  ],
});
