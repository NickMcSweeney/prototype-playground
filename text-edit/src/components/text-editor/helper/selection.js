

export default {
  methods: {
    newSelect(prev) {
      const location = this.editLocation;
      const text = this.editorArray;
      let selectionStart = this.selectionLocation.start;
      let selectionEnd = this.selectionLocation.end;
      const line = location.line;
      const word = location.word;
      const letter = parseInt(location.letter);
      const prevLine = prev.line;
      const prevWord = prev.word;
      const prevLetter = parseInt(prev.letter);

      if (line > prevLine) {
        if (_.isEqual(selectionStart, selectionEnd)) {
          // right from no selection
          const tempLetter = (letter - 1).toString();
          selectionStart = { line: prevLine, word: prevWord, letter: prevLetter };
          selectionEnd = { line, word, letter: tempLetter };
        } else if (
          selectionEnd.line > line ||
          (selectionEnd.line == line &&
            (selectionEnd.word > word ||
              (selectionEnd.letter > letter && selectionEnd.word == word)))
        ) {
          // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          const tempNum = parseInt(letter - 1);
          selectionStart = { line, word, letter };
        } else if (
          selectionEnd.line == line &&
          (selectionEnd.word < word || (selectionEnd.letter < letter && selectionEnd.word == word))
        ) {
          const tempStr = (parseInt(letter) - 1).toString();
          const tempNum = parseInt(selectionEnd.letter) + 1;
          selectionStart = {
            line: selectionEnd.line,
            word: selectionEnd.word,
            letter: tempNum,
          };
          selectionEnd = { line, word, letter: tempStr };
        } else {
          // reset selection
          const tempLetter = letter - 1;
          // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempLetter.toString() };
        }
      } else if (line < prevLine) {
        if (_.isEqual(selectionStart, selectionEnd)) {
          const tempStr = (prevLetter - 1).toString();
          selectionStart = { line, word, letter };
          selectionEnd = { line: prevLine, word: prevWord, letter: tempStr };
        } else if (
          selectionStart.line < line ||
          (selectionStart.line == line &&
            (selectionStart.word < word ||
              (selectionStart.letter < letter && selectionStart.word == word)))
        ) {
          const tempStr = (letter - 1).toString();
          const tempNum = parseInt(letter);
          // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempStr };
        } else if (
          selectionStart.line == line &&
          (selectionStart.word > word ||
            (selectionStart.letter > letter && selectionStart.word == word))
        ) {
          const tempStr = letter.toString();
          const tempNum = parseInt(selectionStart.letter);
          selectionEnd = {
            line: selectionStart.line,
            word: selectionStart.word,
            letter: tempNum,
          };
          selectionStart = { line, word, letter: tempStr };
        } else {
          selectionStart = { line, word, letter };
        }
      } else if (word > prevWord) {
        if (_.isEqual(selectionStart, selectionEnd)) {
            // right from no selection
          const tempLetter = (letter - 1).toString();
          selectionStart = { line: prevLine, word: prevWord, letter: prevLetter };
          selectionEnd = { line, word, letter: tempLetter };
        } else if (selectionEnd.word > prevWord || selectionEnd.line > prevLine) {
            // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionStart = { line, word, letter };
        } else {
            // reset selection
          const tempLetter = letter - 1;
            // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempLetter.toString() };
        }
      } else if (word < prevWord) {
        if (_.isEqual(selectionStart, selectionEnd)) {
          const tempStr = (prevLetter - 1).toString();
          selectionStart = { line, word, letter };
          selectionEnd = { line: prevLine, word: prevWord, letter: tempStr };
        } else if (selectionStart.word <= word || selectionStart.line < line) {
          const tempStr = letter.toString();
          const tempNum = parseInt(letter);
            // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempStr };
        } else {
          selectionStart = { line, word, letter };
        }
      } else if (letter > prevLetter) {
        if (_.isEqual(selectionStart, selectionEnd)) {
              // right from no selection
          const tempLetter = (letter - 1).toString();
          selectionStart = { line: prevLine, word: prevWord, letter: prevLetter };
          selectionEnd = { line, word, letter: tempLetter };
        } else if (
              (selectionEnd.letter > prevLetter &&
                (selectionEnd.line == prevLine && selectionEnd.word == prevWord)) ||
              (selectionEnd.line == prevLine && selectionEnd.word > prevWord) ||
              selectionEnd.line > prevLine
            ) {
              // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionStart = { line, word, letter };
        } else {
              // reset selection
          const tempLetter = letter - 1;
              // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempLetter.toString() };
        }
      } else if (letter < prevLetter) {
        if (_.isEqual(selectionStart, selectionEnd)) {
          const tempStr = (prevLetter - 1).toString();
          selectionStart = { line, word, letter };
          selectionEnd = { line: prevLine, word: prevWord, letter: tempStr };
        } else if (
              (selectionStart.letter < letter &&
                selectionStart.line == line &&
                selectionStart.word == word) ||
              (selectionStart.line == line && selectionStart.word < word) ||
              selectionStart.line < line
            ) {
          const tempStr = (letter - 1).toString();
          const tempNum = parseInt(letter);
              // this.selectionLocation.start = { line: line, word: word, letter: tempLetter };
          selectionEnd = { line, word, letter: tempStr };
        } else {
          selectionStart = { line, word, letter };
        }
      } else if (_.isEqual(selectionStart, selectionEnd)) {
              // left from no selection
        const tempStr = prevLetter.toString();
        selectionStart = { line, word, letter };
        selectionEnd = { line: prevLine, word: prevWord, letter: tempStr };
      }
      this.selectionLocation.start = selectionStart;
      this.selectionLocation.end = selectionEnd;
      this.setSelection();
    },

    selectStart(ev) {
      const divId = ev.target.id;
      if (divId.indexOf('START') > -1) {
        const line = divId.slice(divId.indexOf('-') + 1);
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
      if (divId.indexOf('END') > -1) {
        const line = divId.slice(divId.indexOf('-') + 1);
        if (event.detail === 3) {
          this.selectLine(ev, line);
        }
        const word = this.editorArray[line].length - 1;
        const letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
      }
    },
    setSelection() {
      // TODO: fix paste full words, not just selection

      const start = this.selectionLocation.start;
      const end = this.selectionLocation.end;

      const selected = [];
      this.editorArray.forEach((line, index) => {
        if (start.line == end.line && index == start.line) {
          let newLine = [];
          line.forEach((word, i) => {
            if (
              (i >= start.word && i < end.word && index == start.line) ||
              (i > start.word && i <= end.word && index == end.line)
            ) {
              newLine.push(word);
            } else if (
              (i == start.word && i < end.word && index == start.line) ||
              (i > start.word && i == end.word && index == end.line)
            ) {
              newLine.push(word);
            } else if (i == start.word && i == end.word && index == start.line) {
              if (start.letter !== end.letter) {
                let second = word.slice(start.letter);
                second = second.slice(0, end.letter - start.letter + 1);
                newLine.push(second);
              } else {
                newLine = null;
              }
            } else {
            }
          });
          selected.push(newLine);
        } else if (index == start.line) {
          const newLine = [];
          line.forEach((word, i) => {
            if (i > start.word) {
              newLine.push(word);
            } else if (i == start.word) {
              const second = word.slice(start.letter);
              newLine.push(second);
            }
          });
          selected.push(newLine);
        } else if (index == end.line) {
          const newLine = [];
          line.forEach((word, i) => {
            if (i < end.word) {
              newLine.push(word);
            } else if (i == end.word) {
              const second = word.slice(0, end.letter + 1);
              newLine.push(second);
            }
          });
          selected.push(newLine);
        } else if (index > start.line && index < end.line) {
          selected.push(line);
        }
      });
      this.selection = selected;
    },

    // ---------------- //
    selectLeft(prev, mod) {
      const line = parseInt(this.editLocation.line);
      const word = parseInt(this.editLocation.word);
      const letter = parseInt(this.editLocation.letter);
      let tempStr = letter;
      console.log(prev);

      if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
        // left from no selection
        tempStr = (prev.letter - 1).toString();
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line: prev.line, word: prev.word, letter: tempStr };
      } else if (
        this.selectionLocation.start.line == this.editLocation.line &&
        this.selectionLocation.start.word == this.editLocation.word &&
        this.selectionLocation.start.letter == this.editLocation.letter
      ) {
        // reset selection
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      } else if (
        (mod == 'alt' && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
        (mod == 'meta' && this.selectionLocation.start.line == this.selectionLocation.end.line)
      ) {
        // fix switch selection
        this.selectionLocation.start = { line, word, letter };
      } else if (_.isMatch(this.selectionLocation.start, prev)) {
        // left from start
        this.selectionLocation.start = { line, word, letter };
      } else if (
        this.selectionLocation.end.line == prev.line &&
        this.selectionLocation.end.word == prev.word &&
        this.selectionLocation.end.letter + 1 == prev.letter
      ) {
        // left from end
        this.selectionLocation.end = { line, word, letter: letter - 1 };
      } else {
        console.log('So this is entirely unhandled');
      }
      this.updateData(line, word, letter);
    },
    selectRight(prev, mod) {
      if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
        // right from no selection
        letter--;
        tempStr = prev.letter.toString();
        this.selectionLocation.start = { line: prev.line, word: prev.word, letter: tempStr };
        this.selectionLocation.end = { line, word, letter };
      } else if (
        this.selectionLocation.end.line == this.editLocation.line &&
        this.selectionLocation.end.word == this.editLocation.word &&
        this.selectionLocation.end.letter == this.editLocation.letter - 1
      ) {
        // reset selection
        letter--;
        this.selectionLocation.start = { line, word, letter };
        this.selectionLocation.end = { line, word, letter };
      } else if (
        (mod == 'alt' && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
        (mod == 'meta' && this.selectionLocation.start.line == this.selectionLocation.end.line)
      ) {
        // fix switch selection
        console.log('Going right');
        letter--;
        this.selectionLocation.end = { line, word, letter };
      } else if (
        this.selectionLocation.start.line == prev.line &&
        this.selectionLocation.start.word == prev.word &&
        this.selectionLocation.start.letter == prev.letter
      ) {
        letter--;
        this.selectionLocation.start = { line, word, letter: letter + 1 };
      } else if (
        this.selectionLocation.end.line == prev.line &&
        this.selectionLocation.end.word == prev.word &&
        this.selectionLocation.end.letter + 1 == prev.letter
      ) {
        letter--;
        this.selectionLocation.end = { line, word, letter };
      } else {
        console.log('So this is entirely unhandled');
      }
      letter++;
      this.updateData(line, word, letter);
    },
    selectVertical() {},
    selectWord(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf('-');
      const line = divId.slice(0, split);
      divId = divId.slice(split + 1);
      split = divId.indexOf('-');
      const word = divId.slice(0, split);
      let letter = this.editorArray[line][word].length - 1;

      this.selectionLocation.start = { line, word, letter: 0 };
      this.selectionLocation.end = { line, word, letter };
      try {
        letter++;
        this.updateData(line, word, letter);
      } catch (e) {
      } finally {
      }
    },
    selectLine(ev, line) {
      if (ev.detail === 3) {
        const word = this.editorArray[line].length - 1;
        let letter = this.editorArray[line][word].length - 1;

        this.selectionLocation.start = { line, word: 0, letter: 0 };
        this.selectionLocation.end = { line, word, letter };
        try {
          letter++;
          this.updateData(line, word, letter);
        } catch (e) {
        } finally {
        }
      }
    },
  },
};
