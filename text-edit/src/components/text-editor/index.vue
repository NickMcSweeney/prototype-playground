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
      </div>
    </div>
  </div>
</template>

<script>
// import logKeyboard from "./keyboard/keyboard-input.js";
// import enterEvent from "./keyboard/enter-event.js";
// import deleteEvent from "./keyboard/delete-event.js";
// import arrowHorizontalEvent from "./keyboard/arrow-horizontal.js";
// import arrowVerticalEvent from "./keyboard/arrow-vertical.js";
//
import mouseInputEvent from "./mouse/mouse-input.js";
// import mouseOver from "./mouse/mouse-over.js";
//
import helpers from "./helper/helper-functions.js";
//
// import computedProps from "./helper/computed-properties.js";

export default {
  name: "textEditor",
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
  computed: {
    // currentWord: computedProps.currentWord,
    // currentLine: computedProps.currentLine,
    // singleSelection: computedProps.singleSelection,
    // targetLocation: computedProps.targetLocation,
    // endOfLastLine: computedProps.endOfLastLine,
  },
  methods: {
    // logKeyboard,
    // enterEvent,
    // deleteEvent,
    // arrowHorizontal: arrowHorizontalEvent.arrowHorizontal,
    // selectHorizontal: arrowHorizontalEvent.selectHorizontal,
    // arrowVertical: arrowVerticalEvent,
    //
    // mouseOver,
    mouseOutOfBounds: mouseInputEvent.mouseOutOfBounds,
    // logMouse: mouseInputEvent.logMouse,
    // mouseDown: mouseInputEvent.mouseDown,
    // mouseUp: mouseInputEvent.mouseUp,
    // selectWord: mouseInputEvent.selectWord,
    // selectLine: mouseInputEvent.selectLine,
    //
    isLineFocused: helpers.isLineFocused,
  },
  watch: {
    targetLocation(newStuff) {
      this.temp = newStuff;
      _.debounce(() => {
        document.getElementById(newStuff).focus();
      }, 50);
    },
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
