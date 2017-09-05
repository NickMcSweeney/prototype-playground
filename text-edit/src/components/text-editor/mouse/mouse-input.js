"use strict";

export default {
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
