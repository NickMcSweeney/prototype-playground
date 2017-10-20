<template id="container">
  <div class="editor">

    <hidden-editor
      :location="editLocation"
      :focus="focus"
      @char="logKeyboard"
      @enter="enterEvent"
      @delete="deleteEvent"
      @deleteLine="deleteLineEvent"
      @deleteWord="deleteWordEvent"
      @backspace="backspaceEvent"
      @backspaceLine="backspaceLineEvent"
      @backspaceWord="backspaceWordEvent"
      @left="arrowLeft"
      @leftLine="lineLeft"
      @leftWord="wordLeft"
      @right="arrowRight"
      @rightLine="lineRight"
      @rightWord="wordRight"
      @up="arrowUp"
      @down="arrowDown"
      @tab="tabEvent"
      @unknown="setUnknown"
      @bold="setBold"
      @explicit="setExplicit"
    ></hidden-editor>

    <div id="edit-container">

      <!--
      TODO: needs optimization for highlighting before it can be implemented
      <mini-map
        :phrases="editorArray"
        :topLine="topVisLine"
        :bottomLine="bottomVisLine"
        :isSearchReult="isSearchReult"
        :isSpErr="isSpErr"
        @mini-map-focus="mmfocus"
      ></mini-map>
      -->

      <div
        class="edit-content"
        @click="mouseOutOfBounds"
        @mousedown.prevent="mouseDown(ev = {target:{id: endOfLastLine}})"
        @mouseup.prevent="mouseUp(ev = {target:{id: endOfLastLine}})"
        @scroll="scrolling"
      >
      <!-- loop through line -->
      <div
        v-for="(line, lineIndex) in editorArray"
        :class="{'focused-line': isLineFocused(lineIndex)}"
      >
      <div class="display-line" v-if="onScreen(lineIndex)">
        <div
          class="display-letter front-spacer"
          :id="'START-'+lineIndex"
          @click.stop.prevent="selectStart"
          @mousedown.stop.prevent="mouseDown(ev = {target:{id: lineIndex +'-0-0'}})"
          @mouseup.stop.prevent="mouseUp(ev = {target:{id: lineIndex +'-0-0'}})"
        >
          {{ ' ' }}
        </div>
        <!-- loop through word -->
        <!-- insert -> for word hist show :style="{'background-color': changeValue(lineIndex)}" -->
        <div
          v-for="(word, index) in line"
          class="display-word"
          :class="{
            'unknown-word': isUnknown(lineIndex, index),
            'explicit-word': isExplicit(lineIndex, index),
            'bold-word': isBold(lineIndex, index)
          }"
          @click.prevent.stop="selectLine($event, lineIndex)"
          @contextmenu.prevent.stop="checkWordSpelling($event, lineIndex, index)"
          v-on:dblclick="selectWord"
          >
          <!-- loop through letters -->
          <!-- insert -> for word hist show :style="{'background-color': wordChangeValue(lineIndex, index)}" -->
          <display-letter
            v-for="(letter, key) in word"
            key=key
            :letter="letter"
            :lineIndex="lineIndex"
            :wordIndex="index"
            :letterIndex="key"
            :search="isSearchReult(lineIndex, index)"
            :spelling="missSpellingArray"
            :capitalization="index == 0 && key == 0"
            :cursorPosition="isCursorLoc(lineIndex, index, key)"
            :selection="inRange(lineIndex, index, key) && singleSelection"
            :currentLocation="editLocation"
            @mousedown="mouseDown"
            @mouseup="mouseUp"
            @mouseover="mouseOver"
          ></display-letter>
          <!-- this is an  empty space at the end of the loop to make selection easier -->
          <div
            class="end-space"
            :id="lineIndex+'-'+index+'-'+(word.length)"
            :class="{
              'cursor': isCursorLoc(lineIndex, index, (word.length)),
              'selected-letter': inRange(lineIndex, index, word.length) && singleSelection,
              'empty-paragraph': word[0] == '\n'
            }"
            @mousedown.stop.prevent="mouseDown"
            @mouseup.stop.prevent="mouseUp"
            @mouseover="mouseOver"
          >
            <div
              class="suggestion"
              v-if="predictText &&
              possibleLines[tabNum] &&
              editorArray[0][0] != ' ' &&
              lineIndex==editLocation.line &&
              index == editLocation.word &&
              isSelectedSuggestion"
              :class="{'guess-needs-space': guessNeedsSpace}"
            >
              {{ bestGuess }}
            </div>
            {{ '' }}
          </div>
          <slot name="dropdown-on-word" v-if="lineIndex==editLocation.line && index == editLocation.word"> </slot>
          <div class="pop-box"
            v-if="showSpelling &&
            showSuggestions &&
            lineIndex==editLocation.line &&
            index == editLocation.word &&
            currentSuggestions.length > 0"
          >
            <div class="popover" >
              <h6 v-for="(suggest, index) in currentSuggestions" @mousedown.stop.prevent="selectSpSuggest(index)" :class="{'selected-suggestion': isSelectedSuggestion && index==tabNum}">{{ suggest }}</h6>
            </div>
          </div>
          <div class="pop-box"
            v-if="predictText &&
            possibleLines[tabNum] &&
            editorArray[0][0] != ' ' &&
            lineIndex==editLocation.line &&
            index == editLocation.word &&
            editLocation.letter == (editorArray[lineIndex][index].length)"
          >
            <div class="popover" >
              <div class="fills" v-if="possibleLines.length > 0">
                <h6 v-for="(line, index) in possibleLines" :class="{'selected-suggestion': isSelectedSuggestion && index==tabNum}">{{ `${line}` }}</h6>
              </div>
              <div class="ref" v-if="refLines.length > 0">
                <h6>{{refLines[0]}}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="display-line">
        <div
          class="display-letter front-spacer"
          :id="'START-'+lineIndex"
          @click.stop.prevent="selectStart"
          @mousedown.stop.prevent="mouseDown(ev = {target:{id: lineIndex +'-0-0'}})"
          @mouseup.stop.prevent="mouseUp(ev = {target:{id: lineIndex +'-0-0'}})"
        >
          {{ ' ' }}
        </div>
        <div
          class="end-space"
          @mousedown.stop.prevent="mouseDown"
          @mouseup.stop.prevent="mouseUp"
          @mouseover="mouseOver"
        >
        </div>
      </div>
      </div>

      </div>
    </div>
    <slot name="dropdown-on-editor"> </slot>
    <search-bar v-if="searchable" :data="editorArray" v-on:search="searching" @focus="changeFocus"></search-bar>
  </div>
