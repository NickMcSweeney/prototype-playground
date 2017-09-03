"use strict";

export default {
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
};
