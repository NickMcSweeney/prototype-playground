"use strict";

export default {
  data() {
    return {
      phraseArray: [[" "]],
    };
  },
  watch: {
    targetLine(newTarget) {
      this.phraseArray = [];
      this.editorArray.forEach(line => {
        this.phraseArray.push(line);
      });
    },
  },
};
