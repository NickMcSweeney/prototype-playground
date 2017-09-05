"use strict";

export default {
  methods: {
    arrowVertical(dir, ev) {
      let curLine = this.editLocation.line;
      let curWord = this.editLocation.word;
      let curLetter = this.editLocation.letter;

      if (dir == "up" && curLine == 0) {
        return;
      }

      let nextLine = parseInt(curLine);
      if (dir == "down") {
        nextLine++;
      } else if (dir == "up") {
        nextLine--;
      }
      let nextWord = parseInt(curWord);
      let nextLetter = parseInt(curLetter);

      if (this.editorArray[nextLine]) {
        // calc number if lines in each array
        let currLength = 0;
        let nextLength = 0;
        this.editorArray[curLine].forEach((word, i) => {
          // letters from zero to current location
          if (i > curWord) {
            return;
          } else if (i == curWord) {
            currLength = parseInt(currLength) + parseInt(curLetter);
          } else {
            currLength = parseInt(currLength) + word.length + 1;
          }
        });
        let word = 0;
        let letter = 0;
        try {
          this.editorArray[nextLine].forEach((tempWord, index) => {
            if (currLength == nextLength) {
              word = index;
              throw "done";
            }
            _.split(this.editorArray[nextLine][index], "").forEach((tempLetter, key) => {
              if (currLength == nextLength) {
                word = index;
                letter = key;
                throw "done";
              } else {
                nextLength++;
              }
            });
            if (currLength == nextLength) {
              word = index;
              letter = this.editorArray[nextLine][word].length;
              throw "done";
            }
            nextLength++;
          });
        } catch (e) {
        } finally {
          if (currLength > nextLength && curLetter != 0 && curWord != 0) {
            word = this.editorArray[nextLine].length - 1;
            letter = this.editorArray[nextLine][word].length;
          } else if (this.editorArray[curLine][0][0] == "\n") {
            word = 0;
            letter = 0;
          }
        }

        nextWord = word;
        nextLetter = letter;

        this.updateData(nextLine, nextWord, nextLetter);

        let tempLetter = parseInt(nextLetter);

        if (ev.shiftKey) {
          // select using up and down arrows

          if (dir == "up") {
            // select up
            if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              // if arrow up from no selection
              curLetter--;
              this.selectionLocation.end.letter = curLetter;
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (_.isMatch(this.selectionLocation.start, this.editLocation)) {
              // if reset selection
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - up
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow up from selectionLocation.start
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == curLine) {
              // if arrow up from selectionLocation.end
              if (
                this.compareLoc(this.selectionLocation.start, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "less"
              ) {
                tempLetter--;
                this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
              } else if (
                this.compareLoc(this.selectionLocation.start, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "greater"
              ) {
                this.selectionLocation.start = {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                };
              }
            }
          } else if (dir == "down") {
            // select down
            if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              // if arrow down from no selection
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (
              this.selectionLocation.end.line == this.editLocation.line &&
              this.selectionLocation.end.word == this.editLocation.word &&
              this.selectionLocation.end.letter + 1 == this.editLocation.letter
            ) {
              // if reset selection
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - down
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow down from selectionLocation.start
              if (
                this.compareLoc(this.selectionLocation.end, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "less"
              ) {
                tempLetter--;
                this.selectionLocation.end = {
                  line: nextLine,
                  word: nextWord,
                  letter: tempLetter,
                };
              } else if (
                this.compareLoc(this.selectionLocation.end, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "greater"
              ) {
                this.selectionLocation.start = {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                };
              }
            } else if (this.selectionLocation.end.line == curLine) {
              // if arrow down from selectionLocation.end
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            }
          } else {
            this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
          }
        } else {
          this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
          this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
        }
      } else {
        console.log("CANT");
      }
    },
  },
};
