

export default {
  methods: {
    mouseOutOfBounds() {
      let focus = this.endOfLastLine;
      let split = focus.indexOf('-');
      const line = focus.slice(0, split);
      focus = focus.slice(split + 1);
      split = focus.indexOf('-');
      const word = focus.slice(0, split);
      const letter = focus.slice(split + 1);

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.target = this.editLocation.line;
    },
    mouseDown(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf('-');
      const line = parseInt(divId.slice(0, split));
      divId = divId.slice(split + 1);
      split = divId.indexOf('-');
      const word = parseInt(divId.slice(0, split));
      const letter = parseInt(divId.slice(split + 1));

      this.selectionLocation.start = { line, word, letter };
      this.selectionLocation.end = { line, word, letter };

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      const theId = String(`${line}-${word}-${letter}`);
      this.selectedId = theId;
      document.getElementsByName('hidden-editor-input')[0].focus();
      // document.getElementById(theId).focus();

      this.letterStartSelectBk = Number(letter);
      this.selecting = true;
    },
    mouseUp(ev) {
      if (this.selecting && !_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
        let divId = ev.target.id;
        let split = divId.indexOf('-');
        const line = parseInt(divId.slice(0, split));
        divId = divId.slice(split + 1);
        split = divId.indexOf('-');
        const word = parseInt(divId.slice(0, split));
        const letter = parseInt(divId.slice(split + 1));
        const location = this.editLocation;
        const prev = _.cloneDeep({
          line: location.line,
          word: location.word,
          letter: location.letter,
        });
        this.updateCursorPosition(line, word, letter);
        this.newSelect(prev);
      }
      this.selecting = false;
    },
    mouseOver: _.throttle(function _mouseOver(ev) {
      if (this.selecting) {
        let divId = ev.target.id;
        let split = divId.indexOf('-');
        const line = parseInt(divId.slice(0, split));
        divId = divId.slice(split + 1);
        split = divId.indexOf('-');
        const word = parseInt(divId.slice(0, split));
        const letter = parseInt(divId.slice(split + 1));

        const location = this.editLocation;
        const prev = _.cloneDeep({
          line: location.line,
          word: location.word,
          letter: location.letter,
        });
        this.updateCursorPosition(line, word, letter);
        this.newSelect(prev);
      }
    }, 25),
  },
};
