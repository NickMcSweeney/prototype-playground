"use strict";

export default {
  methods: {
    enterEvent: _.throttle(function _enterEvent() {
      // handle the enter key event

      const specialChar = "\n";
      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      const firstSegment = text[line][word].slice(0, letter);
      const secondSegment = text[line][word].slice(letter);
      const nextLine = parseInt(line) + 1;
      const prevLine = parseInt(line) - 1;

      if (this.predictText && this.isSelectedSuggestion) {
        if (
          (this.possibleLines[this.tabNum] &&
            text[0][0] != " " &&
            text[line][word].length == letter) ||
          text[line][word] == specialChar
        ) {
          this.clearSelection();
          if (this.possibleLinesArray[this.tabNum].length == 1) {
            this.replaceWord(this.possibleLines[this.tabNum]);
          } else {
            this.replaceLine(this.tabNum);
          }
        }
        this.isSelectedSuggestion = false;
      } else {
        if (!this.isMultiLineBreak(text, line, prevLine, nextLine)) {
          if (firstSegment == "" && word == 0) {
            text[line].splice(word, 1, secondSegment);
            text[line].splice(word, 0, "\n");
            letter = 0;
          } else if (firstSegment == "") {
            text[line].splice(word, 1, secondSegment);
            word--;
            letter = 0;
          } else if (firstSegment != "" && secondSegment != "") {
            text[line].splice(word, 1, secondSegment);
            text[line].splice(word, 0, firstSegment);
            letter = 0;
          }
          word++;
          const firstLine =
            text[line].slice(0, word) == "" ? [specialChar] : text[line].slice(0, word);
          const secondLine = text[line].slice(word) == "" ? [specialChar] : text[line].slice(word);
          text.splice(line, 1, firstLine);
          line++;
          word = 0;
          letter = 0;
          text.splice(line, 0, secondLine);
        }
        this.updateData(line, word, letter);
      }
    }, 100),

    isMultiLineBreak(data, loc, prev, next) {
      if (loc == 0 && this.isBreak(loc)) {
        // NOTE: This prevents enter if you are on the first line
        return true;
      } else if (prev > -1) {
        if (this.isBreak(loc)) {
          if (this.isBreak(prev)) {
            return true;
          } else if (next < data.length) {
            if (this.isBreak(next)) {
              return true;
            }
          } else if (next == data.length) {
            return false;
          }
        } else {
          if (this.isBreak(prev)) {
            if (prev - 1 > -1 && this.isBreak(prev - 1)) {
              return true;
            }
          } else if (this.isBreak(next)) {
            if (next + 1 < data.length && this.isBreak(next + 1)) {
              return true;
            }
          }
        }
      } else if (prev == -1 && next < data.length) {
        if (this.isBreak(next)) {
          if (next + 1 < data.length && this.isBreak(next + 1)) {
            return true;
          }
        }
      } else {
        return false;
      }
    },
    isBreak(loc) {
      const data = this.editorArray;
      if (
        _.isEqual(data[loc], [" "]) ||
        _.isEqual(data[loc], ["\n"]) ||
        _.isEqual(data[loc], [""])
      ) {
        return true;
      }
      return false;
    },
  },
};
