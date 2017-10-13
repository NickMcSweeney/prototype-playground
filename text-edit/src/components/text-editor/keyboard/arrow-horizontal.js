

export default {
  methods: {
    arrowLeft(isShift) {
      const location = this.editLocation;
      const text = this.editorArray;

      let line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });
      const newWordLoc = word - 1;
      const newLetterLoc = letter - 1;

      if (line == 0 && word == 0 && letter == 0) {
        console.log('At the begining');
      } else if (newWordLoc == -1 && newLetterLoc == -1) {
        line--;
        word = text[line].length - 1;
        letter = text[line][word].length;
      } else if (newLetterLoc > -1) {
        letter = newLetterLoc;
        // TODO: add left selection function
        // if (isShift) {
        //   this.selectLeft(prev);
        // } else {
        //   this.selectionLocation.start = { line: line, word: word, letter: letter };
        //   this.selectionLocation.end = { line: line, word: word, letter: letter };
        // }
      } else if (newWordLoc > -1) {
        word = newWordLoc;
        letter = text[line][word].length;
        // TODO: add left selection function
        // if (isShift) {
        //   this.selectLeft(prev);
        // } else {
        //   this.selectionLocation.start = { line: line, word: word, letter: letter };
        //   this.selectionLocation.end = { line: line, word: word, letter: letter };
        // }
      } else {
        word = 0;
        letter = 0;
        // TODO: add left selection function
        // if (isShift) {
        //   this.selectLeft(prev);
        // } else {
        //   this.selectionLocation.start = { line: line, word: word, letter: letter };
        //   this.selectionLocation.end = { line: line, word: word, letter: letter };
        // }
      }
      this.updateCursorPosition(line, word, letter);
      if (isShift) {
        this.newSelect(prev);
      } else {
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      }
    },
    wordLeft(isShift) {
      // alt key + left arrow - move to begining of word
      const location = this.editLocation;
      const text = this.editorArray;

      const line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });

      if (letter == 0 && word == 0) {
        this.arrowLeft();
      } else {
        if (letter == 0) word--;
        letter = 0;

        this.updateCursorPosition(line, word, letter);
        if (isShift) {
          this.newSelect(prev);
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      }
    },
    lineLeft(isShift) {
      const location = this.editLocation;
      const text = this.editorArray;

      const line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = { line, word, letter };

      if (letter == 0 && word == 0) {
        this.arrowLeft();
      } else {
        letter = 0;
        word = 0;

        this.updateCursorPosition(line, word, letter);
        if (isShift) {
          this.newSelect(prev);
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      }
    },

    arrowRight(isShift) {
      const location = this.editLocation;
      const text = this.editorArray;

      let line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });
      const lastLine = text.length - 1;
      const lastWord = text[lastLine].length - 1;
      const lastLetter = text[lastLine][lastWord].length;

      const newWordLoc = word + 1;
      const newLetterLoc = letter + 1;

      if (line == lastLine && word == lastWord && letter == lastLetter) {
        console.log('At the end');
      } else if (newLetterLoc <= text[line][word].length) {
        letter = newLetterLoc;

        // this.updateData(line, word, letter);
        // TODO: add left selection function
      } else if (newWordLoc < text[line].length) {
        word = newWordLoc;
        letter = 0;

        // this.updateData(line, word, letter);
        // TODO: add left selection function
      } else {
        line++;
        word = 0;
        letter = 0;

        // TODO: add left selection function
      }
      this.updateCursorPosition(line, word, letter);
      if (isShift) {
        this.newSelect(prev);
      } else {
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      }
    },
    wordRight(isShift) {
      // alt key + right arrow - move to end of word
      const location = this.editLocation;
      const text = this.editorArray;

      const line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });

      if (letter == text[line][word].length && word == text[line].length - 1) {
        this.arrowRight();
      } else {
        if (letter == text[line][word].length) word++;
        letter = text[line][word].length;

        this.updateCursorPosition(line, word, letter);
        if (isShift) {
          this.newSelect(prev);
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      }
    },
    lineRight(isShift) {
      const location = this.editLocation;
      const text = this.editorArray;

      const line = location.line;
      let word = location.word;
      let letter = location.letter;
      const prev = _.cloneDeep({ line, word, letter });

      if (letter == text[line][word].length && word == text[line].length - 1) {
        this.arrowRight();
      } else {
        word = text[line].length - 1;
        letter = text[line][word].length;

        this.updateCursorPosition(line, word, letter);
        if (isShift) {
          this.newSelect(prev);
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      }
    },

    arrowHorizontal(ev, dir) {
      const line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);

      const prev = { line, word, letter };

      let newWord = 0;
      let newLetter = 0;

      if (dir == 'left') newWord = word - 1;
      else if (dir == 'right') newWord = word + 1;
      if (dir == 'left') newLetter = letter - 1;
      else if (dir == 'right') newLetter = letter + 1;

      if (ev.metaKey && dir == 'left') {
        // command key + left arrow - move to begining of line
        letter = 0;
        word = 0;
        this.updateCursorPosition(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal('left', prev, 'meta');
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      } else if (ev.metaKey && dir == 'right') {
        // command key + right arrow - move to end of line
        word = this.editorArray[line].length - 1;
        letter = this.editorArray[line][word].length;

        this.updateCursorPosition(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal('right', prev, 'meta');
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      } else if (ev.altKey && dir == 'left') {
        // alt key + left arrow - move to begining of word
        if (letter == 0) word--;
        letter = 0;

        this.updateCursorPosition(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal('left', prev, 'alt');
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      } else if (ev.altKey && dir == 'right') {
        // alt key + right arrow - move to end of word
        if (letter == this.editorArray[line][word].length) word++;
        letter = this.editorArray[line][word].length;

        this.updateCursorPosition(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal('right', prev, 'alt');
        } else {
          this.selectionLocation.start = { line, word, letter };
          this.selectionLocation.end = { line, word, letter };
        }
      } else if (dir == 'left') {
        if (newLetter > -1) {
          letter = newLetter;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('left', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        } else if (newWord > -1) {
          word = newWord;
          letter = this.editorArray[line][word].length;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('left', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        } else {
          word = 0;
          letter = 0;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('left', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        }
      } else if (dir == 'right') {
        if (newLetter <= this.editorArray[line][word].length) {
          letter = newLetter;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('right', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        } else if (newWord < this.editorArray[line].length) {
          word = newWord;
          letter = 0;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('right', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        } else {
          word = this.editorArray[line].length - 1;
          letter = this.editorArray[line][word].length;

          this.updateCursorPosition(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal('right', prev, null);
          } else {
            this.selectionLocation.start = { line, word, letter };
            this.selectionLocation.end = { line, word, letter };
          }
        }
      }
    },
  },
};
