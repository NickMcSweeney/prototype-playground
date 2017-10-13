

export default {
  methods: {
    arrowUp(isShift) {
      const location = this.editLocation;
      const line = location.line;
      const word = location.word;
      const letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });
      if (line !== 0) {
        const nextLine = _.parseInt(line) - 1;
        this.verticalArrow(nextLine);
      }
      if (isShift) {
        this.newSelect(prev);
      } else {
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      }
    },
    arrowDown(isShift) {
      const location = this.editLocation;
      const line = location.line;
      const word = location.word;
      const letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });
      const nextLine = _.parseInt(line) + 1;
      this.verticalArrow(nextLine);
      if (isShift) {
        this.newSelect(prev);
      } else {
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      }
    },
    verticalArrow(nextLine) {
      const curLine = this.editLocation.line;
      const curWord = this.editLocation.word;
      const curLetter = this.editLocation.letter;

      let nextWord = _.parseInt(curWord);
      let nextLetter = _.parseInt(curLetter);

      if (this.editorArray[nextLine]) {
        // calc number if lines in each array
        let currLength = 0;
        let nextLength = 0;
        this.editorArray[curLine].forEach((word, i) => {
          // letters from zero to current location
          if (i > curWord) {
            console.error("Error - Empty block :: arow-vertical.js (line: 52)");
          } else if (i == curWord) {
            currLength = _.parseInt(currLength) + _.parseInt(curLetter);
          } else {
            currLength = _.parseInt(currLength) + word.length + 1;
          }
        });
        let word = 0;
        let letter = 0;
        try {
          this.editorArray[nextLine].forEach((tempWord, index) => {
            if (currLength == nextLength) {
              word = index;
              throw String("done");
            }
            _.split(this.editorArray[nextLine][index], "").forEach((tempLetter, key) => {
              if (currLength == nextLength) {
                word = index;
                letter = key;
                throw String("done");
              } else {
                nextLength++;
              }
            });
            if (currLength == nextLength) {
              word = index;
              letter = this.editorArray[nextLine][word].length;
              throw String("done");
            }
            nextLength++;
          });
        } catch (e) {
          console.error("Error - Empty block :: arow-vertical.js (line: 84)");
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

        this.updateCursorPosition(nextLine, nextWord, nextLetter);
      } else {
        console.error("CANT");
      }
    },
    arrowVertical(dir, ev) {
      const curLine = this.editLocation.line;
      const curWord = this.editLocation.word;
      let curLetter = this.editLocation.letter;

      if (dir == "up" && curLine == 0) {
        return;
      }

      let nextLine = _.parseInt(curLine);
      if (dir == "down") {
        nextLine++;
      } else if (dir == "up") {
        nextLine--;
      }
      let nextWord = _.parseInt(curWord);
      let nextLetter = _.parseInt(curLetter);

      if (this.editorArray[nextLine]) {
        // calc number if lines in each array
        let currLength = 0;
        let nextLength = 0;
        this.editorArray[curLine].forEach((word, i) => {
          // letters from zero to current location
          if (i > curWord) {
            console.error("Error - Empty block :: arow-vertical.js (line: 128)");
          } else if (i == curWord) {
            currLength = _.parseInt(currLength) + _.parseInt(curLetter);
          } else {
            currLength = _.parseInt(currLength) + word.length + 1;
          }
        });
        let word = 0;
        let letter = 0;
        try {
          this.editorArray[nextLine].forEach((tempWord, index) => {
            if (currLength == nextLength) {
              word = index;
              throw String("done");
            }
            _.split(this.editorArray[nextLine][index], "").forEach((tempLetter, key) => {
              if (currLength == nextLength) {
                word = index;
                letter = key;
                throw String("done");
              } else {
                nextLength++;
              }
            });
            if (currLength == nextLength) {
              word = index;
              letter = this.editorArray[nextLine][word].length;
              throw String("done");
            }
            nextLength++;
          });
        } catch (e) {
          console.error("Error - Empty block :: arow-vertical.js (line: 128)");
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

        this.updateCursorPosition(nextLine, nextWord, nextLetter);

        let tempLetter = _.parseInt(nextLetter);

        if (ev.shiftKey) {
          // select using up and down arrows

          if (dir == "up") {
            // select up
            if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              // if arrow up from no selection
              curLetter--;
              this.selectionLocation.end.letter = curLetter;
              this.selectionLocation.start = {
                line: nextLine,
                word: nextWord,
                letter: nextLetter,
              };
            } else if (_.isMatch(this.selectionLocation.start, this.editLocation)) {
              // if reset selection
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
              this.selectionLocation.start = {
                line: nextLine,
                word: nextWord,
                letter: nextLetter,
              };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - up
              this.selectionLocation.start = {
                line: nextLine,
                word: nextWord,
                letter: nextLetter,
              };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow up from selectionLocation.start
              this.selectionLocation.start = {
                line: nextLine,
                word: nextWord,
                letter: nextLetter,
              };
            } else if (this.selectionLocation.end.line == curLine) {
              // if arrow up from selectionLocation.end
              if (
                this.isGreater({
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }, this.selectionLocation.start)
              ) {
                tempLetter--;
                this.selectionLocation.end = {
                  line: nextLine,
                  word: nextWord,
                  letter: tempLetter,
                };
              } else if (
                this.isGreater(this.selectionLocation.start, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                })
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
              this.selectionLocation.start = {
                line: nextLine,
                word: nextWord,
                letter: nextLetter,
              };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - down
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow down from selectionLocation.start
              if (
                this.isGreater({
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }, this.selectionLocation.end)
              ) {
                tempLetter--;
                this.selectionLocation.end = {
                  line: nextLine,
                  word: nextWord,
                  letter: tempLetter,
                };
              } else if (
                this.isGreater(this.selectionLocation.end, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                })
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
        console.error("CANT");
      }
    },
  },
};
