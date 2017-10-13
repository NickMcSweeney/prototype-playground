

export default {
  data() {
    return {
      phraseObject: {},
    };
  },
  methods: {
    updatePhraseArray(phrase) {
      const arr = [];

      const LANG = this.checkLanguage(this.phraseObjToArray(phrase));

      phrase.forEach((segment) => {
        const hasSpellingError = this.checkSegmentSpelling(segment.word, LANG);
        const spIndex = _.indexOf(this.missSpellingArray, segment.id);
        if (hasSpellingError && spIndex === -1) {
          this.missSpellingArray = _.union(this.missSpellingArray, [segment.id]);
        } else if (!hasSpellingError && spIndex !== -1) {
          this.missSpellingArray = _.pull(this.missSpellingArray, segment.id);
        }
        const lineIndex = this.idToCoord(segment.id).line;
        const wordIndex = this.idToCoord(segment.id).word;
        const obj = {
          id: segment.id,
          word: segment.word,
          meta: {
            spelling: hasSpellingError,
            language: LANG,
            formatting: {
              bold: this.isBold(lineIndex, wordIndex),
            },
            specialFlags: {
              unknown: this.isUnknown(lineIndex, wordIndex),
              expletive: this.isExplicit(lineIndex, wordIndex),
            },
          },
        };
        arr.push(obj);
      });
      return arr;
    },
    updatePhraseObj: _.debounce(function _updatePhraseObj() {
      // NOTE: I took the easy solution and throttled this function to only update every 5 seconds
      // even though it is called on every update.
      // NOTE: save data as sentences
      const newPhraseObject = {};
      const dataArray = this.editorArray;
      let newArray = [];
      let endIndex = "000000";
      dataArray.forEach((line, i) => {
        line.forEach((word, j) => {
          const lineIndex = _.padStart(_.toString(i), 4, "0");
          const wordIndex = _.padStart(_.toString(j), 2, "0");
          endIndex = lineIndex + wordIndex;
          const wordObj = {
            word,
            id: endIndex,
          };
          if (word.slice(-1) === ".") {
            newArray.push(wordObj);
            newPhraseObject[endIndex] = this.updatePhraseArray(newArray);
            newArray = [];
          } else {
            newArray.push(wordObj);
          }
        });
        if (line[0] !== "\n") newArray.push({ id: "NEWLINE", word: "\n" });
      });
      const lineIndex = _.padStart(_.toString(dataArray.length - 1), 4, "0");
      const wordIndex = _.padStart(_.toString(dataArray[dataArray.length - 1].length - 1), 2, "0");
      endIndex = lineIndex + wordIndex;

      newPhraseObject[endIndex] = this.updatePhraseArray(newArray);
      newArray = [];
      this.phraseObject = newPhraseObject;
    }, 500),
    updatePhraseData: _.debounce(function _updatePhraseData() {
      // NOTE: save data as lines

      const newPhraseObject = {};
      const dataArray = this.editorArray;
      let newArray = [];
      let endIndex = "000000";
      try {
        dataArray.forEach((line, i) => {
          // if (i > this.editLocation.line - 3 && i < this.editLocation.line + 3) {
          line.forEach((word, j) => {
            const lineIndex = _.padStart(_.toString(i), 4, "0");
            const wordIndex = _.padStart(_.toString(j), 2, "0");
            endIndex = lineIndex + wordIndex;
            const wordObj = {
              word,
              id: endIndex,
            };
            newArray.push(wordObj);
          });
          if (i === this.editLocation.line) {
            newPhraseObject[endIndex] = this.updatePhraseArray(newArray);
          } else if (this.phraseObject[endIndex]) {
            newPhraseObject[endIndex] = this.phraseObject[endIndex];
          } else {
            newPhraseObject[endIndex] = this.updatePhraseArray(newArray);
          }
          newArray = [];
          // }
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.phraseObject = newPhraseObject;
      }
    }, 30),
  },
};


/*
getTimestamp(newLine) {
  let tempTime = 0;
  if (newLine.length - 1 != this.staticArrayLength) {
    this.lineStarted = this.target;
    tempTime = new Date().getTime() / 1000;
    this.staticArrayLength = _.clone(newLine.length - 1);
  }
  return tempTime;
},
firstDataObj(line, index) {
  const obj = {
    id: index,
    line,
    meta: {
      snapTiming: this.snapTiming * Math.random(),
      language: this.displayLang(index),
      endTime: 0,
      startTime: new Date().getTime() / 1000,
    },
  };
  this.phraseArray.splice(index, 1, obj);
},
createDataObj(line, index) {
  const obj = {
    id: index,
    line,
    meta: {
      snapTiming: this.snapTiming * Math.random(),
      language: this.displayLang(index),
      endTime: 0,
      startTime: this.getTimestamp(line),
    },
  };
  this.phraseArray.splice(index, 0, obj);
},
updateDataObj(line, index) {
  const obj = {
    id: index,
    line,
    meta: {
      snapTiming: this.phraseArray[index].meta.snapTiming,
      language: this.displayLang(index),
      endTime: this.phraseArray[index].meta.endTime,
      startTime: this.phraseArray[index].meta.startTime,
    },
  };
  this.phraseArray.splice(index, 1, obj);
},
*/
