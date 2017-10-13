

export default {
  data() {
    return {
      historyArray: [[[""]]],
      historyPhraseArray: [],
      futureArray: [],
      futurePhraseArray: [],
      undoing: false,
    };
  },
  props: {
    canUndo: {
      default: false,
    },
    canRedo: {
      default: false,
    },
  },
  computed: {},
  methods: {
    undo() {
      if (this.historyArray.length > 0) {
        this.undoing = true;
        const oldData = _.cloneDeep(this.editorArray);
        let newData = _.cloneDeep(this.historyArray.pop());
        console.log(newData);
        if (_.isEqual(oldData, newData) && this.historyArray.length > 0) {
          newData = _.cloneDeep(this.historyArray.pop());
          console.log("NEXT!");
        }
        console.log(newData);
        this.editorArray = [];
        this.stashFuture(oldData);
        this.editorArray = newData;
        process.nextTick(() => {
          const line = this.editorArray.length - 1;
          const word = this.editorArray[line].length - 1;
          const letter = this.editorArray[line][word].length;
          this.updateData(line, word, letter);
          document.getElementsByName("hidden-editor-input")[0].focus();
          this.undoing = false;
        });
      }
    },
    redo() {
      // TODO: change to cmd + shift + z
      if (this.futureArray.length > 0) {
        const oldData = _.cloneDeep(this.editorArray);
        const newData = _.cloneDeep(this.futureArray.pop());
        this.editorArray = [];
        this.stashHistory(oldData);
        this.editorArray = newData;
        process.nextTick(() => {
          this.selectedId = this.endOfLastLine;
          document.getElementsByName("hidden-editor-input")[0].focus();
          // document.getElementById(this.endOfLastLine).focus();
        });
      }
    },
    stashHistory: _.debounce(function _stashHistory(array) {
      const myArray = _.cloneDeep(array);
      this.historyArray.push(myArray);
    }, 300),
    stashFuture(array) {
      const myArray = _.cloneDeep(array);
      this.futureArray.push(myArray);
    },
    stashPhraseHistory: _.debounce(function _stashPhraseHistory(array) {
      const myArray = _.cloneDeep(array);
      this.historyPhraseArray.push(myArray);
    }, 300),
    stashPhraseFuture(array) {
      const myArray = _.cloneDeep(array);
      this.futurePhraseArray.push(myArray);
    },
  },
  watch: {
    editorArray() {
      if (!this.undoing) {
        this.stashPhraseHistory(this.phraseObject);
        this.stashHistory(this.editorArray);
      }
    },
  },
};