</template>

<script>
import _ from 'lodash';

import miniMap from './../mini-map/index.vue';
import searchBar from './../search-bar/index.vue';
import hiddenEditor from './../hidden-editor/index.vue';
import displayLetter from './../display-letter/index.vue';

import logKeyboard from './keyboard/keyboard-input.js';
import enterEvent from './keyboard/enter-event.js';
import deleteEvent from './keyboard/delete-event.js';
import tabEvent from './keyboard/tab-event.js';
import arrowHorizontalEvent from './keyboard/arrow-horizontal.js';
import arrowVerticalEvent from './keyboard/arrow-vertical.js';

import mouseInputEvent from './mouse/mouse-input.js';

import helpers from './helper/helper-functions.js';
import selection from './helper/selection.js';

import computedProps from './helper/computed-properties.js';

import lineSaving from './extras/by-line-saving.js';
import languageIdentification from './extras/text-language-identification.js';
import lineTiming from './extras/line-timing.js';
import textPrediction from './extras/text-prediction.js';
import spelling from './extras/spelling.js';

import copyPaste from './shortcuts/copy-paste.js';
import undo from './shortcuts/undo.js';
import expletive from './shortcuts/expletive.js';
import bold from './shortcuts/bold.js';
import unknown from './shortcuts/unknown.js';

