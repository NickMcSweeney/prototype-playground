"use strict";

import clearSelection from "./clear-selection";
import helpers from "./helper";
import keyboardInput from "./keyboard-input";
import mouse from "./mouse";
import computedProps from "./computed";

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
    arrowHorizontal(ev, dir) {
      let line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);

      const prev = { line: line, word: word, letter: letter };

      let newWord = 0;
      let newLetter = 0;

      if (dir == "left") newWord = word - 1;
      else if (dir == "right") newWord = word + 1;
      if (dir == "left") newLetter = letter - 1;
      else if (dir == "right") newLetter = letter + 1;

      if (ev.metaKey && dir == "left") {
        // command key + left arrow - move to begining of line
        letter = 0;
        word = 0;
        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("left", prev, "meta");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.metaKey && dir == "right") {
        // command key + right arrow - move to end of line
        word = this.editorArray[line].length - 1;
        letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("right", prev, "meta");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.altKey && dir == "left") {
        // alt key + left arrow - move to begining of word
        if (letter == 0) word--;
        letter = 0;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("left", prev, "alt");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.altKey && dir == "right") {
        // alt key + right arrow - move to end of word
        if (letter == this.editorArray[line][word].length) word++;
        letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("right", prev, "alt");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (dir == "left") {
        if (newLetter > -1) {
          letter = newLetter;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else if (newWord > -1) {
          word = newWord;
          letter = this.editorArray[line][word].length;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else {
          word = 0;
          letter = 0;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        }
      } else if (dir == "right") {
        if (newLetter <= this.editorArray[line][word].length) {
          letter = newLetter;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else if (newWord < this.editorArray[line].length) {
          word = newWord;
          letter = 0;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else {
          word = this.editorArray[line].length - 1;
          letter = this.editorArray[line][word].length;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        }
      }
    },
    selectHorizontal(dir, prev, mod) {
      let line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);
      let tempStr = letter;

      if (dir == "left") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          // left from no selection
          tempStr = (prev.letter - 1).toString();
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: prev.line, word: prev.word, letter: tempStr };
        } else if (
          this.selectionLocation.start.line == this.editLocation.line &&
          this.selectionLocation.start.word == this.editLocation.word &&
          this.selectionLocation.start.letter == this.editLocation.letter
        ) {
          // reset selection
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          (mod == "alt" && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
          (mod == "meta" && this.selectionLocation.start.line == this.selectionLocation.end.line)
        ) {
          // fix switch selection
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (_.isMatch(this.selectionLocation.start, prev)) {
          // left from start
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.end.line == prev.line &&
          this.selectionLocation.end.word == prev.word &&
          this.selectionLocation.end.letter + 1 == prev.letter
        ) {
          // left from end
          this.selectionLocation.end = { line: line, word: word, letter: letter - 1 };
        } else {
          console.log("So this is entirely unhandled");
        }
      } else if (dir == "right") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          // right from no selection
          letter--;
          tempStr = prev.letter.toString();
          this.selectionLocation.start = { line: prev.line, word: prev.word, letter: tempStr };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.end.line == this.editLocation.line &&
          this.selectionLocation.end.word == this.editLocation.word &&
          this.selectionLocation.end.letter == this.editLocation.letter - 1
        ) {
          // reset selection
          letter--;
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          (mod == "alt" && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
          (mod == "meta" && this.selectionLocation.start.line == this.selectionLocation.end.line)
        ) {
          // fix switch selection
          console.log("Going right");
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.start.line == prev.line &&
          this.selectionLocation.start.word == prev.word &&
          this.selectionLocation.start.letter == prev.letter
        ) {
          letter--;
          this.selectionLocation.start = { line: line, word: word, letter: letter + 1 };
        } else if (
          this.selectionLocation.end.line == prev.line &&
          this.selectionLocation.end.word == prev.word &&
          this.selectionLocation.end.letter + 1 == prev.letter
        ) {
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else {
          console.log("So this is entirely unhandled");
        }
        letter++;
      }
      this.updateData(line, word, letter);
    },
  },
};
