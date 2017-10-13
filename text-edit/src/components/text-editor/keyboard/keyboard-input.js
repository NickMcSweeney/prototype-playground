

export default {
  methods: {
    logKeyboard: _.throttle(function _logKeyboard(char) {
      // track keyboard events and display
      // this is the big workhorse function
      this.clearSelection();

      const location = this.editLocation;
      const text = this.editorArray;
      let line = location.line;
      let word = location.word;
      let letter = location.letter;

      if (this.withinMaxLength(text, line, char)) {
        line++;
        word = 0;
        letter = 0;
      }

      const trimmedLine = this.trimSpecialChar(text, { line, word, letter });
      text.splice(line, 1, trimmedLine[0]);
      letter = trimmedLine[1];

      const firstSegment = text[line][word].slice(0, letter);
      const secondSegment = text[line][word].slice(letter);

      if (char === " ") {
        // special handling for spacebar
        if (letter !== 0) {
          text[line].splice(word, 1, secondSegment);
          text[line].splice(word, 0, firstSegment);
          letter = 0;
          word++;
        }
      } else {
        // this is for all 'normal' keys that display letters and symbols
        const newWord = firstSegment + char + secondSegment;
        text[line].splice(word, 1, newWord);
        letter++;
      }
      this.updateData(line, word, letter);
    }, 25),

    withinMaxLength(data, loc, char) {
      let charLength = 0;
      data[loc].forEach((word) => {
        charLength = charLength + word.length + 1;
      });
      if (charLength > this.maxLineLength && char === " ") {
        this.breakLine(data, loc);
        return true;
      } else if (charLength > this.maxLineLength + 8) {
        this.breakLine(data, loc);
        return true;
      }
      return false;
    },

    breakLine(data, loc) {
      data.splice(loc + 1, 0, ["\n"]);
    },

    trimSpecialChar(data, loc) {
      const lineBreak = data[loc.line][loc.word].indexOf("\n");
      const emptySpace = data[loc.line][loc.word].indexOf(" ");
      const curLine = data[loc.line];
      const trimWord = data[loc.line][loc.word];
      let locLetter = loc.letter;
      if (lineBreak !== -1) {
        curLine.splice(loc.word, 1, _.trim(trimWord, "\n"));
        locLetter = locLetter < 2 ? 0 : locLetter - 1;
      }
      if (emptySpace !== -1) {
        curLine.splice(loc.word, 1, _.trim(trimWord));
        locLetter = locLetter < 2 ? 0 : locLetter - 1;
      }
      return [curLine, locLetter];
    },
  },
};
