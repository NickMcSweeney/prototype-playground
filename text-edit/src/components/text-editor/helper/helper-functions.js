

export default {
  data() {
    return {};
  },
  watch: {
    selecting() {
      this.setSelection();
    },
  },
  computed: {},
  methods: {
    idToCoord(id) {
      const line = _.parseInt(id.slice(0, 4));
      const word = _.parseInt(id.slice(4));
      return { line, word };
    },
    phraseObjToArray(obj) {
      const newArr = [];
      obj.forEach((item) => {
        if (item.word !== "\n") newArr.push(item.word);
      });
      return newArr;
    },
    lastIndex(lineId) {
      const word = this.editorArray[lineId].length - 1;
      const letter = this.editorArray[lineId][word].length;
      return `${lineId}-${word}-${letter}`;
    },
    isLineFocused(index) {
      return index == this.editLocation.line;
    },
    scrolling: _.throttle(function _scrolling(ev) {
      console.log("SCROLLING");
      const elm = document.getElementById("edit-container");
      // NOTE: will be child 1 if/when mini-map is brought back
      const childHeight = (elm.children[0].children[0].getBoundingClientRect()).height;
      const height = (elm.clientHeight / childHeight);
      // if (height % 2 !== 0) height--;
      const top = (ev.srcElement.scrollTop / childHeight);
      const bottom = height + top;
      console.log("unround dim", top, bottom, childHeight, height);
      this.bottomVisLine = _.floor(bottom);
      this.topVisLine = _.floor(top);
    }, 30),
    setEditorView: _.throttle(function _setEditorView(index) {
      let lineIndex = index;
      const elm = document.getElementById("edit-container");
      // NOTE: will be child 1 if/when mini-map is brought back
      const childHeight = elm.children[0].children[0].clientHeight;
      let height = _.floor(elm.clientHeight / childHeight);
      const length = this.editorArray.length - 1;
      if (height % 2 !== 0) {
        height--;
        lineIndex++;
      }
      let top = 0;
      let bottom = 0;
      if (lineIndex - (height / 2) > 0) {
        if ((height / 2) + lineIndex < length) {
          top = lineIndex - (height / 2);
          bottom = (height / 2) + lineIndex;
        } else {
          const diff = (height / 2) - (length - lineIndex);
          if ((height / 2) - (lineIndex - diff) >= 0) {
            top = (lineIndex - diff) - (height / 2);
            bottom = length + 1;
          } else {
            top = length - height;
            bottom = length;
          }
        }
      } else {
        top = 0;
        bottom = height;
      }
      this.bottomVisLine = bottom;
      this.topVisLine = top;
    }, 30),
    onScreen(index) {
      const bottom = this.bottomVisLine + 5;
      const top = this.topVisLine - 5;
      if (index >= top && index <= bottom) return true;
      return false;
    },
    isGreater(loc, base) {
      // returns true if first argument is greater, else false
      const baseLineIndex = _.padStart(_.toString(base.line), 4, "0");
      const baseWordIndex = _.padStart(_.toString(base.word), 4, "0");
      const baseLetterIndex = _.padStart(_.toString(base.letter), 4, "0");

      const locLineIndex = _.padStart(_.toString(loc.line), 4, "0");
      const locWordIndex = _.padStart(_.toString(loc.word), 4, "0");
      const locLetterIndex = _.padStart(_.toString(loc.letter), 4, "0");

      const locIndex = locLineIndex + locWordIndex + locLetterIndex;
      const baseIndex = baseLineIndex + baseWordIndex + baseLetterIndex;

      if (_.parseInt(locIndex) > _.parseInt(baseIndex)) {
        return true;
      }
      return false;
    },
    inRange(line, word, letter) {
      const loc = { line, word, letter };
      const forward = (!this.isGreater(this.selectionLocation.start, loc) &&
       !this.isGreater(loc, this.selectionLocation.end));
      const reverse = (!this.isGreater(this.selectionLocation.end, loc) &&
       !this.isGreater(loc, this.selectionLocation.start));
      if (forward || reverse) return true;
      return false;
    },
    updateCursorPosition: _.throttle(function _updateCursorPosition(line, word, letter) {
      const newId = String(`${line}-${word}-${letter}`);

      this.tabNum = 0;
      this.isSelectedSuggestion = false;

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.target = line;

      this.selectedId = newId;
      document.getElementsByName("hidden-editor-input")[0].focus();
      this.setEditorView(line);
      process.nextTick(() => {
        if (document.getElementById(`${this.bottomVisLine}-0-0`)) {
          const element = document.getElementById(`${this.bottomVisLine}-0-0`);
          console.log("bottom - ", this.setBottom, element);
          element.scrollIntoView(false);
        }
      });
    }, 10),
    updateData: _.throttle(function _updateData(line, word, letter) {
      // NOTE: If there starts being performance issues, remove clone deep from the update
      try {
        this.updateCursorPosition(line, word, letter);

        const tempArr = this.editorArray;
        this.editorArray = [];
        tempArr.forEach((seg) => {
          this.editorArray.push((seg));
        });
      } catch (e) {
        console.error(e);
      } finally {
        if (this.phraseBreakType === "Sentence") {
          this.updatePhraseObj();
        } else if (this.phraseBreakType === "Line") {
          this.updatePhraseData();
        }
      }
    }, 10),
    clearSelection() {
      // TODO: REMOVE TRY FROM STATEMENT !!!
      let lineS = 0;
      let wordS = 0;
      let letterS = 0;
      let lineE = 0;
      let wordE = 0;
      let letterE = 0;
      let singleLetter = false;
      let notSelection = false;

      if (this.isGreater(this.selectionLocation.end, this.selectionLocation.start)) {
        lineS = this.selectionLocation.start.line;
        wordS = this.selectionLocation.start.word;
        letterS = this.selectionLocation.start.letter;
        lineE = this.selectionLocation.end.line;
        wordE = this.selectionLocation.end.word;
        letterE = this.selectionLocation.end.letter;
      } else if (this.isGreater(this.selectionLocation.start, this.selectionLocation.end)) {
        lineS = this.selectionLocation.end.line;
        wordS = this.selectionLocation.end.word;
        letterS = this.selectionLocation.end.letter;
        lineE = this.selectionLocation.start.line;
        wordE = this.selectionLocation.start.word;
        letterE = this.selectionLocation.start.letter;
      } else if (!_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
        singleLetter = true;
        lineS = this.selectionLocation.start.line;
        wordS = this.selectionLocation.start.word;
        letterS = Number(this.selectionLocation.start.letter);
        lineE = this.selectionLocation.end.line;
        wordE = this.selectionLocation.end.word;
        letterE = Number(this.selectionLocation.end.letter);
      } else {
        notSelection = true;
      }
      if (!notSelection) {
        if (singleLetter) {
          const before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          const after = this.editorArray[lineE][wordE].slice(letterE);
          letterE--;
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
          console.error("Error - Empty Section. helper-function.js :: 183 (clearSelection())");
        } else if (lineS === lineE && wordS === wordE) {
          const before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          const after = this.editorArray[lineE][wordE].slice(letterE);
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (lineS === lineE) {
          wordE++;
          const before = _.slice(this.editorArray[lineS], 0, wordS);
          const after = _.slice(this.editorArray[lineS], wordE);
          wordE--;
          const middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          const middleEnd = this.editorArray[lineE][wordE].slice(letterE);
          const newWord = middleStart + middleEnd;

          const newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, 1, newline);
        } else {
          const one = this.editorArray[lineS];
          const two = this.editorArray[lineE];

          wordE++;
          const before = _.slice(one, 0, wordS);
          const after = _.slice(two, wordE);
          wordE--;

          const diff = (lineE - lineS) + 1;

          const middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          const middleEnd = this.editorArray[lineE][wordE].slice(letterE);

          const newWord = middleStart + middleEnd;

          const newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, diff, newline);
        }

        letterS++;
        this.selectionLocation.start = { line: lineS, word: wordS, letter: letterS };
        this.selectionLocation.end = { line: lineS, word: wordS, letter: letterS };
        letterS--;
        this.updateData(lineS, wordS, letterS);
      }
    },
  },
};
