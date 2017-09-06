<template>
  <div class="editor">
    <div class="menu-bar">
      <div id="menu">Menu</div>
      <div class="menu-item" :class="{'selected-item': showLang}" @click.prevent.stop="showLang = !showLang">Language detection</div>
    </div>
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
          <span class="display-lang" v-if="showLang">{{ displayLang(lineIndex) }}</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import logKeyboard from "./keyboard/keyboard-input.js";
import enterEvent from "./keyboard/enter-event.js";
import deleteEvent from "./keyboard/delete-event.js";
import arrowHorizontalEvent from "./keyboard/arrow-horizontal.js";
import arrowVerticalEvent from "./keyboard/arrow-vertical.js";

import mouseInputEvent from "./mouse/mouse-input.js";
import mouseOver from "./mouse/mouse-over.js";

import helpers from "./helper/helper-functions.js";

import computedProps from "./helper/computed-properties.js";

import lineSaving from "./extras/by-line-saving.js";
import languageIdentification from "./extras/text-language-identification.js";

export default {
  name: "textEditor",
  data() {
    return {
      editMe: -1,
      editorArray: [[" "]],
      displayArray: [],
      target: 0,
      targetLine: 0,
      editLocation: { line: 0, word: 0, letter: 0 },
      selection: [],
      selecting: false,
      selectionLocation: {
        start: { line: 0, word: 0, letter: 0 },
        end: { line: 0, word: 0, letter: 0 },
      },
      letterStartSelectBk: Number(),
      temp: "",
      showLang: false,
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
    mouseOver,
    lineSaving,
    languageIdentification,
  ],
  computed: {},
  methods: {},
  watch: {
    targetLocation(newStuff) {
      this.temp = newStuff;
      _.debounce(() => {
        document.getElementById(newStuff).focus();
      }, 50);
    },
    currentLine(newTarget) {
      if (newTarget != this.targetLine) {
        this.targetLine = newTarget;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
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

.editor
  width: 100%
  height: 100%
  margin: 1rem auto
  padding: 0 1rem 0 1rem
  user-select: none
  box-sizing: border-box
  .menu-bar
    width: auto
    height: 1.5rem
    margin: 0 auto
    background-color: #2d393e
    position: relative;
    display: flex;
    border-top-left-radius: 4px
    border-top-right-radius: 4px
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
    height: 100%
    min-height: 30rem
    width: auto
    overflow-x: hidden
    overflow-y: auto
    background-color: #E4E9EF
    padding: .5rem 0 .8rem
    margin: 0 auto
    border-bottom-left-radius: 5px
    border-bottom-right-radius: 5px
    > div:focus
      background-color: #FFF
    .display-line
      width: 100%
      height: 1.5rem
      vertical-align: baseline
      text-align: left
      line-height: 1.5rem
      margin: .25rem 0
      white-space: nowrap
      position: relative
      display: flex
      justify-content: flex-start
    .focused-line
      background-color: rgba(213, 216, 223, 0.36)
    .display-word, .display-letter
      display: inline-block
      vertical-align: top
      width: auto
      height: 1.5rem
      line-height: 1.5rem
      margin: 0

    .display-word
      flex: 0
      display: flex

    .first-word-of-line
      text-transform: uppercase
    .display-letter:focus
      border-left: 0.05rem solid black
      outline: none
      margin-left: -0.05rem
      // box-sizing: border-box

      animation-name: blink
      animation-duration: 1.25s
      animation-iteration-count: infinite
      animation-timing-function: linear
    .end-space
      width: .3rem
      margin: 0
      padding: .03rem 0
      height: 1.44rem
      &:focus
        border-left: 0.05rem solid black
        outline: none
        width: .25rem

        animation-name: blink
        animation-duration: 1.25s
        animation-iteration-count: infinite
        animation-timing-function: linear
    .spacer
      display: inline-flex
      flex: 1
      justify-content: flex-end
      .display-lang
        color: #eaf1f5
        background: #1f5d61
        padding: 0 .5rem
        font-size: .8rem
        text-transform: capitalize
        border-radius: 3px
        margin-right: .5rem
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
</style>
