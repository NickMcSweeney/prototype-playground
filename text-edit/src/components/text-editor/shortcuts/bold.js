"use strict";

export default {
  data() {
    return {
      boldWordArray: [],
    };
  },
  props: {},
  computed: {},
  methods: {
    setBold() {
      const location = this.editLocation;
      const text = this.editorArray;

      let line = location.line;
      let word = location.word;
      let letter = location.letter;
      this.boldWordArray.push({ line, word, letter });
    },
    isBold(lineIndex, wordIndex) {
      let isMatch = false;
      this.boldWordArray.forEach(item => {
        if (item.line == lineIndex && item.word == wordIndex) {
          isMatch = true;
        }
      });
      return isMatch;
    },
  },
  watch: {},
};
