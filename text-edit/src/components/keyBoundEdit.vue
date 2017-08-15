<template>
  <div class="editor">
        <div
          class="edit-content"
        >
        <!-- loop through line -->
          <div
            class="display-line"
            v-for="(line, lineIndex) in editorArray"
            @click="logMouse($event,line,lineIndex)"
            :class="{'focused-line': isLineFocused(lineIndex)}"
          >
          <div
            class="display-letter front-spacer"
            :id="'START-'+lineIndex"
            @click.stop.prevent="selectStart"
            @mousedown.stop.prevent="mouseDown(ev = {target:{id:
    lineIndex +'-0-0'}})"
            @mouseup.stop.prevent="mouseUp(ev = {target:{id:
    lineIndex +'-0-0'}})"
          >
            {{ ' ' }}
          </div>
          <!-- loop through word -->
            <div
              v-for="(word, index) in line"
              class="display-word"
              @click="selectLine($event, lineIndex)"
              v-on:dblclick="selectWord"
              >
              <!-- loop through letters -->
              <div
                v-for="(letter, key) in word"
                class="display-letter"
                :class="{'first-word-of-line': index == 0 && key == 0, 'selected-letter': inRange(lineIndex, index, key) && singleSelection, 'empty-paragraph': letter == '\n'}"
                :tabindex="lineIndex"
                :id="lineIndex+'-'+index+'-'+key"
                @keypress.prevent.stop="logKeyboard"
                @keydown.delete.prevent.stop="deleteEvent"
                @keydown.enter.prevent.stop="enterEvent"
                @keydown.down="arrowVertical('down', $event)"
                @keydown.up="arrowVertical('up', $event)"
                @keydown.left.meta.stop.prevent="arrowHorizontal('start', $event)"
                @keydown.right.meta.stop.prevent="arrowHorizontal('end', $event)"
                @keydown.left.alt.stop.prevent="arrowHorizontal('prev', $event)"
                @keydown.right.alt.stop.prevent="arrowHorizontal('next', $event)"
                @keydown.left.stop.prevent="arrowHorizontal('left', $event)"
                @keydown.right.stop.prevent="arrowHorizontal('right', $event)"
                @keydown.left.shift.stop.prevent="arrowHorizontal('overL', $event)"
                @keydown.right.shift.stop.prevent="arrowHorizontal('overR', $event)"
                @mousedown.prevent="mouseDown"
                @mouseup.prevent="mouseUp"
                @mouseover="mouseOver"
              >
                {{ letter }}
              </div>
              <!-- this is an  empty space at the end of the loop to make selection easier -->
              <div
                class="end-space"
                :tabindex="lineIndex"
                :id="lineIndex+'-'+index+'-'+(word.length)"
                :class="{'selected-letter': inRange(lineIndex, index, word.length) && singleSelection, 'empty-paragraph': word[0] == '\n'}"
                @keypress.prevent.stop="logKeyboard"
                @keydown.delete.prevent.stop="deleteEvent"
                @keydown.enter.prevent.stop="enterEvent"
                @keydown.down="arrowVertical('down', $event)"
                @keydown.up="arrowVertical('up', $event)"
                @keydown.left.meta.stop.prevent="arrowHorizontal('start', $event)"
                @keydown.right.meta.stop.prevent="arrowHorizontal('end', $event)"
                @keydown.left.alt.stop.prevent="arrowHorizontal('prev', $event)"
                @keydown.right.alt.stop.prevent="arrowHorizontal('next', $event)"
                @keydown.left.stop.prevent="arrowHorizontal('left', $event)"
                @keydown.right.stop.prevent="arrowHorizontal('right', $event)"
                @keydown.left.shift.stop.prevent="arrowHorizontal('overL', $event)"
                @keydown.right.shift.stop.prevent="arrowHorizontal('overR', $event)"
                @mousedown.prevent="mouseDown"
                @mouseup.prevent="mouseUp"
                @mouseover="mouseOver"
              >
                {{ '' }}
              </div>
            </div>
            <div
              class="display-letter spacer"
              :id="'END-'+lineIndex"
              @click.stop.prevent="selectEnd"
              @mousedown.stop.prevent="mouseDown(ev = {target:{id:
      lastIndex(lineIndex)}})"
              @mouseup.stop.prevent="mouseUp(ev = {target:{id:
      lastIndex(lineIndex)}})"
            >
              {{ ' ' }}
            </div>
          </div>
        </div>
      </div>
