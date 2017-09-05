"use strict";

export default {
  methods: {
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
    clearSelection() {
      // TODO: REMOVE TRY FROM STATEMENT !!!
      let lineS = 0;
      let wordS = 0;
      let letterS = 0;
      let lineE = 0;
      let wordE = 0;
      let letterE = 0;
      let singleLetter = false;
      let notSelection = false;

      if (this.compareLoc(this.selectionLocation.start, this.selectionLocation.end) === "less") {
        lineS = this.selectionLocation.start.line;
        wordS = this.selectionLocation.start.word;
        letterS = this.selectionLocation.start.letter;
        lineE = this.selectionLocation.end.line;
        wordE = this.selectionLocation.end.word;
        letterE = this.selectionLocation.end.letter;
      } else if (
        this.compareLoc(this.selectionLocation.end, this.selectionLocation.start) === "less"
      ) {
        lineS = this.selectionLocation.end.line;
        wordS = this.selectionLocation.end.word;
        letterS = this.selectionLocation.end.letter;
        lineE = this.selectionLocation.start.line;
        wordE = this.selectionLocation.start.word;
        letterE = this.selectionLocation.start.letter;
      } else if (
        this.compareLoc(this.selectionLocation.end, this.selectionLocation.start) === "equal" &&
        !_.isMatch(this.selectionLocation.start, this.selectionLocation.end)
      ) {
        singleLetter = true;
        lineS = this.selectionLocation.start.line;
        wordS = this.selectionLocation.start.word;
        letterS = Number(this.selectionLocation.start.letter);
        lineE = this.selectionLocation.end.line;
        wordE = this.selectionLocation.end.word;
        letterE = Number(this.selectionLocation.end.letter);
      } else {
        notSelection = true;
      }
      if (!notSelection) {
        if (singleLetter) {
          let before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let after = this.editorArray[lineE][wordE].slice(letterE);
          letterE--;
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
        } else if (lineS === lineE && wordS === wordE) {
          let before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let after = this.editorArray[lineE][wordE].slice(letterE);
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (lineS === lineE) {
          wordE++;
          let before = _.slice(this.editorArray[lineS], 0, wordS);
          let after = _.slice(this.editorArray[lineS], wordE);
          wordE--;
          let middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let middleEnd = this.editorArray[lineE][wordE].slice(letterE);
          let newWord = middleStart + middleEnd;

          let newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, 1, newline);
        } else {
          let one = this.editorArray[lineS];
          let two = this.editorArray[lineE];

          wordE++;
          let before = _.slice(one, 0, wordS);
          let after = _.slice(two, wordE);
          wordE--;

          let diff = lineE - lineS + 1;

          let middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let middleEnd = this.editorArray[lineE][wordE].slice(letterE);

          let newWord = middleStart + middleEnd;

          let newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, diff, newline);
        }

        letterS++;
        this.selectionLocation.start = { line: lineS, word: wordS, letter: letterS };
        this.selectionLocation.end = { line: lineS, word: wordS, letter: letterS };
        letterS--;
        this.updateData(lineS, wordS, letterS);
      }
    },
  },
};