export default {
  name: 'text-editor',
  props: {
    maxLineLength: {
      type: Number,
      default: 64,
    },
    showHints: {
      default: false,
    },
    focus: {
      default: true,
    },
    phraseBreakType: {
      type: String,
      default: 'Sentence',
    },
    searchable: {
      default: true,
    },
  },
  data() {
    return {
      editorArray: [[' ']],
      displayArray: [],
      selectedId: '0-0-1',
      target: null,
      targetLine: null,
      editLocation: { line: 0, word: 0, letter: 0 },
      selection: [],
      selecting: false,
      selectionLocation: {
        start: { line: 0, word: 0, letter: 0 },
        end: { line: 0, word: 0, letter: 0 },
      },
      letterStartSelectBk: Number(),
      temp: '',
      lineEnded: 0,
      lineStarted: 0,
      predictText: this.showHints,
      topVisLine: 0,
      bottomVisLine: 5,
      searchArray: [],
    };
  },
  mixins: [
    computedProps,
    helpers,
    logKeyboard,
    enterEvent,
    deleteEvent,
    arrowHorizontalEvent,
    arrowVerticalEvent,
    mouseInputEvent,
    selection,
    lineSaving,
    languageIdentification,
    lineTiming,
    textPrediction,
    tabEvent,
    copyPaste,
    spelling,
    undo,
    unknown,
    bold,
    expletive,
  ],
  computed: {},
  methods: {
    mmfocus(index) {
      const word = this.editorArray[index].length - 1;
      const letter = this.editorArray[index][word].length;
      this.updateData(index, word, letter);
    },
    searching(array) {
      this.searchArray = array;
      if (array.length == 0) {
        const line = this.editLocation.line;
        const word = this.editLocation.word;
        const letter = this.editLocation.letter;
        let newId = String(line + '-' + word + '-' + letter);
        process.nextTick(() => {
          this.selectedId = newId;
          document.getElementsByName('hidden-editor-input')[0].focus();
        });
      } else {
        this.selectedId = null;
      }
    },
    isSearchReult(line, word) {
      if (this.searchArray[line]) {
        if (this.searchArray[line][word]) {
          return true;
        }
      }
      return false;
    },
    isCursorLoc(line, word, letter) {
      if (this.selectedId == line + '-' + word + '-' + letter) {
        return true;
      }
      return false;
    },
    changeFocus() {
      this.selectedId = null;
    },
  },
  watch: {
    targetLocation(newStuff) {
      this.temp = newStuff;
      _.debounce(() => {
        // TODO: Figure out what this is doing
        console.log(newStuff);
        // document.getElementById(newStuff).focus();
      }, 50);
    },
    currentLine(newTarget) {
      if (newTarget != this.targetLine) {
        this.lineEnded = this.targetLine;
        this.targetLine = newTarget;
      }
    },
    phraseObject(data) {
      this.$emit('edited', data);
    },
  },
  components: {
    'mini-map': miniMap,
    'search-bar': searchBar,
    'hidden-editor': hiddenEditor,
    'display-letter': displayLetter,
  },
  mounted() {
    this.setEditorView();

    if (!this.focus) {
      this.changeFocus();
    }

    if (this.canCopy) {
      document.addEventListener('copy', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        this.copy();
      });
    }
    if (this.canCut) {
      document.addEventListener('cut', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        this.cut();
      });
    }
    // if (this.canCopyLine) {
    //   document.addEventListener("copyLine", ev => {
    //     ev.preventDefault();
    //     ev.stopPropagation();
    //     this.copy();
    //   });
    // }
    if (this.canPaste) {
      document.addEventListener('paste', ev => {
        ev.preventDefault();
        ev.stopPropagation();
        this.paste();
      });
    }

    document.addEventListener('keydown', ev => {
      if (ev.metaKey && ev.key == 'z') {
        this.undo();
      } else if (ev.metaKey && ev.key == 'y') {
        this.redo();
        ev.preventDefault();
        ev.stopPropagation();
      }
    });
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css?family=Rubik:300,300i,400,500,500i,700,900');

