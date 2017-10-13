"use strict";

export default {
  data() {
    return {
      unknownWordArray: [],
    };
  },
  props: {},
  computed: {},
  methods: {
    setUnknown() {
      const location = this.editLocation;
      const text = this.editorArray;

      let line = location.line;
      let word = location.word;
      let letter = location.letter;
      this.unknownWordArray.push({ line, word, letter });
      this.editorArray[line].splice(word, 1, "[???]");
      word++;
      this.editorArray[line].splice(word, 0, "");
      letter = 0;
      this.updateData(line, word, letter);
    },
    isUnknown(lineIndex, wordIndex) {
      let isMatch = false;
      this.unknownWordArray.forEach(item => {
        if (item.line == lineIndex && item.word == wordIndex) {
          isMatch = true;
        }
      });
      return isMatch;
    },
  },
  watch: {},
};
