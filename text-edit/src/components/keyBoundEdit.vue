<template>
  <div class="editor">
        <div
          class="edit-content"
          @click="mouseOutOfBounds"
          @mousedown.prevent="mouseDown(ev = {target:{id:
  endOfLastLine}})"
          @mouseup.prevent="mouseUp(ev = {target:{id:
  endOfLastLine}})"
        >
        <!-- loop through line -->
          <div
            class="display-line"
            v-for="(line, lineIndex) in editorArray"
            @click.stop.prevent="logMouse($event,line,lineIndex)"
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
              @click.prevent.stop="selectLine($event, lineIndex)"
              v-on:dblclick="selectWord"
              >
              <!-- loop through letters

              @keydown.left.meta.stop.prevent="arrowHorizontal('start', $event)"
              @keydown.right.meta.stop.prevent="arrowHorizontal('end', $event)"
              @keydown.left.alt.stop.prevent="arrowHorizontal('prev', $event)"
              @keydown.right.alt.stop.prevent="arrowHorizontal('next', $event)"
              @keydown.left.stop.prevent="arrowHorizontal('left', $event)"
              @keydown.right.stop.prevent="arrowHorizontal('right', $event)"
              @keydown.left.shift.stop.prevent="arrowHorizontal('overL', $event)"
              @keydown.right.shift.stop.prevent="arrowHorizontal('overR', $event)"
             -->
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
                @keydown.left.stop.prevent="arrowHorizontal($event, 'left')"
                @keydown.right.stop.prevent="arrowHorizontal($event, 'right')"
                @mousedown.stop.prevent="mouseDown"
                @mouseup.stop.prevent="mouseUp"
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
                @keydown.left.stop.prevent="arrowHorizontal($event, 'left')"
                @keydown.right.stop.prevent="arrowHorizontal($event, 'right')"
                @mousedown.stop.prevent="mouseDown"
                @mouseup.stop.prevent="mouseUp"
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
    endOfLastLine() {
      if (this.editorArray[0][0] == [" "]) {
        return "0-0-1";
      }
      const line = this.editorArray.length - 1;
      const word = this.editorArray[line].length - 1;
      const letter = this.editorArray[line][word].length;
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
    mouseOutOfBounds() {
      this.target = this.endOfLastLine;

      let focus = this.endOfLastLine;
      let split = focus.indexOf("-");
      const line = focus.slice(0, split);
      focus = focus.slice(split + 1);
      split = focus.indexOf("-");
      const word = focus.slice(0, split);
      const letter = focus.slice(split + 1);

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
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
      let line = parseInt(divId.slice(0, split));
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = parseInt(divId.slice(0, split));
      let letter = parseInt(divId.slice(split + 1));

      this.selectionLocation.start = { line: line, word: word, letter: letter };
      this.selectionLocation.end = { line: line, word: word, letter: letter };

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      const theId = String(line + "-" + word + "-" + letter);
      document.getElementById(theId).focus();

      this.letterStartSelectBk = Number(letter);
      this.selecting = true;
    },
    mouseUp(ev) {
      let divId = ev.target.id;
      let split = divId.indexOf("-");
      let line = parseInt(divId.slice(0, split));
      divId = divId.slice(split + 1);
      split = divId.indexOf("-");
      let word = parseInt(divId.slice(0, split));
      let letter = parseInt(divId.slice(split + 1));

      // try {
      //   if (
      //     this.compareLoc(this.selectionLocation.start, {
      //       line: line,
      //       word: word,
      //       letter: letter,
      //     }) == "greater"
      //   ) {
      //     // this.selectionLocation.start.letter--;
      //     this.selectionLocation.end = { line: line, word: word, letter: letter };
      //     // letter--;
      //   } else if (
      //     this.compareLoc(this.selectionLocation.start, {
      //       line: line,
      //       word: word,
      //       letter: letter,
      //     }) == "equal"
      //   ) {
      //     throw "Ignore me";
      //   } else {
      //     letter--;
      //     this.selectionLocation.end = { line: line, word: word, letter: letter };
      //     letter++;
      //   }
      //
      //   this.editLocation.line = Number(line);
      //   this.editLocation.word = Number(word);
      //   this.editLocation.letter = Number(letter);
      //   const theId = String(line + "-" + word + "-" + letter);
      //
      //   document.getElementById(theId).focus();
      // } catch (e) {}

      this.updateData(line, word, letter);
      this.selecting = false;
    },
    mouseOver: _.throttle(function _mouseOver(ev) {
      if (this.selecting) {
        let divId = ev.target.id;
        let split = divId.indexOf("-");
        let line = parseInt(divId.slice(0, split));
        divId = divId.slice(split + 1);
        split = divId.indexOf("-");
        let word = parseInt(divId.slice(0, split));
        let letter = parseInt(divId.slice(split + 1));

        let tempLetter = "";

        const curLocObj = { line: line, word: word, letter: letter };
        const editLocObj = this.editLocation;
        const selStartObj = this.selectionLocation.start;
        const selEndObj = this.selectionLocation.end;

        if (
          this.compareLoc(editLocObj, curLocObj) == "greater" &&
          this.compareLoc(selStartObj, curLocObj) == "greater" &&
          this.compareLoc(selEndObj, curLocObj) == "greater"
        ) {
          if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
            // first letter up
            tempLetter = letter.toString();
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end.letter = tempLetter;
            // } else if (
            //   this.compareLoc(selStartObj, editLocObj) == "less" &&
            //   this.compareLoc(selEndObj, editLocObj) == "less" &&
            //   this.compareLoc(selStartObj, curLocObj) == "greater"
            // ) {
            //   // select flip up
            //   tempLetter = (Number(this.selectionLocation.end.letter) - 1).toString();
            //   this.selectionLocation.end = this.selectionLocation.start;
            //   this.selectionLocation.end.letter = tempLetter;
            //   this.selectionLocation.start = { line: line, word: word, letter: letter };
          } else {
            // select up from selecting up
            this.selectionLocation.start = { line: line, word: word, letter: letter };
          }
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "less" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          (this.compareLoc(selEndObj, curLocObj) == "greater" ||
            this.compareLoc(selEndObj, curLocObj) == "equal")
        ) {
          // select down from selecting up
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "greater" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          (this.compareLoc(selEndObj, curLocObj) == "greater" ||
            this.compareLoc(selEndObj, curLocObj) == "equal")
        ) {
          // select up from selecting down
          letter = parseInt(letter) - 1;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
          letter = parseInt(letter) + 1;
        } else if (
          this.compareLoc(editLocObj, curLocObj) == "less" &&
          this.compareLoc(selStartObj, curLocObj) == "less" &&
          this.compareLoc(selEndObj, curLocObj) == "less"
        ) {
          letter = parseInt(letter) - 1;
          if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
            // first letter up
            tempLetter = letter.toString();
            this.selectionLocation.end = { line: line, word: word, letter: letter };
            this.selectionLocation.start.letter = tempLetter;
            // } else if (
            //   // select flip down
            //   this.compareLoc(selStartObj, editLocObj) == "equal" &&
            //   this.compareLoc(selEndObj, editLocObj) == "greater" &&
            //   this.compareLoc(selStartObj, curLocObj) == "less"
            // ) {
            //   tempLetter = (Number(this.selectionLocation.end.letter) + 1).toString();
            //   this.selectionLocation.start = this.selectionLocation.end;
            //   this.selectionLocation.start.letter = tempLetter;
            //   this.selectionLocation.end = { line: line, word: word, letter: letter };
          } else {
            // select down from selecting down
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
          letter = parseInt(letter) + 1;
          // } else if (
          //   !_.isEqual(this.selectionLocation.start, this.selectionLocation.end) &&
          //   this.compareLoc(selStartObj, selEndObj) == "equal"
          // ) {
          //   this.selectionLocation.start = { line: line, word: word, letter: letter };
          //   this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (this.compareLoc(curLocObj, selEndObj) == "greater") {
          this.selectionLocation.start = curLocObj;
        } else if (this.compareLoc(curLocObj, selEndObj) == "less") {
          this.selectionLocation.end = curLocObj;
        } else if (this.compareLoc(curLocObj, selEndObj) == "equal") {
          this.selectionLocation.end = curLocObj;
          this.selectionLocation.start = curLocObj;
        } else {
          console.log("unhandled");
        }

        if (parseInt(this.selectionLocation.end.letter) < 0) {
          this.selectionLocation.end.letter = 0;
        } else if (
          parseInt(this.selectionLocation.end.letter) > this.editorArray[line][word].length
        ) {
          this.selectionLocation.end.letter = this.editorArray[line][word].length;
        } else if (parseInt(this.selectionLocation.start.letter) < 0) {
          this.selectionLocation.start.letter = 0;
        } else if (
          parseInt(this.selectionLocation.start.letter) > this.editorArray[line][word].length
        ) {
          this.selectionLocation.start.letter = this.editorArray[line][word].length;
        }

        this.editLocation.line = Number(line);
        this.editLocation.word = Number(word);
        this.editLocation.letter = Number(letter);
        const theId = String(line + "-" + word + "-" + letter);

        document.getElementById(theId).focus();
      }
    }, 25),
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
        this.updateData(line, word, letter);
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
          this.updateData(line, word, letter);
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

        this.updateData(line, word, letter);
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

        this.updateData(line, word, letter);
      }
    },
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
      } else if (
        this.compareLoc(this.selectionLocation.end, this.selectionLocation.start) === "equal" &&
        !_.isMatch(this.selectionLocation.start, this.selectionLocation.end)
      ) {
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
          let before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let after = this.editorArray[lineE][wordE].slice(letterE);
          letterE--;
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
        } else if (lineS === lineE && wordS === wordE) {
          let before = this.editorArray[lineS][wordS].slice(0, letterS);
          letterE++;
          let after = this.editorArray[lineE][wordE].slice(letterE);
          this.editorArray[lineS].splice(wordS, 1, before + after);
        } else if (lineS === lineE) {
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
        this.updateData(lineS, wordS, letterS);
      }
    },
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

        this.updateData(nextLine, nextWord, nextLetter);

        let tempLetter = parseInt(nextLetter);

        if (ev.shiftKey) {
          // select using up and down arrows

          if (dir == "up") {
            // select up
            if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              // if arrow up from no selection
              curLetter--;
              this.selectionLocation.end.letter = curLetter;
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (_.isMatch(this.selectionLocation.start, this.editLocation)) {
              // if reset selection
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - up
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow up from selectionLocation.start
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == curLine) {
              // if arrow up from selectionLocation.end
              if (
                this.compareLoc(this.selectionLocation.start, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "less"
              ) {
                tempLetter--;
                this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
              } else if (
                this.compareLoc(this.selectionLocation.start, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "greater"
              ) {
                this.selectionLocation.start = {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                };
              }
            }
          } else if (dir == "down") {
            // select down
            if (_.isMatch(this.selectionLocation.start, this.selectionLocation.end)) {
              // if arrow down from no selection
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (
              this.selectionLocation.end.line == this.editLocation.line &&
              this.selectionLocation.end.word == this.editLocation.word &&
              this.selectionLocation.end.letter + 1 == this.editLocation.letter
            ) {
              // if reset selection
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
              this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            } else if (this.selectionLocation.end.line == this.selectionLocation.start.line) {
              // part of line already selected - down
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            } else if (this.selectionLocation.start.line == curLine) {
              // if arrow down from selectionLocation.start
              if (
                this.compareLoc(this.selectionLocation.end, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "less"
              ) {
                tempLetter--;
                this.selectionLocation.end = {
                  line: nextLine,
                  word: nextWord,
                  letter: tempLetter,
                };
              } else if (
                this.compareLoc(this.selectionLocation.end, {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                }) == "greater"
              ) {
                this.selectionLocation.start = {
                  line: nextLine,
                  word: nextWord,
                  letter: nextLetter,
                };
              }
            } else if (this.selectionLocation.end.line == curLine) {
              // if arrow down from selectionLocation.end
              tempLetter--;
              this.selectionLocation.end = { line: nextLine, word: nextWord, letter: tempLetter };
            }
          } else {
            this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
            this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
          }
        } else {
          this.selectionLocation.start = { line: nextLine, word: nextWord, letter: nextLetter };
          this.selectionLocation.end = { line: nextLine, word: nextWord, letter: nextLetter };
        }
      } else {
        console.log("CANT");
      }
    },
    arrowHorizontal(ev, dir) {
      let line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);

      const prev = { line: line, word: word, letter: letter };

      let newWord = 0;
      let newLetter = 0;

      if (dir == "left") newWord = word - 1;
      else if (dir == "right") newWord = word + 1;
      if (dir == "left") newLetter = letter - 1;
      else if (dir == "right") newLetter = letter + 1;

      if (ev.metaKey && dir == "left") {
        // command key + left arrow - move to begining of line
        letter = 0;
        word = 0;
        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("left", prev, "meta");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.metaKey && dir == "right") {
        // command key + right arrow - move to end of line
        word = this.editorArray[line].length - 1;
        letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("right", prev, "meta");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.altKey && dir == "left") {
        // alt key + left arrow - move to begining of word
        if (letter == 0) word--;
        letter = 0;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("left", prev, "alt");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (ev.altKey && dir == "right") {
        // alt key + right arrow - move to end of word
        if (letter == this.editorArray[line][word].length) word++;
        letter = this.editorArray[line][word].length;

        this.updateData(line, word, letter);
        if (ev.shiftKey) {
          this.selectHorizontal("right", prev, "alt");
        } else {
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        }
      } else if (dir == "left") {
        if (newLetter > -1) {
          letter = newLetter;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else if (newWord > -1) {
          word = newWord;
          letter = this.editorArray[line][word].length;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else {
          word = 0;
          letter = 0;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("left", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        }
      } else if (dir == "right") {
        if (newLetter <= this.editorArray[line][word].length) {
          letter = newLetter;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else if (newWord < this.editorArray[line].length) {
          word = newWord;
          letter = 0;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        } else {
          word = this.editorArray[line].length - 1;
          letter = this.editorArray[line][word].length;

          this.updateData(line, word, letter);
          if (ev.shiftKey) {
            this.selectHorizontal("right", prev, null);
          } else {
            this.selectionLocation.start = { line: line, word: word, letter: letter };
            this.selectionLocation.end = { line: line, word: word, letter: letter };
          }
        }
      }
    },
    selectHorizontal(dir, prev, mod) {
      let line = parseInt(this.editLocation.line);
      let word = parseInt(this.editLocation.word);
      let letter = parseInt(this.editLocation.letter);
      let tempStr = letter;

      if (dir == "left") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          // left from no selection
          tempStr = (prev.letter - 1).toString();
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: prev.line, word: prev.word, letter: tempStr };
        } else if (
          this.selectionLocation.start.line == this.editLocation.line &&
          this.selectionLocation.start.word == this.editLocation.word &&
          this.selectionLocation.start.letter == this.editLocation.letter
        ) {
          // reset selection
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          (mod == "alt" && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
          (mod == "meta" && this.selectionLocation.start.line == this.selectionLocation.end.line)
        ) {
          // fix switch selection
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (_.isMatch(this.selectionLocation.start, prev)) {
          // left from start
          this.selectionLocation.start = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.end.line == prev.line &&
          this.selectionLocation.end.word == prev.word &&
          this.selectionLocation.end.letter + 1 == prev.letter
        ) {
          // left from end
          this.selectionLocation.end = { line: line, word: word, letter: letter - 1 };
        } else {
          console.log("So this is entirely unhandled");
        }
      } else if (dir == "right") {
        if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
          // right from no selection
          letter--;
          tempStr = prev.letter.toString();
          this.selectionLocation.start = { line: prev.line, word: prev.word, letter: tempStr };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.end.line == this.editLocation.line &&
          this.selectionLocation.end.word == this.editLocation.word &&
          this.selectionLocation.end.letter == this.editLocation.letter - 1
        ) {
          // reset selection
          letter--;
          this.selectionLocation.start = { line: line, word: word, letter: letter };
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          (mod == "alt" && this.selectionLocation.start.word == this.selectionLocation.end.word) ||
          (mod == "meta" && this.selectionLocation.start.line == this.selectionLocation.end.line)
        ) {
          // fix switch selection
          console.log("Going right");
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else if (
          this.selectionLocation.start.line == prev.line &&
          this.selectionLocation.start.word == prev.word &&
          this.selectionLocation.start.letter == prev.letter
        ) {
          letter--;
          this.selectionLocation.start = { line: line, word: word, letter: letter + 1 };
        } else if (
          this.selectionLocation.end.line == prev.line &&
          this.selectionLocation.end.word == prev.word &&
          this.selectionLocation.end.letter + 1 == prev.letter
        ) {
          letter--;
          this.selectionLocation.end = { line: line, word: word, letter: letter };
        } else {
          console.log("So this is entirely unhandled");
        }
        letter++;
      }
      this.updateData(line, word, letter);
    },
    updateData: _.throttle(function _updateData(line, word, letter) {
      const newId = String(line + "-" + word + "-" + letter);

      process.nextTick(() => {
        document.getElementById(newId).focus();
      });

      this.editLocation.line = Number(line);
      this.editLocation.word = Number(word);
      this.editLocation.letter = Number(letter);
      this.target = line;
      const tempArr = this.editorArray;
      this.editorArray = [];
      tempArr.forEach(line => {
        this.editorArray.push(line);
      });
    }, 10),
  },
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
