"use strict";

import arrowInputs from "./arrow-inputs";
import clearSelection from "./clear-selection";
import keyboardInput from "./keyboard-input";
import mouse from "./mouse";
import computedProps from "./computed";

export default {
  methods: {
    mixins: [arrowInputs, clearSelection, keyboardInput, mouse, computedProps],
    lastIndex(lineId) {
      let word = this.editorArray[lineId].length - 1;
      let letter = this.editorArray[lineId][word].length;
      return lineId + "-" + word + "-" + letter;
    },
    isLineFocused(index) {
      return index == this.editLocation.line;
    },
    compareLoc(loc, base) {
      // console.log(loc, base);
      if (loc.line < base.line) {
        return "less";
      } else if (loc.line == base.line) {
        if (loc.word < base.word) {
          return "less";
        } else if (loc.word == base.word) {
          if (loc.letter == base.letter) {
            return "equal";
          } else if (loc.letter < base.letter) {
            return "less";
          }
          return "greater";
        }
        return "greater";
      }
      return "greater";
    },
    inRange(line, word, letter) {
      let loc = { line: line, word: word, letter: letter };
      let forward =
        (this.compareLoc(loc, this.selectionLocation.start) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.start) === "greater") &&
        (this.compareLoc(loc, this.selectionLocation.end) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.end) === "less");
      let reverse =
        (this.compareLoc(loc, this.selectionLocation.start) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.start) === "less") &&
        (this.compareLoc(loc, this.selectionLocation.end) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.end) === "greater");
      if (forward || reverse) return true;
      return false;
    },
    selectStart(ev) {
      const divId = ev.target.id;
      if (divId.indexOf("START") > -1) {
        const line = divId.slice(divId.indexOf("-") + 1);
        if (event.detail === 3) {
          this.selectLine(ev, line);
        }
        const word = 0;
        const letter = 0;

        this.updateData(line, word, letter);
      }
    },
    selectEnd(ev) {
      const divId = ev.target.id;
      if (divId.indexOf("END") > -1) {
        const line = divId.slice(divId.indexOf("-") + 1);
        if (event.detail === 3) {
          this.selectLine(ev, line);
        }
        const word = this.editorArray[line].length - 1;
        let letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
      }
    },
  },
  updateData: _.throttle(function _updateData(line, word, letter) {
    const newId = String(line + "-" + word + "-" + letter);

    process.nextTick(() => {
      document.getElementById(newId).focus();
    });

    this.editLocation.line = Number(line);
    this.editLocation.word = Number(word);
    this.editLocation.letter = Number(letter);
    this.target = line;
    const tempArr = this.editorArray;
    this.editorArray = [];
    tempArr.forEach(line => {
      this.editorArray.push(line);
    });
  }, 10),
};
