<template>
  <div
    class="display-letter"
    :class="{
      'seach-highlight': search,
      'miss-spell': isMissSpelled,
      'first-word-of-line': capitalization,
      'cursor': cursorPosition,
      'selected-letter': selection,
      'empty-paragraph': letter == '\n'
    }"
    :id="lineIndex+'-'+wordIndex+'-'+letterIndex"
    @mousedown.stop.prevent="$emit('mousedown', $event)"
    @mouseup.stop.prevent="$emit('mouseup', $event)"
    @mouseover="$emit('mouseover', $event)"
  >
    {{ letter }}
  </div>
</template>

<script>
export default {
  name: "display-letter",
  data() {
    return {
    };
  },
  props: {
    letter: {
      required: true,
    },
    lineIndex: {
      required: true,
    },
    wordIndex: {
      required: true,
    },
    letterIndex: {
      required: true,
    },
    search: {
      required: true,
    },
    spelling: {
      required: true,
    },
    capitalization: {
      required: true,
    },
    cursorPosition: {
      required: true,
    },
    selection: {
      required: true,
    },
    currentLocation: {
      required: true,
    }
  },
  computed: {
    isMissSpelled() {
      if (this.currentLocation.line == this.lineIndex && this.currentLocation.word == this.wordIndex) {
        return false
      } else if(_.indexOf(this.spelling, this.wordId) >= 0){
        return true
      }
      return false
    },
    wordId() {
      const line = _.padStart(_.toString(this.lineIndex), 4, "0");
      const word = _.padStart(_.toString(this.wordIndex), 2, "0");
      const id = line + word;
      return id
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.display-letter
  font-size: .85rem
  font-family: 'Rubik', sans-serif
  font-weight: 400
  color: #2F374B
.first-word-of-line
  text-transform: uppercase
.cursor
  margin: 0 0 0 -0.05rem
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
.seach-highlight
  background-color: #f8fad2
  color: rgb(21, 72, 94)
</style>
