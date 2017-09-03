"use strict";

export default {
  updateonchange() {
    this.editorArray = this.editorData.split("\n");
  },
  setEditorData(ev) {
    const inputs = ev.srcElement.children;
    let temp = "";
    for (var i = 0; i < inputs.length; i++) {
      temp = temp + String(inputs[i].textContent) + "\n";
    }
    this.editorData = temp;
  },
};