@keyframes blink {
  0% {
    border-left: 0.05rem solid rgba(1, 1, 1, 1)
  }
  50% {
    border-left: 0.05rem solid rgba(1, 1, 1, 0)
  }
  75% {
    border-left: 0.05rem solid rgba(0, 0, 0, 0)
  }
  100% {
    border-left: 0.05rem solid rgba(1, 1, 1, 1)
  }
}

cutout()
  $emval_1 = calc((33px - 1em) + 1em)
  $emval_2 = calc((36px - 1em) + 1em)
  $emval_3 = calc((39px - 1em) + 1em)

  $curval_1 = calc((3px - 1em) + 1em)
  $curval_2 = calc((1px - 1em) + 1em)

  clip-path: polygon(
    100% 0,
    100% "calc(100% - %s)" % $emval_3,
    "calc(100% - %s)" % $curval_2 "calc(100% - %s)" % $emval_2,
    "calc(100% - %s)" % $curval_1 "calc(100% - %s)" % $emval_1,
    "calc(100% - %s)" % $emval_1 "calc(100% - %s)" % $curval_1,
    "calc(100% - %s)" % $emval_2 "calc(100% - %s)" % $curval_2,
    "calc(100% - %s)" % $emval_3 100%,
    0 100%,
    0 0
  );

// <------- *** -------> //
#container
  display: flex
  flex-direction: column
