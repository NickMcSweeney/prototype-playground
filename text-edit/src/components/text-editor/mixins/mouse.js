"use strict";

import arrowInputs from "./arrow-inputs";
import clearSelection from "./clear-selection";
import helpers from "./helper";
import keyboardInput from "./keyboard-input";
import computedProps from "./computed";

export default {
  mixins: [arrowInputs, clearSelection, helpers, keyboardInput, computedProps],
  methods: {
    mouseOutOfBounds() {
      this.target = this.endOfLastLine;

      let focus = this.endOfLastLine;
      let split = focus.indexOf("-");
      const line = focus.slice(0, split);
      focus = focus.slice(split + 1);
      split = focus.indexOf("-");
      const word = focus.slice(0, split);
      const letter = focus.slice(split + 1);

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
    },
    logMouse(event, line, index) {
      if (event.detail === 3) {
        this.selectLine(event, index);
      }
      this.target = index;

      let focus = document.activeElement.id;
      let split = focus.indexOf("-");
      focus = focus.slice(split + 1);
      split = focus.indexOf("-");
      const word = focus.slice(0, split);
      const letter = focus.slice(split + 1);

      this.editLocation.line = Number(index);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.displayArray = this.editorArray;
      this.editorArray = [];
      this.displayArray.forEach(phrase => {
        this.editorArray.push(phrase);
      });
    },
    mouseDown(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = parseInt(divId.slice(0, split));
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = parseInt(divId.slice(0, split));
      let letter = parseInt(divId.slice(split + 1));

      this.selectionLocation.start = { line: line, word: word, letter: letter };
      this.selectionLocation.end = { line: line, word: word, letter: letter };

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      const theId = String(line + "-" + word + "-" + letter);
      document.getElementById(theId).focus();

      this.letterStartSelectBk = Number(letter);
      this.selecting = true;
    },
    mouseUp(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = parseInt(divId.slice(0, split));
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = parseInt(divId.slice(0, split));
      let letter = parseInt(divId.slice(split + 1));

      // try {
      //   if (
      //     this.compareLoc(this.selectionLocation.start, {
      //       line: line,
      //       word: word,
      //       letter: letter,
      //     }) == "greater"
      //   ) {
      //     // this.selectionLocation.start.letter--;
      //     this.selectionLocation.end = { line: line, word: word, letter: letter };
      //     // letter--;
      //   } else if (
      //     this.compareLoc(this.selectionLocation.start, {
      //       line: line,
      //       word: word,
      //       letter: letter,
      //     }) == "equal"
      //   ) {
      //     throw "Ignore me";
      //   } else {
      //     letter--;
      //     this.selectionLocation.end = { line: line, word: word, letter: letter };
      //     letter++;
      //   }
      //
      //   this.editLocation.line = Number(line);
      //   this.editLocation.word = Number(word);
      //   this.editLocation.letter = Number(letter);
      //   const theId = String(line + "-" + word + "-" + letter);
      //
      //   document.getElementById(theId).focus();
      // } catch (e) {}

      this.updateData(line, word, letter);
      this.selecting = false;
    },
    mouseOver: _.throttle(function _mouseOver(ev) {
      if (this.selecting) {
        let divId = ev.target.id;
        let split = divId.indexOf("-");
        let line = parseInt(divId.slice(0, split));
        divId = divId.slice(split + 1);
        split = divId.indexOf("-");
        let word = parseInt(divId.slice(0, split));
        let letter = parseInt(divId.slice(split + 1));

        let tempLetter = "";

        const curLocObj = { line: line, word: word, letter: letter };
        const editLocObj = this.editLocation;
        const selStartObj = this.selectionLocation.start;
        const selEndObj = this.selectionLocation.end;

        if (
          this.compareLoc(editLocObj, curLocObj) == "greater" &&
          this.compareLoc(selStartObj, curLocObj) == "greater" &&
          this.compareLoc(selEndObj, curLocObj) == "greater"
        ) {
          if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
            // first letter up
            tempLetter = letter.toString();
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end.letter = tempLetter;
            // } else if (
            //   this.compareLoc(selStartObj, editLocObj) == "less" &&
            //   this.compareLoc(selEndObj, editLocObj) == "less" &&
            //   this.compareLoc(selStartObj, curLocObj) == "greater"
            // ) {
            //   // select flip up
            //   tempLetter = (Number(this.selectionLocation.end.letter) - 1).toString();
            //   this.selectionLocation.end = this.selectionLocation.start;
            //   this.selectionLocation.end.letter = tempLetter;
            //   this.selectionLocation.start = { line: line, word: word, letter: letter };
          } else {
            // select up from selecting up
            this.selectionLocation.start = { line: line, word: word, letter: letter };
          }
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "less" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          (this.compareLoc(selEndObj, curLocObj) == "greater" ||
            this.compareLoc(selEndObj, curLocObj) == "equal")
        ) {
          // select down from selecting up
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "greater" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          (this.compareLoc(selEndObj, curLocObj) == "greater" ||
            this.compareLoc(selEndObj, curLocObj) == "equal")
        ) {
          // select up from selecting down
          letter = parseInt(letter) - 1;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          letter = parseInt(letter) + 1;
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "less" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          this.compareLoc(selEndObj, curLocObj) == "less"
        ) {
          letter = parseInt(letter) - 1;
          if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
            // first letter up
            tempLetter = letter.toString();
            this.selectionLocation.end = { line: line, word: word, letter: letter };
            this.selectionLocation.start.letter = tempLetter;
            // } else if (
            //   // select flip down
            //   this.compareLoc(selStartObj, editLocObj) == "equal" &&
            //   this.compareLoc(selEndObj, editLocObj) == "greater" &&
            //   this.compareLoc(selStartObj, curLocObj) == "less"
            // ) {
            //   tempLetter = (Number(this.selectionLocation.end.letter) + 1).toString();
            //   this.selectionLocation.start = this.selectionLocation.end;
            //   this.selectionLocation.start.letter = tempLetter;
            //   this.selectionLocation.end = { line: line, word: word, letter: letter };
          } else {
            // select down from selecting down
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
          letter = parseInt(letter) + 1;
          // } else if (
          //   !_.isEqual(this.selectionLocation.start, this.selectionLocation.end) &&
          //   this.compareLoc(selStartObj, selEndObj) == "equal"
          // ) {
          //   this.selectionLocation.start = { line: line, word: word, letter: letter };
          //   this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (this.compareLoc(curLocObj, selEndObj) == "greater") {
          this.selectionLocation.start = curLocObj;
        } else if (this.compareLoc(curLocObj, selEndObj) == "less") {
          this.selectionLocation.end = curLocObj;
        } else if (this.compareLoc(curLocObj, selEndObj) == "equal") {
          this.selectionLocation.end = curLocObj;
          this.selectionLocation.start = curLocObj;
        } else {
          console.log("unhandled");
        }

        if (parseInt(this.selectionLocation.end.letter) < 0) {
          this.selectionLocation.end.letter = 0;
        } else if (
          parseInt(this.selectionLocation.end.letter) > this.editorArray[line][word].length
        ) {
          this.selectionLocation.end.letter = this.editorArray[line][word].length;
        } else if (parseInt(this.selectionLocation.start.letter) < 0) {
          this.selectionLocation.start.letter = 0;
        } else if (
          parseInt(this.selectionLocation.start.letter) > this.editorArray[line][word].length
        ) {
          this.selectionLocation.start.letter = this.editorArray[line][word].length;
        }

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);

        document.getElementById(theId).focus();
      }
    }, 25),
    selectWord(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = divId.slice(0, split);
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = divId.slice(0, split);
      let letter = this.editorArray[line][word].length - 1;

      this.selectionLocation.start = { line: line, word: word, letter: 0 };
      this.selectionLocation.end = { line: line, word: word, letter: letter };
      try {
        letter++;
        this.updateData(line, word, letter);
      } catch (e) {}
    },
    selectLine(ev, line) {
      if (ev.detail === 3) {
        let word = this.editorArray[line].length - 1;
        let letter = this.editorArray[line][word].length - 1;

        this.selectionLocation.start = { line: line, word: 0, letter: 0 };
        this.selectionLocation.end = { line: line, word: word, letter: letter };
        try {
          letter++;
          this.updateData(line, word, letter);
        } catch (e) {}
      }
    },
  },
};
