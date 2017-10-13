"use strict";

export default {
  data() {
    return {
      tabNum: 0,
      isSelectedSuggestion: false,
    };
  },
  methods: {
    tabEvent() {
      let line = this.editLocation.line;
      let word = this.editLocation.word;
      let letter = this.editLocation.letter;
      if (
        (this.possibleLines[this.tabNum] &&
          this.editorArray[0][0] != " " &&
          this.editorArray[line][word].length == letter) ||
        this.editorArray[line][word] == "\n"
      ) {
        let max = this.possibleLines.length - 1;
        if (!this.isSelectedSuggestion && this.tabNum <= max && this.tabNum > -1) {
          this.isSelectedSuggestion = true;
        } else if (this.isSelectedSuggestion && this.tabNum < max && this.tabNum > -1) {
          this.tabNum++;
        } else if (this.isSelectedSuggestion && this.tabNum == max) {
          this.tabNum = 0;
        } else if (this.isSelectedSuggestion && this.tabNum == 0) {
          this.tabNum = max;
        }
      }
    },
  },
};
