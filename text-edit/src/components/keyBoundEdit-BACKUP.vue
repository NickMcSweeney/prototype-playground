<template>
  <div class="editor">
        <div
          class="edit-content"
        >
        <!-- loop through line -->
          <div
            class="display-line"
            v-for="(line, lineIndex) in editorArray"
            @click="logMouse(line,lineIndex)"
          >
          <!-- loop through word -->
            <div
              v-for="(word, index) in line"
              class="display-word"
              >
              <!-- loop through letters -->
              <div
                v-for="(letter, key) in word"
                class="display-letter"
                :tabindex="lineIndex"
                :id="lineIndex+'-'+index+'-'+key"
                @keypress.prevent.stop="logKeyboard"
                @keydown.delete.prevent.stop="deletePrev"
                @keydown.enter.prevent.stop="newLine"
              >
                {{ letter }}
              </div>
              <!-- this is an  empty space at the end of the loop to make selection easier -->
              <div
                class="display-letter"
                :tabindex="lineIndex"
                :id="lineIndex+'-'+index+'-'+(word.length)"
                @keypress.prevent.stop="logKeyboard"
                @keydown.delete.prevent.stop="deletePrev"
                @keydown.enter.prevent.stop="newLine"
              >
                {{ ' ' }}
              </div>
            </div>
          </div>
          <!-- this is where I have been putting the hints for possible words -->
          <!-- <div class="suggestionBox" v-if="suggestions.length">
            <p
              v-for="(word, index) in suggestions"
              :tabindex="index"
              :id="'suggestion-'+index"
              class="suggestion"
            >
            {{ word }}</p>
          </div> -->
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
    };
  },
  computed: {
    currentWord() {
      //  tracks current word being edited
      let word = this.editorArray[this.editLocation.line][this.editLocation.word];
      console.log(word);
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
    // suggestions() {
    //   // creates an array of suggested words / lines
    //   let matches = [];
    //   this.editorArray.forEach(line => {
    //     if (line.length <= 1) {
    //       console.log("line is EMPTY");
    //     } else if (line === this.currentLine) {
    //     } else {
    //       let diffMatch = 0;
    //       console.log(this.editLocation, this.editorArray);
    //       this.currentLine.forEach(currWord => {
    //         if (!line.includes(currWord)) {
    //           diffMatch++;
    //         }
    //       });
    //       if (diffMatch / line.length < 0.25) {
    //         let tempLine = "";
    //         line.forEach(word => {
    //           tempLine = tempLine + " " + word;
    //         });
    //         console.log("LINE -> ", tempLine);
    //         let dup = false;
    //         matches.forEach(match => {
    //           if (tempLine === match) {
    //             dup = true;
    //           }
    //         });
    //         if (!dup) matches.push(tempLine);
    //       }
    //     }
    //
    //     line.forEach(word => {
    //       if (word === " ") {
    //         console.log("word is EMPTY");
    //       } else if (word.trim() === this.currentWord) {
    //       } else if (word.indexOf(this.currentWord) > -1) {
    //         let dup = false;
    //         matches.forEach(match => {
    //           if (word.trim() === match.trim()) {
    //             dup = true;
    //           }
    //         });
    //         if (!dup) matches.push(word.trim());
    //       }
    //     });
    //   });
    //   return matches;
    // },
  },
  methods: {
    //
    // focusSuggestion() {
    //   console.log("FOCUS!");
    //   const theId = "suggestion-0";
    //   document.getElementById(theId).focus();
    //   console.log(document.getElementById(theId));
    // },
    // focusNextSuggestion(index) {
    //   console.log("FOCUS NEXT");
    //   const next = index + 1;
    //   const theId = "suggestion-" + next;
    //   document.getElementById(theId).focus();
    // },
    // focusPrevSuggestion(index) {
    //   console.log("FOCUS PREV");
    //   if (index === 0) {
    //     const theId = String(
    //       this.editLocation.line + "-" + this.editLocation.word + "-" + this.editLocation.letter
    //     );
    //     document.getElementById(theId).focus();
    //   } else {
    //     const prev = index - 1;
    //     const theId = "suggestion-" + prev;
    //     document.getElementById(theId).focus();
    //   }
    // },
    //

    // models saving the tracks line data
    setDisplayArray(lineIndex) {
      // function for saving a new line
      let temp = "";
      this.editorArray[lineIndex].forEach(word => {
        temp = temp + " " + word;
      });
      this.displayArray.splice(lineIndex, 0, temp);
      const payload = {
        lineId: lineIndex,
        lineContent: temp,
        num: 0,
      };
      this.$store.commit("updateLine", payload);
    },
    updateDisplayArray(lineIndex) {
      // function for saving update to a line
      let temp = "";
      this.editorArray[lineIndex].forEach(word => {
        temp = temp + " " + word;
      });
      this.displayArray.splice(lineIndex, 1, temp);
      const payload = {
        lineId: lineIndex,
        lineContent: temp,
        num: 1,
      };
      this.$store.commit("updateLine", payload);
    },
    removeDisplayArray(lineIndex) {
      // function for removing a line
      this.displayArray.splice(lineIndex, 1);
      const payload = {
        lineId: lineIndex,
        lineContent: "",
        num: 1,
      };
      this.$store.commit("updateLine", payload);
    },
    logMouse(line, index) {
      // focus document based on mouse input
      const theId = String(index + "-0-0");
      if (line.length <= 1) {
        document.getElementById(theId).focus();
      }
      // this.updateDisplayArray(this.target);
      this.target = index;
      // document.addEventListener("click", ev => {
      //   console.log("LENGTH:", line.length, line);
      //   } else if (ev.target.attributes.length < 3) {
      //     const theId = String(index + "-0-END");
      //     document.getElementById(theId).focus();
      //   }
      //   console.log(theId);
      // });
    },
    logKeyboard(ev) {
      // track keyboard events and display
      // this is the big workhorse function
      let focus = document.activeElement.id;
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
      let first = this.editorArray[line][word].slice(0, letter);
      const second = this.editorArray[line][word].slice(letter);

      this.editLocation.line = line;
      this.editLocation.word = word;
      this.editLocation.letter = letter;

      // console.log("CODE", ev.code);
      if (ev.code === "Enter") {
        return;
      } else if (ev.code === "ArrowDown") {
        // opens up the selection of the 'hints'/suggested words
        if (e.code === "ArrowDown") {
          const theId = "suggestion-0";
          document.getElementById(theId).focus();
        }
      } else if (ev.code === "Space") {
        // special handling for spacebar
        this.editorArray[line].splice(word, 1, second);
        this.editorArray[line].splice(word, 0, first);
        letter = 0;
        word++;
        const theId = String(line + "-" + word + "-" + letter);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
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
        console.log(this.editorArray.length, line);
        // this.updateDisplayArray(this.target);
        this.target = line;
      } else if (line != this.target) {
        // this.setDisplayArray(this.target);
        this.target = line;
      }
    },
    newLine(ev) {
      // handle the enter key event
      let focus = document.activeElement.id;
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
      let first = this.editorArray[line][word].slice(0, letter);
      const second = this.editorArray[line][word].slice(letter);
      if (letter != 0) {
        this.editorArray[line].splice(word, 1, second);
        this.editorArray[line].splice(word, 0, first);
        letter = 0;
        word++;
      }
      let begining = this.editorArray[line].slice(0, word);
      const end = this.editorArray[line].slice(word);
      this.editorArray[line] = begining;
      line++;
      this.editorArray.splice(line, 0, end);
      word = 0;
      letter = 0;
      const theId = String(line + "-" + word + "-" + letter);
      process.nextTick(() => {
        document.getElementById(theId).focus();
      });
      // this.setDisplayArray(this.target);
      this.target = line;
    },
    deletePrev() {
      // handle the backspace key
      let focus = document.activeElement.id;
      console.log("FOCUS:", focus);
      let split = focus.indexOf("-");

      let line = focus.slice(0, split);

      focus = focus.slice(split + 1);
      split = focus.indexOf("-");

      let word = focus.slice(0, split);
      let letter = focus.slice(split + 1);
      let theId = String(line + "-" + word + "-" + letter);
      if (line == 0 && word == 0 && letter == 0) {
        console.log("Already at the begining!!");
        return;
      } else if (word == 0 && letter == 0) {
        console.log("THIS IS A BACKSPACE AT THE BEGINING OF A LINE");
        const prevLine = line - 1;
        let wordsInLine = this.editorArray[prevLine].length;
        // wordsInLine++;
        theId = String(prevLine + "-" + wordsInLine + "-" + 0);
        this.editorArray[line].forEach(word => {
          this.editorArray[prevLine].push(word);
        });
        this.editorArray.splice(line, 1);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
        // this.removeDisplayArray(this.target);
        this.target = prevLine;
      } else if (letter == 0) {
        console.log("THIS IS A BS AT BEGINING OF A WORD?");
        let prevWord = word - 1;
        let tempLetter = this.editorArray[line][prevWord].length;
        const newWord = this.editorArray[line][prevWord] + this.editorArray[line][word];
        this.editorArray[line].splice(prevWord, 2, newWord);
        theId = String(line + "-" + prevWord + "-" + tempLetter);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
      } else {
        console.log("ALL OTHER CASES FOR BS");
        const second = this.editorArray[line][word].slice(letter);
        letter--;
        let first = this.editorArray[line][word].slice(0, letter);
        let newWord = first + second;
        this.editorArray[line].splice(word, 1, newWord);
        console.log("THE LINE: ", this.editorArray[line]);

        theId = String(line + "-" + word + "-" + letter);
        process.nextTick(() => {
          document.getElementById(theId).focus();
        });
      }
    },
  },
  mounted() {
    // let that = this;
    // window.addEventListener("keydown", function(ev) {
    //   // Special event listener to handle 'tab' key events for the auto complete of words and lines
    //   console.log(document.activeElement.className);
    //   if (document.activeElement.className === "display-letter") {
    //     // handle tab and arrow selection if focus is on the main edit box
    //     if (ev.code === "ArrowDown") {
    //       const theId = String("suggestion-" + that.currSuggestion);
    //       console.log("THE ID: ", theId);
    //       process.nextTick(() => {
    //         document.getElementById(theId).focus();
    //       });
    //     } else if (ev.code === "Tab") {
    //       if (that.suggestions[0].indexOf(" ") > -1 && that.suggestions[0].length > 1) {
    //         let tempArr = [];
    //         let editArr = that.suggestions[0];
    //         console.log(editArr);
    //         while (editArr.indexOf(" ") > -1 && that.suggestions[0].length > 2) {
    //           tempArr.push(editArr.slice(0, editArr.indexOf(" ")));
    //           editArr = editArr.slice(editArr.indexOf(" ") + 1);
    //           console.log(editArr);
    //         }
    //         tempArr.push(editArr);
    //         console.log("TEMP ARR", tempArr);
    //         let lengthOf = tempArr.slice(-1)[0].length;
    //         tempArr.push(" ");
    //         that.editorArray.splice(that.editLocation.line, 1, tempArr);
    //         console.log("LENgth", lengthOf);
    //         const loc = String(
    //           that.editLocation.line + "-" + (tempArr.length - 2) + "-" + String(lengthOf)
    //         );
    //         console.log(loc);
    //         process.nextTick(() => {
    //           document.getElementById(loc).focus();
    //           that.currSuggestion = 0;
    //         });
    //       } else {
    //         let newWord = that.suggestions[0] + " ";
    //         let lengthOf = newWord.length;
    //         that.editorArray[that.editLocation.line].splice(that.editLocation.word, 1, newWord);
    //         console.log("LENgth", lengthOf, newWord);
    //         const loc = String(
    //           that.editLocation.line + "-" + that.editLocation.word + "-" + String(lengthOf)
    //         );
    //         process.nextTick(() => {
    //           document.getElementById(loc).focus();
    //           that.currSuggestion = 0;
    //         });
    //       }
    //     }
    //   } else if (document.activeElement.className === "suggestion") {
    //     // handle tab and arrow events when the selection is on the suggestion/typeahead box
    //     console.log(ev.code, that.editLocation, that.currSuggestion);
    //     let nextVal = that.currSuggestion + 1;
    //     if (ev.code === "ArrowDown" && that.suggestions.length > nextVal) {
    //       that.currSuggestion++;
    //       const theId = String("suggestion-" + that.currSuggestion);
    //       process.nextTick(() => {
    //         document.getElementById(theId).focus();
    //       });
    //     } else if (ev.code === "ArrowUp") {
    //       if (that.currSuggestion === 0) {
    //         const loc = String(
    //           that.editLocation.line + "-" + that.editLocation.word + "-" + String(lengthOf)
    //         );
    //         process.nextTick(() => {
    //           document.getElementById(loc).focus();
    //         });
    //       } else {
    //         that.currSuggestion--;
    //         const theId = String("suggestion-" + that.currSuggestion);
    //         process.nextTick(() => {
    //           document.getElementById(theId).focus();
    //         });
    //       }
    //     } else if (ev.code === "Tab") {
    //       if (
    //         that.suggestions[that.currSuggestion].indexOf(" ") > -1 &&
    //         that.suggestions[that.currSuggestion].length > 1
    //       ) {
    //         let tempArr = [];
    //         let editArr = that.suggestions[that.currSuggestion];
    //         console.log(editArr);
    //         while (editArr.indexOf(" ") > -1 && that.suggestions[that.currSuggestion].length > 2) {
    //           tempArr.push(editArr.slice(0, editArr.indexOf(" ")));
    //           editArr = editArr.slice(editArr.indexOf(" ") + 1);
    //           console.log(editArr);
    //         }
    //         tempArr.push(editArr);
    //         console.log("TEMP ARR", tempArr);
    //         let lengthOf = tempArr.slice(-1)[0].length;
    //         tempArr.push(" ");
    //         that.editorArray.splice(that.editLocation.line, 1, tempArr);
    //         console.log("LENgth", lengthOf);
    //         const loc = String(
    //           that.editLocation.line + "-" + (tempArr.length - 2) + "-" + String(lengthOf)
    //         );
    //         console.log(loc);
    //         process.nextTick(() => {
    //           document.getElementById(loc).focus();
    //           that.currSuggestion = 0;
    //         });
    //       } else {
    //         let newWord = that.suggestions[that.currSuggestion] + " ";
    //         let lengthOf = newWord.length;
    //         that.editorArray[that.editLocation.line].splice(that.editLocation.word, 1, newWord);
    //         console.log("LENgth", lengthOf, newWord);
    //         const loc = String(
    //           that.editLocation.line + "-" + that.editLocation.word + "-" + String(lengthOf)
    //         );
    //         process.nextTick(() => {
    //           document.getElementById(loc).focus();
    //           that.currSuggestion = 0;
    //         });
    //       }
    //     }
    //   } else {
    //     // reset suggestion array
    //     that.currSuggestion = 0;
    //   }
    // });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.editor
  width: 100%
  height: 100%
  margin: 60px auto
  padding 20px 0
  .edit-content
    text-align: left
    outline: none
    height: 100%
    min-height: 30rem
    width: 600px
    overflow-x hidden
    overflow-y auto
    background-color: #E4E9EF
    padding 10px 1rem
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
    .display-word, .display-letter
      display: inline-block
      vertical-align: top
      width: auto
      height: 24px
      line-height: 24px
      min-width: 2px
    .display-letter:focus
      border-left: 1px solid black
      outline: none
      background-color: black
      color: white
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
