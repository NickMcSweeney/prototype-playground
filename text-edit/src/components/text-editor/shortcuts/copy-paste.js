

export default {
  data() {
    return {
      copiedLine: [],
    };
  },
  props: {
    canCopy: {
      default: true,
    },
    canPaste: {
      default: true,
    },
    canCut: {
      default: true,
    },
  },
  computed: {},
  methods: {
    copy() {
      const index = this.FocusedLine;
      const newLine = this.editorArray[index];
      this.copiedLine = [];
      if (this.selection && this.selection[0]) {
        this.selection.forEach((line) => {
          this.copiedLine.push(_.cloneDeep(line));
        });
      }
    },
    cut() {
      const index = this.FocusedLine;
      const newLine = this.editorArray[index];
      this.copiedLine = [];
      if (this.selection && this.selection[0]) {
        this.selection.forEach((line) => {
          this.copiedLine.push(_.cloneDeep(line));
        });
        this.clearSelection();
      }
    },
    copyLine() {
      const index = this.FocusedLine;
      const newLine = this.editorArray[index];
      this.copiedLine = [];

      this.copiedLine.push(_.cloneDeep(newLine));
    },
    paste() {
      if (this.copiedLine && this.copiedLine[0]) {
        const refLine = this.editLocation.line;
        let word = this.editLocation.word;
        let n = word;
        let letter = this.editLocation.letter;
        this.copiedLine.forEach((phrase, key) => {
          const line = refLine + key;
          if (key == 0) {
            if (this.phraseObject.length - 1 == this.target) {
              // this.endTime.splice(line, 0, new Date().getTime() / 1000);
            } else {
              // this.endTime.splice(line, 1, new Date().getTime() / 1000);
            }
            phrase.forEach((segment) => {
              if (this.editorArray[line][n] == ' ' || this.editorArray[line][n] == '\n') {
                this.editorArray[line].splice(n, 1, segment);
                n++;
              } else if (n == word) {
                const first = this.editorArray[line][word].slice(0, letter);
                const second = this.editorArray[line][word].slice(letter);
                if (second != '' && second != '\n' && second != ' ') {
                  if (first != '' && first != '\n' && first != ' ') {
                    this.editorArray[line].splice(word, 1, second);
                    this.editorArray[line].splice(n, 0, segment);
                    this.editorArray[line].splice(word, 0, first);
                    n++;
                  } else {
                    this.editorArray[line].splice(n, 1, second);
                    this.editorArray[line].splice(n, 0, segment);
                  }
                } else if (first != '' && first != '\n' && first != ' ') {
                  n++;
                  this.editorArray[line].splice(n, 0, segment);
                } else {
                  this.editorArray[line].splice(n, 1, segment);
                }
                n++;
              } else {
                this.editorArray[line].splice(n, 0, segment);
                n++;
              }
            });
          } else {
            this.editorArray.splice(line, 0, phrase);
            // this.startTime.splice(line, 0, new Date().getTime() / 1000);
            if (key != this.copiedLine.length) {
              // this.endTime.splice(line, 0, new Date().getTime() / 1000);
            }
          }
        });
        let line = refLine;
        if (this.copiedLine.length > 1) {
          line = line + this.copiedLine.length - 1;
          word = this.copiedLine[this.copiedLine.length - 1].length - 1;
          letter = this.copiedLine[this.copiedLine.length - 1][word].length;
          // console.log("paste 1", line, word, letter);
          this.updateData(line, word, letter);
          this.updatePhraseData();
        } else {
          word = this.editorArray[line].length - 1;
          letter = this.editorArray[line][word].length;
          // console.log("paste 2", line, word, letter);
          this.updateData(line, word, letter);
          this.updatePhraseData();
        }
      }
    },
  },
};
