"use strict";

import arrowInputs from "./arrow-inputs";
import clearSelection from "./clear-selection";
import helpers from "./helper";
import keyboardInput from "./keyboard-input";
import mouse from "./mouse";

export default {
  mixins: [arrowInputs, clearSelection, helpers, keyboardInput, mouse],
  computed: {
    currentWord() {
      //  tracks current word being edited
      let word = this.editorArray[this.editLocation.line][this.editLocation.word];
      if (word == undefined) {
      } else if (word.indexOf(" ") > -1) {
        return word.trim();
      } else if (word !== " ") {
        return word;
      }
    },
    currentLine() {
      // tracks content of current line being edited
      return this.editorArray[this.editLocation.line];
    },
    singleSelection() {
      if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
        return false;
      } else {
        return true;
      }
    },
    targetLocation() {
      const line = this.editLocation.line;
      const word = this.editLocation.word;
      const letter = this.editLocation.letter;
      return line + "-" + word + "-" + letter;
    },
    endOfLastLine() {
      if (this.editorArray[0][0] == [" "]) {
        return "0-0-1";
      }
      const line = this.editorArray.length - 1;
      const word = this.editorArray[line].length - 1;
      const letter = this.editorArray[line][word].length;
      return line + "-" + word + "-" + letter;
    },
  },
};
