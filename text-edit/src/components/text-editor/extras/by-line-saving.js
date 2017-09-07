"use strict";

export default {
  data() {
    return {
      phraseArray: [[" "]],
    };
  },
  watch: {
    targetLine(newTarget) {
      console.log("targetLine", newTarget, this.phraseArray);
      this.phraseArray = [];
      this.linesPerLanguage = this.languageOfLines;
      this.editorArray.forEach((line, index) => {
        this.phraseArray.push({
          line: line,
          meta: {
            endTime: new Date(),
            language: this.displayLang(index),
          },
        });
      });
    },
  },
};
