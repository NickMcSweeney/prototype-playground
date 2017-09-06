"use strict";

export default {
  data() {
    return {
      phraseArray: [[" "]],
      targetLine: 0,
    };
  },
  watch: {
    currentTargetLine(newTarget) {
      if (newTarget != this.targetLine) {
        this.phraseArray = [];
        this.editorArray.forEach(line => {
          this.phraseArray.push(line);
        });
        this.targetLine = newTarget;
      }
    },
  },
};
