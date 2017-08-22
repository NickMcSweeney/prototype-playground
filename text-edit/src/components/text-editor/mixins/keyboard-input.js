"use strict";

import arrowInputs from "./arrow-inputs";
import clearSelection from "./clear-selection";
import helpers from "./helper";
import mouse from "./mouse";
import computedProps from "./computed";

export default {
  mixins: [arrowInputs, clearSelection, helpers, mouse, computedProps],
  methods: {
    logKeyboard: _.throttle(function _logKeyboard(ev) {
      // track keyboard events and display
      // this is the big workhorse function
      this.clearSelection();

      let line = this.editLocation.line;
      let word = this.editLocation.word;
      let letter = this.editLocation.letter;

      if (this.editorArray[line][word].includes("\n")) {
        this.editorArray[line][word] = "";
      } else if (this.editorArray[line][word].includes(" ")) {
        this.editorArray[line][word] = "";
        letter = parseInt(letter);
        letter--;
      }
      let first = this.editorArray[line][word].slice(0, letter);
      const second = this.editorArray[line][word].slice(letter);

      this.editLocation.line = line;
      this.editLocation.word = word;
      this.editLocation.letter = letter;

      // console.log("CODE", ev.code);
      if (ev.code === "Space") {
        // special handling for spacebar
        if (letter != 0) {
          this.editorArray[line].splice(word, 1, second);
          this.editorArray[line].splice(word, 0, first);
          letter = 0;
          word++;
        }
        this.updateData(line, word, letter);
      } else {
        // this is for all 'normal' keys that display letters and symbols

        let newWord = first + ev.key + second;
        this.editorArray[line].splice(word, 1, newWord);
        letter++;
        this.updateData(line, word, letter);
        this.selectionLocation.start = { line: line, word: word, letter: letter };
        this.selectionLocation.end = { line: line, word: word, letter: letter };
      }
    }, 25),
    enterEvent: _.throttle(function _enterEvent(ev) {
      // TODO: Prevent empty lines w/out content (insert unicode symbol)
      // handle the enter key event

      this.clearSelection();

      let focus = document.activeElement.id;
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
      let first = this.editorArray[line][word].slice(0, letter);
      const second = this.editorArray[line][word].slice(letter);
      let specialChar = "\n";
      let nextLine = parseInt(line) + 1;
      let prevLine = parseInt(line) - 1;
      if (
        (this.editorArray[line][word] === "" && word == 0) ||
        (this.editorArray[line][word] == specialChar && word == 0)
      ) {
        if (
          this.editorArray[prevLine] != specialChar &&
          this.editorArray[nextLine] != specialChar &&
          this.editorArray[prevLine] != "" &&
          this.editorArray[nextLine] != ""
        ) {
          this.editorArray[line].splice(word, 1, specialChar);
          line++;
          this.editorArray.splice(line, 0, [""]);
          word = 0;
          letter = 0;
        }
      } else {
        if (letter != 0) {
          this.editorArray[line].splice(word, 1, second);
          this.editorArray[line].splice(word, 0, first);
          letter = 0;
          word++;
        }
        let begining = this.editorArray[line].slice(0, word);
        let end = this.editorArray[line].slice(word);
        try {
          if (begining.length == 0) {
            if (
              _.isMatch(this.editorArray[prevLine], ["\n"]) ||
              this.editorArray[prevLine].length == 0
            ) {
              throw "TOO MANY EMPTY LINES!";
            } else {
              begining = ["\n"];
            }
          } else if (end.length == 0 || end == "") {
            if (this.editorArray[nextLine] == undefined) {
              end = ["\n"];
            } else if (
              _.isMatch(this.editorArray[nextLine], ["\n"]) ||
              this.editorArray[nextLine].length == 0
            ) {
              throw "TOO MANY EMPTY LINES!";
            } else {
              end = ["\n"];
            }
          }
          this.editorArray[line] = begining;
          line++;
          this.editorArray.splice(line, 0, end);
          word = 0;
          letter = 0;
        } catch (e) {
          console.log("there was an error creating a new line, it didn't work", e);
        }
      }
      this.updateData(line, word, letter);
    }, 100),
    deleteEvent: _.throttle(function _deleteEvent(ev) {
      // handle the backspace key
      let focus = document.activeElement.id;
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
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
        line = this.editLocation.line;
        word = this.editLocation.word;
        letter = this.editLocation.letter;
        this.updateData(line, word, letter);
        this.selectionLocation.start = { line: line, word: word, letter: letter };
        this.selectionLocation.end = { line: line, word: word, letter: letter };
      } else if (ev.code === "Backspace") {
        if (line == 0 && word == 0 && letter == 0) {
          console.log("Already at the begining!!");
          return;
        } else if (ev.altKey) {
          const wordEndLetter = this.editorArray[line][word].length;
          if (letter == 0) {
            const prevWord = word - 1;
            const tempLetter = this.editorArray[line][prevWord].length;
            const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
            this.editorArray[line].splice(prevWord, 2, newWord);
            word = prevWord;
            letter = tempLetter;
          } else if (word != 0 && letter == wordEndLetter) {
            this.editorArray[line].splice(word, 1);
            word--;
            letter = this.editorArray[line][word].length;
          } else if (word != 0 || letter != 0) {
            const tempWord = this.editorArray[line][word].slice(parseInt(letter));
            this.editorArray[line].splice(word, 1, tempWord);
            letter = 0;
          }
        } else if (ev.metaKey) {
          const lineEndWord = this.editorArray[line].length - 1;
          const lineEndLetter = this.editorArray[line][lineEndWord].length;
          const wordEndLetter = this.editorArray[line][word].length;
          if (word == 0 && letter == 0) {
            console.log("can't do that dumb dumb");
          } else if (letter == lineEndLetter && word == lineEndWord) {
            this.editorArray.splice(line, 1, [" "]);
            line;
            word = 0;
            letter = 1;
          } else if (letter == wordEndLetter) {
            const tempLine = _.slice(this.editorArray[line], parseInt(word) + 1);
            this.editorArray.splice(line, 1, tempLine);
            word = 0;
            letter = 1;
          } else {
            const tempWord = this.editorArray[line][word].slice(parseInt(letter));
            this.editorArray[line].splice(word, 1, tempWord);
            const tempLine = _.slice(this.editorArray[line], word);
            this.editorArray.splice(line, 1, tempLine);
            word = 0;
            letter = 1;
          }
        } else if (word == 0 && letter == 0) {
          const prevLine = line - 1;
          let wordsInLine = this.editorArray[prevLine].length;
          // wordsInLine++;
          if (this.editorArray[prevLine][0][0] != "\n") {
            this.editorArray[line].forEach(word => {
              this.editorArray[prevLine].push(word);
            });
            this.editorArray.splice(line, 1);
            let prevWord = wordsInLine - 1;
            let tempLetter = this.editorArray[prevLine][prevWord].length;
            const newWord =
              this.editorArray[prevLine][prevWord] + this.editorArray[prevLine][prevWord + 1];
            this.editorArray[prevLine].splice(prevWord, 2, newWord);
            line = prevLine;
            word = prevWord;
            letter = tempLetter;
          } else {
            this.editorArray.splice(prevLine, 1);
            line = prevLine;
            word = 0;
            letter = 0;
          }
        } else if (letter == 0) {
          let prevWord = word - 1;
          let tempLetter = this.editorArray[line][prevWord].length;
          const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
          this.editorArray[line].splice(prevWord, 2, newWord);
          word = prevWord;
          letter = tempLetter;
        } else if (this.editorArray[line][word][0] == "\n") {
          const prevLine = line - 1;
          let wordsInLine = this.editorArray[prevLine].length - 1;
          let lettersInWord = this.editorArray[prevLine][wordsInLine].length;
          this.editorArray.splice(line, 1);
          line = prevLine;
          word = wordsInLine;
          letter = lettersInWord;
        } else {
          const second = this.editorArray[line][word].slice(letter);
          letter--;
          let first = this.editorArray[line][word].slice(0, letter);
          let newWord = first + second;
          this.editorArray[line].splice(word, 1, newWord);
        }
        this.updateData(line, word, letter);
      } else if (ev.code === "Delete") {
        const lastLine = this.editorArray.length - 1;
        const lastWord = this.editorArray[lastLine].length - 1;
        const lastLetter = this.editorArray[lastLine][lastWord].length;
        const endWord = this.editorArray[line].length - 1;
        const endLetter = this.editorArray[line][endWord].length;
        const wordEndLetter = this.editorArray[line][word].length;

        if (line == lastLine && word == lastWord && letter == lastLetter) {
          console.log("Already at the end!!");
          return;
        } else if (ev.altKey) {
          const lineEndWord = this.editorArray[line].length - 1;
          const lineEndLetter = this.editorArray[line][lineEndWord].length;
          const wordEndLetter = this.editorArray[line][word].length;
          if (letter == 0) {
            this.editorArray[line].splice(word, 1);
            letter = 0;
          } else if (letter != wordEndLetter) {
            const tempWord = this.editorArray[line][word].slice(0, parseInt(letter));
            this.editorArray[line].splice(word, 1, tempWord);
          } else {
            const nextWord = parseInt(word) + 1;
            const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
            this.editorArray[line].splice(word, 2, newWord);
          }
        } else if (ev.metaKey) {
          const lineEndWord = this.editorArray[line].length - 1;
          const lineEndLetter = this.editorArray[line][lineEndWord].length;
          const wordEndLetter = this.editorArray[line][word].length;
          if (word == lineEndWord && letter == lineEndLetter) {
            console.log("can't do that dumb dumb");
          } else if (letter == 0 && word == 0) {
            this.editorArray.splice(line, 1, [" "]);
            line;
            word = 0;
            letter = 0;
          } else if (letter == 0) {
            const tempLine = _.slice(this.editorArray[line], 0, parseInt(word));
            this.editorArray.splice(line, 1, tempLine);
            word--;
            letter = this.editorArray[line][word].length;
          } else {
            const tempWord = this.editorArray[line][word].slice(0, parseInt(letter));
            this.editorArray[line].splice(word, 1, tempWord);
            const tempLine = _.slice(this.editorArray[line], 0, parseInt(word) + 1);
            this.editorArray.splice(line, 1, tempLine);
          }
        } else if (this.editorArray[line][word][0] == "\n") {
          const nextLine = parseInt(line) + 1;
          const tempLine = [];
          this.editorArray[nextLine].forEach(word => {
            tempLine.push(word);
          });
          word = 0;
          letter = 0;
          this.editorArray.splice(line, 2, tempLine);
        } else if (word == endWord && letter == endLetter) {
          const nextLine = parseInt(line) + 1;
          if (this.editorArray[nextLine][0][0] == "\n") {
            this.editorArray.splice(nextLine, 1);
          } else {
            this.editorArray[nextLine].forEach(word => {
              this.editorArray[line].push(word);
            });
            this.editorArray.splice(nextLine, 1);
            let nextWord = parseInt(word) + 1;
            const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
            this.editorArray[line].splice(word, 2, newWord);
          }
        } else if (letter == wordEndLetter) {
          let nextWord = parseInt(word) + 1;
          const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
          this.editorArray[line].splice(word, 2, newWord);
        } else {
          const first = this.editorArray[line][word].slice(0, letter);
          letter++;
          const second = this.editorArray[line][word].slice(letter);
          const newWord = first + second;
          this.editorArray[line].splice(word, 1, newWord);
        }
        this.updateData(line, word, letter);
      }

      this.selectionLocation.start = { line: line, word: word, letter: letter };
      this.selectionLocation.end = { line: line, word: word, letter: letter };
    }, 50),
  },
};
