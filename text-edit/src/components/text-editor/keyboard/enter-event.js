"use strict";

export default {
  methods: {
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
  },
};