.editor
  width: 100%
  height: 100%
  padding: 0 1rem 0 1rem
  user-select: none
  box-sizing: border-box
  display: flex
  flex-direction: column
  #edit-container
    display: flex
    flex-direction: row-reverse
    width: 100%
    height: 100%
    justify-content: flex-start
  .menu-bar
    width: 100%
    height: 1.5rem
    margin: 0 auto
    background-color: #435258
    position: relative;
    display: flex;
    flex-direction: row;
    border-top-left-radius: 6px
    border-top-right-radius: 6px
    #menu
      width: auto
      height: 100%
      line-height: 1.5rem
      padding: 0 1.5rem 0 .5rem
      display: inline-flex
      justify-content: flex-start
      text-align: center
      font-size: .8rem
      color: #E4E9EF
      font-weight: bold
      background-color: rgba(52, 69, 119, 0.5)
    .menu-item
      width: auto
      height: 100%
      line-height: 1.5rem
      cursor: pointer
      padding: 0 .5rem
      display: inline-flex
      justify-content: flex-start
      text-align: center
      font-size: .7rem
      color: #E4E9EF
      font-weight: bold
      background-color: rgba(7, 11, 14,.1)
      &:hover
        box-shadow: inset 0px 0px 2px 1px rgba(175, 194, 226, 0.08)
      &:active
        box-shadow: inset 1px 1px 2px 1px rgba(39, 41, 46, 0.41)
    .selected-item
      background-color: rgba(7, 11, 14, 0.36)
  .edit-content
    text-align: left
    outline: none
    height: auto
    width: 100%
    // min-height: 10rem
    overflow-x: hidden
    overflow-y: auto
    background-color: #fcfcff
    padding: .5rem 0 2rem
    margin: 0 auto
    border-bottom-right-radius: 6px
    border-bottom-left-radius: 6px
    border-top-left-radius: 6px
    box-shadow: inset 0 1px 7px 0 rgba(0, 0, 0, 0.3)
    scroll-behavior: smooth

    cutout()
    > div:focus
      background-color: #FFF
    .display-line
      width: 100%
      height: 1.4rem
      vertical-align: baseline
      text-align: left
      line-height: 1.4rem
      margin: 0
      white-space: nowrap
      position: relative
      display: flex
      justify-content: flex-start
    .focused-line
      // background-color: rgba(#dfe0e8, 0.36)
      border-radius: 3px
    .display-word, .display-letter
      display: inline-block
      vertical-align: top
      width: auto
      height: 1.4rem
      line-height: 1.4rem
      font-size: 1rem
      margin: 0
    .display-word
      flex: 0
      display: flex
    .unknown-word
      background-image: url("../../assets/img/q-mark.svg")
      background-size: 1rem 1rem
      background-repeat: no-repeat
      background-position: left center
      width: 1.4rem
      min-width: 1.2rem
      height: 1.4rem
      display: flex
      > div
        display: none
    .explicit-word
      background-image: url("../../assets/img/explicative-icn.svg")
      background-size: 1rem 1rem
      background-repeat: no-repeat
      background-position: left center
      width: 1.4rem
      min-width: 1.2rem
      height: 1.4rem
      display: flex
      > div
        display: none
    .bold-word
      div.display-letter
        font-weight: 700

    .first-word-of-line
      text-transform: uppercase
    .display-letter
      font-size: .85rem
      font-family: 'Rubik', sans-serif
      font-weight: 400
      color: #2F374B
    .display-letter.cursor
      margin: 0 0 0 -0.05rem
    .end-space
      width: .21rem
      height: 1.4rem
    .cursor
      border-left: 0.025rem solid #616c82
      outline: none
      box-sizing: border-box

      animation-name: blink
      animation-duration: 1s
      animation-iteration-count: infinite
      animation-timing-function: linear
      .suggestion
        display: flex
        flex-direction: row
        font-size: .85rem
        font-family: 'Rubik', sans-serif
        font-weight: 400
        color: rgba(#2f374b, 0.6)
      .guess-needs-space
        margin-left: .24rem
    .spacer
      display: inline-flex
      flex: 1
      justify-content: flex-end
      .display-lang
        color: #eaf1f5
        background: #1f5d61
        padding: 0 .5rem
        font-size: .6rem
        line-height: 1rem
        text-transform: capitalize
        border-radius: 3px
        margin: .2rem .5rem
        height: 1rem
        vertical-align: middle
    .front-spacer
      width: 1rem
      display: inline-block
      overflow-x: hidden
    .lang-disp-out
      width: 6rem
      margin-left: -5rem
    .selected-letter
      background-color: rgba(193, 204, 230, 0.82)
    .empty-paragraph
      width: 0
      margin-left: -0.025rem
      user-select: none
      box-sizing: border-box
    .miss-spell
      font-weight: 400
      color: #FF6545
      cursor: pointer
      box-sizing: border-box
      border-bottom: 0.1rem solid #FF6545
    .line-problem
      background-color: rgba(255, 101, 69, 0.1)
    .seach-highlight
      background-color: #f8fad2
      color: rgb(21, 72, 94)
    .pop-box
      position: relative
      top: 1.5rem
      z-index: 2
      left: -100%
      .popover
        background: #FBFDFF
        box-shadow: 0 2px 7px 0 rgba(0,0,0,0.10)
        border-radius: 3px
        position: absolute
        padding: .5rem
        h5, h6
          margin: .4rem .2rem
          display: flex
          font-family: rubik
        h5
          letter-spacing: .05rem
          font-size: .8rem
          font-weight: 500
        h6
          font-weight: 400
          margin-left: .4rem
          color: rgb(84, 104, 119)
          cursor: pointer
          z-index: 2
        .fills
          display: flex
          flex-direction: column
          margin: .4rem .2rem
          h5, h6
            margin-top: 0
            margin-bottom: 0
            padding: 0 .5rem
          h6
            color: rgb(60, 109, 193)
            font-style: oblique
          .selected-suggestion
            color: #2f374b
            background-color: rgba(48, 92, 167, 0.1)

</style>
