import TextEditor from "./components/text-editor/index";

function install(Vue, options) {
  Vue.component("text-editor", TextEditor);
}

export default { install, TextEditor };
export { TextEditor };

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use({ install });
}
