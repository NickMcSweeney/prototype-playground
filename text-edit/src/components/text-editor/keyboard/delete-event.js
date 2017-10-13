"use strict";

export default {
  methods: {
    backspaceEvent: _.throttle(function backspaceEvent() {
      // handle the backspace key

      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;

      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (line == 0 && word == 0 && letter == 0) {
        console.log("Already at the begining!!");
        return;
      } else {
        const prevLine = line - 1;
        const prevWord = word - 1;
        const prevLetter = letter - 1;

        if (word == 0 && letter == 0) {
          if (_.isEqual(text[prevLine], ["\n"])) {
            text.splice(prevLine, 1);
            line = prevLine;
            word = 0;
            letter = 0;
          } else if (_.isEqual(text[line], ["\n"])) {
            const wordsInPrevLine = text[prevLine].length;
            const indexLastPrevWord = wordsInPrevLine - 1;
            const indexLastPrevLetter = text[prevLine][indexLastPrevWord].length;
            text.splice(line, 1);
            line = prevLine;
            word = indexLastPrevWord;
            letter = indexLastPrevLetter;
          } else {
            const wordsInPrevLine = text[prevLine].length;
            const indexLastPrevWord = wordsInPrevLine - 1;
            const indexLastPrevLetter = text[prevLine][indexLastPrevWord].length;
            text[line].forEach(word => {
              text[prevLine].push(word);
            });
            text.splice(line, 1);
            line = prevLine;
            word = indexLastPrevWord;
            letter = indexLastPrevLetter;

            const newWord = text[line][word] + text[line][wordsInPrevLine];
            text[line].splice(word, 2, newWord);
          }
        } else if (letter == 0) {
          const prevWordsLastLetter = text[line][prevWord].length;

          const newWord = text[line][prevWord] + text[line][word];
          text[line].splice(prevWord, 2, newWord);
          word = prevWord;
          letter = prevWordsLastLetter;
        } else if (text[line][word][0] == "\n") {
          const wordsInPrevLine = text[prevLine].length;
          const indexLastPrevWord = wordsInPrevLine - 1;
          const indexLastPrevLetter = text[prevLine][indexLastPrevWord].length;
          text.splice(line, 1);
          line = prevLine;
          word = indexLastPrevWord;
          letter = indexLastPrevLetter;
        } else {
          const temp = text[line][word].slice(0, prevLetter) + text[line][word].slice(letter);
          text[line].splice(word, 1, temp);
          letter = prevLetter;
        }
        this.updatePhraseData();
        this.updateData(line, word, letter);
      }
    }, 50),

    deleteEvent: _.throttle(function _deleteEvent() {
      // handle the delete key

      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      const lastLine = text.length - 1;
      const lastWord = text[lastLine].length - 1;
      const lastLetter = text[lastLine][lastWord].length;
      const endWord = text[line].length - 1;
      const endLetter = text[line][endWord].length;
      const wordEndLetter = text[line][word].length;
      const nextLine = parseInt(line) + 1;

      if (line == lastLine && word == lastWord && letter == lastLetter) {
        console.log("Already at the end!!");
        return;
      } else if (_.isEqual(text[line], ["\n"])) {
        text.splice(line, 1);
        word = 0;
        letter = 0;
      } else if (word == endWord && letter == endLetter) {
        if (_.isEqual(text[nextLine], ["\n"])) {
          text.splice(nextLine, 1);
        } else {
          text[nextLine].forEach(word => {
            text[line].push(word);
          });
          text.splice(nextLine, 1);
          let nextWord = parseInt(word) + 1;
          const newWord = text[line][word] + text[line][nextWord];
          text[line].splice(word, 2, newWord);
        }
      } else if (letter == wordEndLetter) {
        let nextWord = parseInt(word) + 1;
        const newWord = text[line][word] + text[line][nextWord];
        text[line].splice(word, 2, newWord);
      } else {
        const newWord = text[line][word].slice(0, letter) + text[line][word].slice(letter + 1);
        text[line].splice(word, 1, newWord);
      }
      this.updatePhraseData();
      this.updateData(line, word, letter);
    }, 50),

    removeChar() {
      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (!_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
        this.selectionLocation.start.letter = parseInt(this.selectionLocation.start.letter);
        this.selectionLocation.end.letter = parseInt(this.selectionLocation.end.letter);
        if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
          let tempLoc = this.selectionLocation.start.letter;
          tempLoc++;
          const second = this.editorArray[line][word].slice(tempLoc);
          tempLoc--;
          let first = this.editorArray[line][word].slice(0, tempLoc);
          let newWord = first + second;
          this.editorArray[line].splice(word, 1, newWord);
        }
        this.clearSelection();
        this.updatePhraseData();
        this.updateData(line, word, letter);
      }
    },

    deleteLineEvent() {
      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (letter == text[line][word].length && word == text[line].length - 1) {
        this.deleteEvent();
      } else {
        const lastSegment = text[line][word].slice(0, letter);
        text[line].splice(word, 1, lastSegment);
        const segments = _.slice(text[line], 0, word + 1);
        text.splice(line, 1, segments);
        this.updateData(line, word, letter);
      }
    },
    deleteWordEvent() {
      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (letter == text[line][word].length && word == text[line].length - 1) {
        this.deleteEvent();
      } else {
        if (text[line][word].length == letter) {
          let temp = text[line][word] + text[line][word + 1];
          text[line].splice(word, 2, temp);
        }

        const lastSegment = text[line][word].slice(0, letter);
        text[line].splice(word, 1, lastSegment);
        this.updateData(line, word, letter);
      }
    },
    backspaceLineEvent() {
      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (letter == 0 && word == 0) {
        this.backspaceEvent();
      } else {
        const lastSegment = text[line][word].slice(letter);
        text[line].splice(word, 1, lastSegment);
        const segments = _.slice(text[line], word);
        text.splice(line, 1, segments);
        letter = 0;
        word = 0;
        this.updateData(line, word, letter);
      }
    },
    backspaceWordEvent() {
      this.removeChar();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (letter == 0 && word == 0) {
        this.backspaceEvent();
      } else {
        if (letter == 0 && word != 0) {
          let temp = text[line][word - 1] + text[line][word];
          word--;
          letter = text[line][word].length;
          text[line].splice(word, 2, temp);
        }

        const lastSegment = text[line][word].slice(letter);
        text[line].splice(word, 1, lastSegment);
        letter = 0;
        this.updateData(line, word, letter);
      }
    },
    //   deleteEvent: _.throttle(function _deleteEvent(ev) {
    //     // handle the backspace key
    //     let focus = document.activeElement.id;
    //     let split = focus.indexOf("-");
    //
    //     let line = focus.slice(0, split);
    //
    //     focus = focus.slice(split + 1);
    //     split = focus.indexOf("-");
    //
    //     let word = focus.slice(0, split);
    //     let letter = focus.slice(split + 1);
    //     if (!_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
    //       this.selectionLocation.start.letter = parseInt(this.selectionLocation.start.letter);
    //       this.selectionLocation.end.letter = parseInt(this.selectionLocation.end.letter);
    //       if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
    //         let tempLoc = this.selectionLocation.start.letter;
    //         tempLoc++;
    //         const second = this.editorArray[line][word].slice(tempLoc);
    //         tempLoc--;
    //         let first = this.editorArray[line][word].slice(0, tempLoc);
    //         let newWord = first + second;
    //         this.editorArray[line].splice(word, 1, newWord);
    //       }
    //       this.clearSelection();
    //       line = this.editLocation.line;
    //       word = this.editLocation.word;
    //       letter = this.editLocation.letter;
    //       this.updateData(line, word, letter);
    //       this.selectionLocation.start = { line: line, word: word, letter: letter };
    //       this.selectionLocation.end = { line: line, word: word, letter: letter };
    //     } else if (ev.code === "Backspace") {
    //       if (line == 0 && word == 0 && letter == 0) {
    //         console.log("Already at the begining!!");
    //         return;
    //       } else if (ev.altKey) {
    //         const wordEndLetter = this.editorArray[line][word].length;
    //         if (letter == 0) {
    //           const prevWord = word - 1;
    //           const tempLetter = this.editorArray[line][prevWord].length;
    //           const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
    //           this.editorArray[line].splice(prevWord, 2, newWord);
    //           word = prevWord;
    //           letter = tempLetter;
    //         } else if (word != 0 && letter == wordEndLetter) {
    //           this.editorArray[line].splice(word, 1);
    //           word--;
    //           letter = this.editorArray[line][word].length;
    //         } else if (word != 0 || letter != 0) {
    //           const tempWord = this.editorArray[line][word].slice(parseInt(letter));
    //           this.editorArray[line].splice(word, 1, tempWord);
    //           letter = 0;
    //         }
    //       } else if (ev.metaKey) {
    //         const lineEndWord = this.editorArray[line].length - 1;
    //         const lineEndLetter = this.editorArray[line][lineEndWord].length;
    //         const wordEndLetter = this.editorArray[line][word].length;
    //         if (word == 0 && letter == 0) {
    //           console.log("can't do that dumb dumb");
    //         } else if (letter == lineEndLetter && word == lineEndWord) {
    //           this.editorArray.splice(line, 1, [" "]);
    //           line;
    //           word = 0;
    //           letter = 1;
    //         } else if (letter == wordEndLetter) {
    //           const tempLine = _.slice(this.editorArray[line], parseInt(word) + 1);
    //           this.editorArray.splice(line, 1, tempLine);
    //           word = 0;
    //           letter = 1;
    //         } else {
    //           const tempWord = this.editorArray[line][word].slice(parseInt(letter));
    //           this.editorArray[line].splice(word, 1, tempWord);
    //           const tempLine = _.slice(this.editorArray[line], word);
    //           this.editorArray.splice(line, 1, tempLine);
    //           word = 0;
    //           letter = 1;
    //         }
    //       } else if (word == 0 && letter == 0) {
    //         const prevLine = line - 1;
    //         let wordsInLine = this.editorArray[prevLine].length;
    //         // wordsInLine++;
    //         if (this.editorArray[prevLine][0][0] != "\n") {
    //           this.editorArray[line].forEach(word => {
    //             this.editorArray[prevLine].push(word);
    //           });
    //           this.editorArray.splice(line, 1);
    //           let prevWord = wordsInLine - 1;
    //           let tempLetter = this.editorArray[prevLine][prevWord].length;
    //           const newWord =
    //             this.editorArray[prevLine][prevWord] + this.editorArray[prevLine][prevWord + 1];
    //           this.editorArray[prevLine].splice(prevWord, 2, newWord);
    //           line = prevLine;
    //           word = prevWord;
    //           letter = tempLetter;
    //         } else {
    //           this.editorArray.splice(prevLine, 1);
    //           line = prevLine;
    //           word = 0;
    //           letter = 0;
    //         }
    //       } else if (letter == 0) {
    //         let prevWord = word - 1;
    //         let tempLetter = this.editorArray[line][prevWord].length;
    //         const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
    //         this.editorArray[line].splice(prevWord, 2, newWord);
    //         word = prevWord;
    //         letter = tempLetter;
    //       } else if (this.editorArray[line][word][0] == "\n") {
    //         const prevLine = line - 1;
    //         let wordsInLine = this.editorArray[prevLine].length - 1;
    //         let lettersInWord = this.editorArray[prevLine][wordsInLine].length;
    //         this.editorArray.splice(line, 1);
    //         line = prevLine;
    //         word = wordsInLine;
    //         letter = lettersInWord;
    //       } else {
    //         const second = this.editorArray[line][word].slice(letter);
    //         letter--;
    //         let first = this.editorArray[line][word].slice(0, letter);
    //         let newWord = first + second;
    //         this.editorArray[line].splice(word, 1, newWord);
    //       }
    //       this.updatePhraseData();
    //       this.updateData(line, word, letter);
    //     } else if (ev.code === "Delete") {
    //       const lastLine = this.editorArray.length - 1;
    //       const lastWord = this.editorArray[lastLine].length - 1;
    //       const lastLetter = this.editorArray[lastLine][lastWord].length;
    //       const endWord = this.editorArray[line].length - 1;
    //       const endLetter = this.editorArray[line][endWord].length;
    //       const wordEndLetter = this.editorArray[line][word].length;
    //
    //       if (line == lastLine && word == lastWord && letter == lastLetter) {
    //         console.log("Already at the end!!");
    //         return;
    //       } else if (ev.altKey) {
    //         const lineEndWord = this.editorArray[line].length - 1;
    //         const lineEndLetter = this.editorArray[line][lineEndWord].length;
    //         const wordEndLetter = this.editorArray[line][word].length;
    //         if (letter == 0) {
    //           this.editorArray[line].splice(word, 1);
    //           letter = 0;
    //         } else if (letter != wordEndLetter) {
    //           const tempWord = this.editorArray[line][word].slice(0, parseInt(letter));
    //           this.editorArray[line].splice(word, 1, tempWord);
    //         } else {
    //           const nextWord = parseInt(word) + 1;
    //           const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
    //           this.editorArray[line].splice(word, 2, newWord);
    //         }
    //       } else if (ev.metaKey) {
    //         const lineEndWord = this.editorArray[line].length - 1;
    //         const lineEndLetter = this.editorArray[line][lineEndWord].length;
    //         const wordEndLetter = this.editorArray[line][word].length;
    //         if (word == lineEndWord && letter == lineEndLetter) {
    //           console.log("can't do that dumb dumb");
    //         } else if (letter == 0 && word == 0) {
    //           this.editorArray.splice(line, 1, [" "]);
    //           line;
    //           word = 0;
    //           letter = 0;
    //         } else if (letter == 0) {
    //           const tempLine = _.slice(this.editorArray[line], 0, parseInt(word));
    //           this.editorArray.splice(line, 1, tempLine);
    //           word--;
    //           letter = this.editorArray[line][word].length;
    //         } else {
    //           const tempWord = this.editorArray[line][word].slice(0, parseInt(letter));
    //           this.editorArray[line].splice(word, 1, tempWord);
    //           const tempLine = _.slice(this.editorArray[line], 0, parseInt(word) + 1);
    //           this.editorArray.splice(line, 1, tempLine);
    //         }
    //       } else if (this.editorArray[line][word][0] == "\n") {
    //         const nextLine = parseInt(line) + 1;
    //         const tempLine = [];
    //         this.editorArray[nextLine].forEach(word => {
    //           tempLine.push(word);
    //         });
    //         word = 0;
    //         letter = 0;
    //         this.editorArray.splice(line, 2, tempLine);
    //       } else if (word == endWord && letter == endLetter) {
    //         const nextLine = parseInt(line) + 1;
    //         if (this.editorArray[nextLine][0][0] == "\n") {
    //           this.editorArray.splice(nextLine, 1);
    //         } else {
    //           this.editorArray[nextLine].forEach(word => {
    //             this.editorArray[line].push(word);
    //           });
    //           this.editorArray.splice(nextLine, 1);
    //           let nextWord = parseInt(word) + 1;
    //           const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
    //           this.editorArray[line].splice(word, 2, newWord);
    //         }
    //       } else if (letter == wordEndLetter) {
    //         let nextWord = parseInt(word) + 1;
    //         const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
    //         this.editorArray[line].splice(word, 2, newWord);
    //       } else {
    //         const first = this.editorArray[line][word].slice(0, letter);
    //         letter++;
    //         const second = this.editorArray[line][word].slice(letter);
    //         const newWord = first + second;
    //         this.editorArray[line].splice(word, 1, newWord);
    //       }
    //       this.updatePhraseData();
    //       this.updateData(line, word, letter);
    //     }
    //
    //     this.selectionLocation.start = { line: line, word: word, letter: letter };
    //     this.selectionLocation.end = { line: line, word: word, letter: letter };
    //   }, 50),
  },
};