</template>

<script>
const _ = require("lodash");

export default {
  name: "keyBoundEdit",
  data() {
    return {
      editMe: -1,
      editorArray: [[" "]],
      displayArray: [],
      target: 0,
      editLocation: { line: 0, word: 0, letter: 0 },
      currSuggestion: 0,
      selection: [],
      selecting: false,
      selectionLocation: {
        start: { line: 0, word: 0, letter: 0 },
        end: { line: 0, word: 0, letter: 0 },
      },
      letterStartSelectBk: Number(),
      temp: "",
    };
  },
  watch: {
    targetLocation(newStuff) {
      this.temp = newStuff;
      _.debounce(() => {
        document.getElementById(newStuff).focus();
      }, 50);
    },
  },
  computed: {
    currentWord() {
      //  tracks current word being edited
      let word = this.editorArray[this.editLocation.line][this.editLocation.word];
      if (word == undefined) {
      } else if (word.indexOf(" ") > -1) {
        return word.trim();
      } else if (word !== " ") {
        return word;
      }
    },
    currentLine() {
      // tracks content of current line being edited
      return this.editorArray[this.editLocation.line];
    },
    singleSelection() {
      if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
        return false;
      } else {
        return true;
      }
    },
    targetLocation() {
      const line = this.editLocation.line;
      const word = this.editLocation.word;
      const letter = this.editLocation.letter;
      return line + "-" + word + "-" + letter;
    },
  },
  methods: {
    lastIndex(lineId) {
      let word = this.editorArray[lineId].length - 1;
      let letter = this.editorArray[lineId][word].length;
      return lineId + "-" + word + "-" + letter;
    },
    isLineFocused(index) {
      return index == this.editLocation.line;
    },
    logMouse(event, line, index) {
      if (event.detail === 3) {
        this.selectLine(event, index);
      }
      this.target = index;

      let focus = document.activeElement.id;
      let split = focus.indexOf("-");
      focus = focus.slice(split + 1);
      split = focus.indexOf("-");
      const word = focus.slice(0, split);
      const letter = focus.slice(split + 1);

      this.editLocation.line = Number(index);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.displayArray = this.editorArray;
      this.editorArray = [];
      this.displayArray.forEach(phrase => {
        this.editorArray.push(phrase);
      });
    },
    mouseDown(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = divId.slice(0, split);
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = divId.slice(0, split);
      let letter = divId.slice(split + 1);

      this.selectionLocation.start = { line: line, word: word, letter: letter };
      this.selectionLocation.end = { line: line, word: word, letter: letter };
      try {
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);
        document.getElementById(theId).focus();
      } catch (e) {}
      this.letterStartSelectBk = Number(letter);
      this.selecting = true;
    },
    mouseUp(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = divId.slice(0, split);
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = divId.slice(0, split);
      let letter = divId.slice(split + 1);
      try {
        if (
          this.compareLoc(this.selectionLocation.start, {
            line: line,
            word: word,
            letter: letter,
          }) == "greater"
        ) {
          // this.selectionLocation.start.letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          // letter--;
        } else if (
          this.compareLoc(this.selectionLocation.start, {
            line: line,
            word: word,
            letter: letter,
          }) == "equal"
        ) {
          throw "Ignore me";
        } else {
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          letter++;
        }

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);

        document.getElementById(theId).focus();
      } catch (e) {}
      this.selecting = false;
    },
    mouseOver(ev) {
      if (this.selecting) {
        let divId = ev.target.id;
        let split = divId.indexOf("-");
        let line = divId.slice(0, split);
        divId = divId.slice(split + 1);
        split = divId.indexOf("-");
        let word = divId.slice(0, split);
        let letter = divId.slice(split + 1);

        if (
          this.compareLoc(this.selectionLocation.start, {
            line: line,
            word: word,
            letter: letter,
          }) == "greater"
        ) {
          this.selectionLocation.start.letter = this.letterStartSelectBk - 1;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          // letter--;
        } else {
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          letter++;
        }
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);

        document.getElementById(theId).focus();
      }
    },
    selectWord(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = divId.slice(0, split);
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = divId.slice(0, split);
      let letter = this.editorArray[line][word].length - 1;

      this.selectionLocation.start = { line: line, word: word, letter: 0 };
      this.selectionLocation.end = { line: line, word: word, letter: letter };
      try {
        letter++;
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);

        document.getElementById(theId).focus();
      } catch (e) {}
    },
    selectLine(ev, line) {
      if (ev.detail === 3) {
        let word = this.editorArray[line].length - 1;
        let letter = this.editorArray[line][word].length - 1;

        this.selectionLocation.start = { line: line, word: 0, letter: 0 };
        this.selectionLocation.end = { line: line, word: word, letter: letter };
        try {
          letter++;
          this.editLocation.line = Number(line);
          this.editLocation.word = Number(word);
          this.editLocation.letter = Number(letter);
          const theId = String(line + "-" + word + "-" + letter);

          document.getElementById(theId).focus();
        } catch (e) {}
      }
    },
    compareLoc(loc, base) {
      // console.log(loc, base);
      if (loc.line < base.line) {
        return "less";
      } else if (loc.line == base.line) {
        if (loc.word < base.word) {
          return "less";
        } else if (loc.word == base.word) {
          if (loc.letter == base.letter) {
            return "equal";
          } else if (loc.letter < base.letter) {
            return "less";
          }
          return "greater";
        }
        return "greater";
      }
      return "greater";
    },
    inRange(line, word, letter) {
      let loc = { line: line, word: word, letter: letter };
      let forward =
        (this.compareLoc(loc, this.selectionLocation.start) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.start) === "greater") &&
        (this.compareLoc(loc, this.selectionLocation.end) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.end) === "less");
      let reverse =
        (this.compareLoc(loc, this.selectionLocation.start) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.start) === "less") &&
        (this.compareLoc(loc, this.selectionLocation.end) === "equal" ||
          this.compareLoc(loc, this.selectionLocation.end) === "greater");
      if (forward || reverse) return true;
      return false;
    },
    selectStart(ev) {
      const divId = ev.target.id;
      if (divId.indexOf("START") > -1) {
        const line = divId.slice(divId.indexOf("-") + 1);
        if (event.detail === 3) {
          this.selectLine(ev, line);
        }
        const word = 0;
        const letter = 0;

        const activeLineEnd = String(line + "-" + word + "-" + letter);

        process.nextTick(() => {
          document.getElementById(activeLineEnd).focus();
        });

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      }
    },
    selectEnd(ev) {
      const divId = ev.target.id;
      if (divId.indexOf("END") > -1) {
        const line = divId.slice(divId.indexOf("-") + 1);
        if (event.detail === 3) {
          this.selectLine(ev, line);
        }
        const word = this.editorArray[line].length - 1;
        let letter = this.editorArray[line][word].length;

        const activeLineEnd = String(line + "-" + word + "-" + letter);

        process.nextTick(() => {
          document.getElementById(activeLineEnd).focus();
        });

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      }
    },
    selectHorizontal(dir) {
      let line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);

      if (dir == "left") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          let tempStr = letter.toString();
          this.selectionLocation.end = { line: line, word: word, letter: tempStr };
        } else if (
          this.selectionLocation.start.letter != letter ||
          this.selectionLocation.start.word != word ||
          this.selectionLocation.start.line != line
        ) {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else {
          console.log("So this is entirely unhandled");
        }
      } else if (dir == "right") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          letter--;
          let tempStr = letter.toString();
          this.selectionLocation.start = { line: line, word: word, letter: tempStr };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          // letter++;
        } else if (
          this.selectionLocation.start.letter != letter ||
          this.selectionLocation.start.word != word ||
          this.selectionLocation.start.line != line
        ) {
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else {
          console.log("So this is entirely unhandled");
        }
        letter++;
      }
      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.displayArray = this.editorArray;
      this.editorArray = [];
      this.displayArray.forEach(line => {
        this.editorArray.push(line);
      });
      const theId = String(line + "-" + word + "-" + letter);
      document.getElementById(theId).focus();
    },
    clearSelection() {
      try {
        let lineS = 0;
        let wordS = 0;
        let letterS = 0;
        let lineE = 0;
        let wordE = 0;
        let letterE = 0;

        if (this.compareLoc(this.selectionLocation.start, this.selectionLocation.end) === "less") {
          lineS = this.selectionLocation.start.line;
          wordS = this.selectionLocation.start.word;
          letterS = this.selectionLocation.start.letter;
          lineE = this.selectionLocation.end.line;
          wordE = this.selectionLocation.end.word;
          letterE = this.selectionLocation.end.letter;
        } else if (
          this.compareLoc(this.selectionLocation.end, this.selectionLocation.start) === "less"
        ) {
          lineS = this.selectionLocation.end.line;
          wordS = this.selectionLocation.end.word;
          letterS = this.selectionLocation.end.letter;
          lineE = this.selectionLocation.start.line;
          wordE = this.selectionLocation.start.word;
          letterE = this.selectionLocation.start.letter;
        } else {
          throw e;
        }
        if (lineS == lineE && wordS == wordE && letterS == letterE) {
          throw "NORMAL Line";
        } else if (lineS == lineE && wordS == wordE) {
          let before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let after = this.editorArray[lineE][wordE].slice(letterE);
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (lineS == lineE) {
          wordE++;
          let before = _.slice(this.editorArray[lineS], 0, wordS);
          let after = _.slice(this.editorArray[lineS], wordE);
          wordE--;
          let middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let middleEnd = this.editorArray[lineE][wordE].slice(letterE);
          let newWord = middleStart + middleEnd;

          let newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, 1, newline);
        } else {
          let one = this.editorArray[lineS];
          let two = this.editorArray[lineE];

          wordE++;
          let before = _.slice(one, 0, wordS);
          let after = _.slice(two, wordE);
          wordE--;

          let diff = lineE - lineS + 1;

          let middleStart = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let middleEnd = this.editorArray[lineE][wordE].slice(letterE);

          let newWord = middleStart + middleEnd;

          let newline = _.concat(before, newWord, after);
          this.editorArray.splice(lineS, diff, newline);
        }

        letterS++;
        this.selectionLocation.start = { line: lineS, word: wordS, letter: letterS };
        this.selectionLocation.end = { line: lineS, word: wordS, letter: letterS };
        letterS--;
        this.editLocation.line = Number(lineS);
        this.editLocation.word = Number(wordS);
        this.editLocation.letter = Number(letterS);
        const theId = String(lineS + "-" + wordS + "-" + letterS);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
      } catch (e) {}
    },
    logKeyboard: _.throttle(function _logKeyboard(ev) {
      // track keyboard events and display
      // this is the big workhorse function
      this.clearSelection();
      let focus = document.activeElement.id;
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
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
          const theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else {
          const theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        }
      } else {
        // this is for all 'normal' keys that display letters and symbols

        let newWord = first + ev.key + second;
        this.editorArray[line].splice(word, 1, newWord);
        letter++;
        const theId = String(line + "-" + word + "-" + letter);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
      }
      // check to see if this was the last edit to a line and send the line to be saved if so
      if (this.editorArray.length - 1 > this.target && line != this.target) {
        // this.updateDisplayArray(this.target);
        this.target = line;
      } else if (line != this.target) {
        // this.setDisplayArray(this.target);
        this.target = line;
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
      this.target = line;
      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.displayArray = this.editorArray;
      this.editorArray = [];
      this.displayArray.forEach(line => {
        this.editorArray.push(line);
      });
      const theId = String(line + "-" + word + "-" + letter);
      process.nextTick(() => {
        document.getElementById(theId).focus();
      });
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
      let theId = String(line + "-" + word + "-" + letter);
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
          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
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
          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
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
            theId = String(prevLine + "-" + prevWord + "-" + tempLetter);
            line = prevLine;
            word = prevWord;
            letter = tempLetter;
          } else {
            this.editorArray.splice(prevLine, 1);
            theId = String(prevLine + "-" + 0 + "-" + 0);
            this.target = prevLine;
            line = prevLine;
            word = 0;
            letter = 0;
          }

          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
          // this.removeDisplayArray(this.target);
        } else if (letter == 0) {
          let prevWord = word - 1;
          let tempLetter = this.editorArray[line][prevWord].length;
          const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
          this.editorArray[line].splice(prevWord, 2, newWord);
          theId = String(line + "-" + prevWord + "-" + tempLetter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else if (this.editorArray[line][word][0] == "\n") {
          const prevLine = line - 1;
          let wordsInLine = this.editorArray[prevLine].length - 1;
          let lettersInWord = this.editorArray[prevLine][wordsInLine].length;
          // wordsInLine++;
          theId = String(prevLine + "-" + wordsInLine + "-" + lettersInWord);
          this.editorArray.splice(line, 1);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
          // this.removeDisplayArray(this.target);
          this.target = prevLine;
        } else {
          const second = this.editorArray[line][word].slice(letter);
          letter--;
          let first = this.editorArray[line][word].slice(0, letter);
          let newWord = first + second;
          this.editorArray[line].splice(word, 1, newWord);

          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        }
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
          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
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
          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else if (this.editorArray[line][word][0] == "\n") {
          const nextLine = parseInt(line) + 1;
          const tempLine = [];
          this.editorArray[nextLine].forEach(word => {
            tempLine.push(word);
          });
          theId = String(line + "-" + 0 + "-" + 0);
          this.editorArray.splice(line, 2, tempLine);
          this.target = line;
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else if (word == endWord && letter == endLetter) {
          const nextLine = parseInt(line) + 1;
          if (this.editorArray[nextLine][0][0] == "\n") {
            this.editorArray.splice(nextLine, 1);
            theId = String(line + "-" + word + "-" + letter);
            this.target = line;
          } else {
            theId = String(line + "-" + word + "-" + letter);
            this.editorArray[nextLine].forEach(word => {
              this.editorArray[line].push(word);
            });
            this.editorArray.splice(nextLine, 1);
            let nextWord = parseInt(word) + 1;
            const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
            this.editorArray[line].splice(word, 2, newWord);
            theId = String(line + "-" + word + "-" + letter);
          }
          this.target = line;
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else if (letter == wordEndLetter) {
          let nextWord = parseInt(word) + 1;
          const newWord = this.editorArray[line][word] + this.editorArray[line][nextWord];
          this.editorArray[line].splice(word, 2, newWord);
          theId = String(line + "-" + word + "-" + letter);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        } else {
          theId = String(line + "-" + word + "-" + letter);
          const first = this.editorArray[line][word].slice(0, letter);
          letter++;
          const second = this.editorArray[line][word].slice(letter);
          const newWord = first + second;
          this.editorArray[line].splice(word, 1, newWord);
          process.nextTick(() => {
            document.getElementById(theId).focus();
          });
        }
      }
      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.displayArray = this.editorArray;
      this.editorArray = [];
      this.displayArray.forEach(line => {
        this.editorArray.push(line);
        this.selectionLocation.start = { line: line, word: word, letter: letter };
        this.selectionLocation.end = { line: line, word: word, letter: letter };
      });
    }, 50),
    arrowVertical(dir, ev) {
      let curLine = this.editLocation.line;
      let curWord = this.editLocation.word;
      let curLetter = this.editLocation.letter;

      if (dir == "up" && curLine == 0) {
        return;
      }

      let nextLine = parseInt(curLine);
      if (dir == "down") {
        nextLine++;
      } else if (dir == "up") {
        nextLine--;
      }
      let nextWord = parseInt(curWord);
      let nextLetter = parseInt(curLetter);

      if (this.editorArray[nextLine]) {
        // calc number if lines in each array
        let currLength = 0;
        let nextLength = 0;
        this.editorArray[curLine].forEach((word, i) => {
          // letters from zero to current location
          if (i > curWord) {
            return;
          } else if (i == curWord) {
            currLength = parseInt(currLength) + parseInt(curLetter);
          } else {
            currLength = parseInt(currLength) + word.length + 1;
          }
        });
        let word = 0;
        let letter = 0;
        try {
          this.editorArray[nextLine].forEach((tempWord, index) => {
            if (currLength == nextLength) {
              word = index;
              throw "done";
            }
            _.split(this.editorArray[nextLine][index], "").forEach((tempLetter, key) => {
              if (currLength == nextLength) {
                word = index;
                letter = key;
                throw "done";
              } else {
                nextLength++;
              }
            });
            if (currLength == nextLength) {
              word = index;
              letter = this.editorArray[nextLine][word].length;
              throw "done";
            }
            nextLength++;
          });
        } catch (e) {
        } finally {
          if (currLength > nextLength && curLetter != 0 && curWord != 0) {
            word = this.editorArray[nextLine].length - 1;
            letter = this.editorArray[nextLine][word].length;
          } else if (this.editorArray[curLine][0][0] == "\n") {
            word = 0;
            letter = 0;
          }
        }

        nextWord = word;
        nextLetter = letter;

        let theId = String(nextLine + "-" + nextWord + "-" + nextLetter);
        document.getElementById(theId).focus();
        this.editLocation.line = Number(nextLine);
        this.editLocation.word = Number(nextWord);
        this.editLocation.letter = Number(nextLetter);

        let tempLetter = parseInt(nextLetter);

        if (ev.shiftKey) {
          // select using up and down arrows
          if (
            dir == "down" &&
            !_.isMatch(this.selectionLocation.start, this.selectionLocation.end) &&
            this.selectionLocation.start.line == curLine
          ) {
            tempLetter--;
            this.selectionLocation.start = { line: nextLine, word: nextWord, letter: tempLetter };
          } else if (
            dir == "up" &&
            !_.isMatch(this.selectionLocation.start, this.selectionLocation.end) &&
            this.selectionLocation.end.line == curLine
          ) {
            if (this.selectionLocation.start.letter != 0) {
              this.selectionLocation.start.letter--;
            } else {
              this.selectionLocation.start.word--;
              this.selectionLocation.start.letter = this.editLocation[
                this.selectionLocation.start.line
              ][this.selectionLocation.start.word].length;
            }
            this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
          } else {
            if (dir == "down") {
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (dir == "up") {
              if (!_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              } else if (this.selectionLocation.end.letter != 0) {
                this.selectionLocation.end.letter--;
              } else {
                this.selectionLocation.end.word--;
                this.selectionLocation.end.letter = this.editLocation[
                  this.selectionLocation.end.line
                ][this.selectionLocation.end.word].length;
              }
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            }
          }
        } else {
          this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
          this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
        }

        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else {
        console.log("CANT");
      }
    },
    arrowHorizontal(dir, ev) {
      // try {
      // TODO: workout end of line issues
      // look at making arrow keys wrap lines
      const line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);

      let newWord = 0;
      let newLetter = 0;
      if (dir == "left" || dir == "overL") newWord = word - 1;
      else if (dir == "right" || dir == "overR") newWord = word + 1;
      if (dir == "left" || dir == "overL") newLetter = letter - 1;
      else if (dir == "right" || dir == "overR") newLetter = letter + 1;

      if (dir == "start") {
        let theId = String(line + "-0-0");
        document.getElementById(theId).focus();
        if (!ev.shiftKey) {
          this.selectionLocation.start = { line: line, word: 0, letter: 0 };
          this.selectionLocation.end = { line: line, word: 0, letter: 0 };
        } else {
          this.selectionLocation.start = { line: line, word: 0, letter: 0 };
        }

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(0);
        this.editLocation.letter = Number(0);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (dir == "end") {
        word = this.editorArray[line].length - 1;
        letter = this.editorArray[line][word].length;

        const activeLineEnd = String(line + "-" + word + "-" + letter);
        if (!ev.shiftKey) {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else {
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (dir == "prev") {
        let theId = String(line + "-" + word + "-0");
        if (!ev.shiftKey) {
          this.selectionLocation.start = { line: line, word: word, letter: 0 };
          this.selectionLocation.end = { line: line, word: word, letter: 0 };
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: 0 };
        }
        document.getElementById(theId).focus();
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(0);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (dir == "next") {
        letter = this.editorArray[line][word].length;

        const activeLineEnd = String(line + "-" + word + "-" + letter);
        if (!ev.shiftKey) {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else {
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (ev.shiftKey) {
        if (dir == "overL") {
          if (this.editorArray[line][word][newLetter] != undefined) {
            let theId = String(line + "-" + word + "-" + newLetter);
            document.getElementById(theId).focus();
            this.editLocation.line = Number(line);
            this.editLocation.word = Number(word);
            this.editLocation.letter = Number(newLetter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          } else if (this.editorArray[line][newWord] != undefined) {
            letter = this.editorArray[line][newWord].length;
            let theId = String(line + "-" + newWord + "-" + letter);
            document.getElementById(theId).focus();
            this.editLocation.line = Number(line);
            this.editLocation.word = Number(newWord);
            this.editLocation.letter = Number(letter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          } else {
            word = 0;
            letter = 0;
            const activeLineEnd = String(line + "-" + word + "-" + letter);

            document.getElementById(activeLineEnd).focus();

            this.editLocation.line = Number(line);
            this.editLocation.word = Number(word);
            this.editLocation.letter = Number(letter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          }

          this.selectHorizontal("left");
        } else if (dir == "overR") {
          // try {
          if (this.editorArray[line][word][newLetter] != undefined) {
            let theId = String(line + "-" + word + "-" + newLetter);
            document.getElementById(theId).focus();
            this.editLocation.line = Number(line);
            this.editLocation.word = Number(word);
            this.editLocation.letter = Number(newLetter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          } else if (this.editorArray[line][newWord] != undefined) {
            letter = 0;
            let theId = String(line + "-" + newWord + "-" + letter);
            document.getElementById(theId).focus();
            this.editLocation.line = Number(line);
            this.editLocation.word = Number(newWord);
            this.editLocation.letter = Number(letter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          } else {
            word = this.editorArray[line].length - 1;
            letter = this.editorArray[line][word].length;
            const activeLineEnd = String(line + "-" + word + "-" + letter);

            document.getElementById(activeLineEnd).focus();

            this.editLocation.line = Number(line);
            this.editLocation.word = Number(word);
            this.editLocation.letter = Number(letter);
            this.displayArray = this.editorArray;
            this.editorArray = [];
            this.displayArray.forEach(line => {
              this.editorArray.push(line);
            });
          }
          // } catch (e) {
          //   throw e;
          // } finally {
          this.selectHorizontal("right");
          // }
        }
      } else if (this.editorArray[line][word].length >= newLetter && newLetter >= 0) {
        let theId = String(line + "-" + word + "-" + newLetter);
        this.selectionLocation.start = { line: line, word: word, letter: newLetter };
        this.selectionLocation.end = { line: line, word: word, letter: newLetter };

        document.getElementById(theId).focus();
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(newLetter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (this.editorArray[line][newWord] != undefined) {
        if (dir == "left") {
          letter = this.editorArray[line][newWord].length;
        } else if (dir == "right") {
          letter = 0;
        }
        this.selectionLocation.start = { line: line, word: newWord, letter: letter };
        this.selectionLocation.end = { line: line, word: newWord, letter: letter };

        let theId = String(line + "-" + newWord + "-" + letter);
        document.getElementById(theId).focus();
        this.editLocation.line = Number(line);
        this.editLocation.word = Number(newWord);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (
        this.displayArray[line][word][Number(letter)] == undefined &&
        dir == "right" &&
        !ev.metaKey &&
        !ev.altKey &&
        this.displayArray[Number(line) + 1] != undefined
      ) {
        let newLine = parseInt(line) + 1;
        word = 0;
        letter = 0;
        this.selectionLocation.start = { line: newLine, word: word, letter: letter };
        this.selectionLocation.end = { line: newLine, word: word, letter: letter };

        const activeLineEnd = String(newLine + "-" + word + "-" + letter);

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(newLine);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (
        word == 0 &&
        letter == 0 &&
        line != 0 &&
        dir == "left" &&
        !ev.metaKey &&
        !ev.altKey
      ) {
        let newLine = parseInt(line) - 1;
        word = this.displayArray[newLine].length - 1;
        letter = this.displayArray[newLine][word].length;
        this.selectionLocation.start = { line: newLine, word: word, letter: letter };
        this.selectionLocation.end = { line: newLine, word: word, letter: letter };

        const activeLineEnd = String(newLine + "-" + word + "-" + letter);

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(newLine);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (dir == "left") {
        word = 0;
        letter = 0;

        this.selectionLocation.start = { line: line, word: word, letter: letter };
        this.selectionLocation.end = { line: line, word: word, letter: letter };

        const activeLineEnd = String(line + "-" + word + "-" + letter);

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else if (dir == "right") {
        word = this.editorArray[line].length - 1;
        letter = this.editorArray[line][word].length;

        this.selectionLocation.start = { line: line, word: word, letter: letter };
        this.selectionLocation.end = { line: line, word: word, letter: letter };

        const activeLineEnd = String(line + "-" + word + "-" + letter);

        document.getElementById(activeLineEnd).focus();

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        this.displayArray = this.editorArray;
        this.editorArray = [];
        this.displayArray.forEach(line => {
          this.editorArray.push(line);
        });
      } else {
        console.log("UNDEFINED");
      }
    },
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@keyframes blink {
  0% {
    border-left: 1px solid rgba(1, 1, 1, 1)
  }
  50% {
    border-left: 1px solid rgba(1, 1, 1, 0)
  }
  75% {
    border-left: 1px solid rgba(0, 0, 0, 0)
  }
  100% {
    border-left: 1px solid rgba(1, 1, 1, 1)
  }
}

.editor
  width: 100%
  height: 100%
  margin: 60px auto
  padding 20px 0
  user-select: none
  .edit-content
    text-align: left
    outline: none
    height: 100%
    min-height: 30rem
    width: 600px
    overflow-x hidden
    overflow-y auto
    background-color: #E4E9EF
    padding 10px 0
    margin 0 auto
    border-radius: 5px
    > div:focus
      background-color: #FFF
    .display-line
      width: 100%
      height: 24px
      vertical-align: baseline
      text-align: left
      line-height: 24px
      margin: 4px 0
      white-space: nowrap
    .focused-line
      background-color: rgba(213, 216, 223, 0.36)
    .display-word, .display-letter
      display: inline-block
      vertical-align: top
      width: auto
      height: 24px
      line-height: 24px
      margin: 0
    .first-word-of-line
      text-transform: uppercase
    .display-letter:focus
      border-left: 1px solid black
      outline: none
      margin-left: -1px

      animation-name: blink
      animation-duration: 1.25s
      animation-iteration-count: infinite
      animation-timing-function: linear
    .end-space
      width: 5px
      margin: 0
      padding: 1px 0
      display: inline-block
      vertical-align: top
      height: 22px
      float: right
      &:focus
        border-left: 1px solid black
        outline: none
        width: 4px

        animation-name: blink
        animation-duration: 1.25s
        animation-iteration-count: infinite
        animation-timing-function: linear
    .spacer
      width: 100%
      display: inline-block
      overflow-x: none
    .front-spacer
      width: 1rem
      display: inline-block
      overflow-x: none
    .selected-letter
      background-color: rgba(193, 204, 230, 0.82)
    .empty-paragraph
      width: 0
      margin-left: -1px
      user-select: none
    .suggestionBox
      min-width: 150px
      max-height: 100px
      background-color: #66686f
      border-radius: 3px
      position: relative
      padding: 0
      overflow-y: auto
      .suggestion
        color: rgb(236, 243, 244)
        display: block
        padding: 4px 15px
        margin: 0
        &:focus
          background-color: #46474e
          outline: none
</style>
