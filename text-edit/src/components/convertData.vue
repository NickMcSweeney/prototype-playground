<template>
<div class="editor" align="middle">
  <div class="btn-bar">
    <input v-model="line">
    <div class="guess" v-for="(guess, index) in bigram" v-if="index < 5">{{ guess.value }}</div>
  </div>
  <div class="display-box">
    <div v-for="line in pairData">
      {{ line.value[0] }} {{ line.value[1] }}: {{ line.occurance }},
    </div>
  </div>
</div>
</template>

<script>
const theData = require("../assets/lyrics.json");
export default {
  name: "convertData",
  data() {
    return {
      dataInput: theData,
      dataOutput: [],
      availableWords: [],
      availableWordPairs: [],
      availableWordTripples: [],
      wordData: [],
      pairData: [],
      trippleData: {},
      line: "",
    };
  },
  computed: {
    unigram() {
      let temp = [];
      if (this.line === "") return temp;
      let breakLine = this.line.toLowerCase();
      if (breakLine.indexOf(" ") > -1) {
        breakLine = breakLine.slice(breakLine.lastIndexOf(" ")).trim();
      }
      let lineArray = breakLine.split("");
      this.wordData.forEach(item => {
        let word = item.value;
        let checkWord = true;

        let wordArray = word.split("");
        lineArray.forEach((letter, index) => {
          if (letter !== wordArray[index]) {
            checkWord = false;
          }
        });
        if (checkWord)
          temp.push({
            value: word,
            occurance: item.occurance,
          });
      });
      temp = this.sortWordList(temp);
      return temp;
    },
    bigram() {
      let temp = [];
      if (this.line === "") return temp;

      let breakLine = this.line.toLowerCase();
      let tempArray = [];

      if (breakLine.indexOf(" ") > -1) {
        temp = [];
        let tempBreakLine = breakLine.slice(breakLine.lastIndexOf(" ")).trim();
        let rest = breakLine.slice(0, breakLine.lastIndexOf(" "));
        if (rest.indexOf(" ") > -1) {
          tempArray.push(rest.slice(rest.lastIndexOf(" ")).trim());
          tempArray.push(tempBreakLine);
          breakLine = rest.slice(rest.lastIndexOf(" ")).trim() + " " + tempBreakLine;
        } else {
          tempArray.push(rest.trim());
          tempArray.push(tempBreakLine);
          breakLine = rest.trim() + " " + tempBreakLine;
        }
        this.pairData.forEach(item => {
          let pair = item.value;
          let checkWord = true;
          if (pair[0] !== tempArray[0]) {
            return;
          }
          let lineArray = tempArray[1].split("");
          let wordArray = pair[1].split("");
          lineArray.forEach((letter, index) => {
            if (letter !== wordArray[index]) {
              checkWord = false;
            }
          });
          if (checkWord) {
            temp.push({
              value: pair[1],
              occurance: item.occurance,
            });
          }
        });
      } else {
        temp = [];
        this.wordData.forEach(item => {
          let word = item.value;
          let checkWord = true;
          let lineArray = breakLine.split("");
          let wordArray = word.split("");
          lineArray.forEach((letter, index) => {
            if (letter !== wordArray[index]) {
              checkWord = false;
            }
          });
          if (checkWord) {
            temp.push({
              value: word,
              occurance: item.occurance,
            });
          }
        });
      }
      temp = this.sortWordList(temp);
      if (temp.length < 5 && breakLine.indexOf(" ") > -1) {
        let fill = [];
        this.wordData.forEach(item => {
          let word = item.value;
          let checkWord = true;
          let lineArray = breakLine.slice(breakLine.lastIndexOf(" ")).trim().split("");
          let wordArray = word.split("");
          lineArray.forEach((letter, index) => {
            if (letter !== wordArray[index]) {
              checkWord = false;
            }
          });
          if (checkWord) {
            fill.push({
              value: word,
              occurance: item.occurance,
            });
          }
        });
        fill = this.sortWordList(fill);
        for (var i = 0; i < 5; i++) {
          temp.push(fill[i]);
        }
      }
      return temp;
    },
  },
  methods: {
    sortWordList(list) {
      list = list.sort((foo, bar) => {
        return foo.occurance - bar.occurance;
      });
      list = list.reverse();
      return list;
    },
    cleanAll() {
      this.cleanData(".");
      this.cleanData(",");
      this.cleanData("(");
      this.cleanData(")");
      this.cleanData("!");
      this.cleanData("?");
      console.log("CLEANED UP DATA");
    },
    cleanData(char) {
      const dataIn = this.dataInput.Lyrics;
      let newData = [];
      dataIn.forEach((phrase, index) => {
        let temp = "";
        let loc = phrase.indexOf(char);
        while (loc > -1) {
          // console.log("1-> ", phrase.slice(0, loc), "2-> ", phrase.slice(loc + 1));
          let locNext = parseInt(loc) + 1;
          temp = String(phrase.slice(0, loc)) + String(phrase.slice(locNext));
          phrase = temp;
          loc = phrase.indexOf(char);
        }
        newData.push(phrase);
      });
      this.dataInput.Lyrics = newData;
    },
    parseArray() {
      const dataIn = this.dataInput.Lyrics;
      dataIn.forEach((phrase, index) => {
        let temp = [];
        let loc = phrase.indexOf(" ");
        while (loc > -1) {
          temp.push(String(phrase.slice(0, loc)).toLowerCase());
          phrase = phrase.slice(loc + 1);
          loc = phrase.indexOf(" ");
        }
        temp.push(String(phrase).toLowerCase());
        this.dataOutput.push(temp);
      });
      console.log("DATA SPLIT");
    },
    setAvailableWords() {
      const TotalWords = this.dataOutput;
      let tempAvailableWords = [];
      TotalWords.forEach(phrase => {
        phrase.forEach(word => {
          if (!tempAvailableWords.includes(word)) {
            tempAvailableWords.push(word);
          }
        });
      });
      this.availableWords = tempAvailableWords;
    },
    setAvailableDoubleWords() {
      const TotalWords = this.dataOutput;
      let tempAvailableWords = [];
      TotalWords.forEach(phrase => {
        let phraseLength = phrase.length;
        let n = 0;
        while (n + 1 < phraseLength) {
          let temp = [];
          temp.push(phrase[n]);
          temp.push(phrase[n + 1]);
          let validate = true;
          tempAvailableWords.forEach(pair => {
            if (pair[0] === temp[0] && pair[1] === temp[1]) {
              validate = false;
            }
          });
          if (validate) {
            tempAvailableWords.push(temp);
            // console.log("TEMP: ", temp);
          }
          n++;
        }
      });
      this.availableWordPairs = tempAvailableWords;
    },
    setAvailableTrippleWords() {
      const TotalWords = this.dataOutput;
      let tempAvailableWords = [];
      TotalWords.forEach(phrase => {
        let phraseLength = phrase.length;
        let n = 0;
        while (n + 2 < phraseLength) {
          let temp = [];
          temp.push(phrase[n]);
          temp.push(phrase[n + 1]);
          temp.push(phrase[n + 2]);
          let validate = true;
          tempAvailableWords.forEach(tripple => {
            if (tripple[0] === temp[0] && tripple[1] === temp[1] && tripple[2] === temp[2]) {
              validate = false;
            }
          });
          if (validate) {
            tempAvailableWords.push(temp);
            // console.log("TEMP: ", temp);
          }
          n++;
        }
      });
      this.availableWordTripples = tempAvailableWords;
    },
    singleWordOccurance() {
      const TotalWords = this.dataOutput;
      const availableWords = this.availableWords;
      availableWords.forEach(word => {
        let temp = 0;
        TotalWords.forEach(phrase => {
          phrase.forEach(trackWord => {
            if (word === trackWord) {
              temp++;
            }
          });
        });
        this.wordData.push({
          value: word,
          occurance: temp,
        });
      });
    },
    doubleWordOccurance() {
      const TotalWords = this.dataOutput;
      const availableWords = this.availableWordPairs;
      availableWords.forEach((pair, index) => {
        let count = 0;
        TotalWords.forEach(phrase => {
          let phraseLength = phrase.length;
          let n = 0;
          while (n + 1 < phraseLength) {
            let temp = [];
            temp.push(phrase[n]);
            temp.push(phrase[n + 1]);
            if (pair[0] === temp[0] && pair[1] === temp[1]) {
              count++;
            }
            n++;
          }
        });

        if (count > 0) {
          this.pairData.push({
            value: [pair[0], pair[1]],
            occurance: count,
          });
        }
      });
    },
    trippleWordOccurance() {
      const TotalWords = this.dataOutput;
      const availableWords = this.availableWordTripples;
      availableWords.forEach((tripple, index) => {
        let count = 0;
        TotalWords.forEach(phrase => {
          let phraseLength = phrase.length;
          let n = 0;
          while (n + 2 < phraseLength) {
            let temp = [];
            temp.push(phrase[n]);
            temp.push(phrase[n + 1]);
            temp.push(phrase[n + 2]);
            if (tripple[0] === temp[0] && tripple[1] === temp[1] && tripple[2] === temp[2]) {
              count++;
            }
            n++;
          }
        });
        if (count > 1) {
          this.trippleData[index] = {
            tripple: tripple[0] + " " + tripple[1] + " " + tripple[2],
            occurance: count,
          };
        }
      });
    },
  },
  mounted() {
    this.cleanAll();
    this.parseArray();
    this.setAvailableWords();
    this.singleWordOccurance();
    this.setAvailableDoubleWords();
    this.doubleWordOccurance();
    // this.setAvailableTrippleWords();
    // this.trippleWordOccurance();
    this.wordData = this.sortWordList(this.wordData);
    this.pairData = this.sortWordList(this.pairData);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  width: 100%;
  height: 100%;
  margin: 0;
}

.edit-box {
  width: 600px;
  height: 400px;
  background: #e6e8e9;
  border-radius: 3px;
  padding: 20px;
  overflow-y: scroll;
}

.edit-content {
  text-align: left;
  outline: none;
  height: 100%;
}
.edit-content > div:focus {
  color: red;
}

.display-box {
  width: 600px;
  height: 600px;
  background: #e6e8e9;
  border-radius: 3px;
  padding: 20px;
  margin-top: 50px;
  overflow-y: scroll;
}

.btn-bar {
  margin-top: 20px;
  margin-bottom: 20px;
}
.btn-bar input {
  padding: 10px;
  border-radius: 3px;
  border: none;
  background-color: #FFF;
  outline: none;
}
.guess {
  width: 400px;
  min-height: 20px;
  border-radius: 2px;
  background-color: #24252e;
  color: #f1f7f7;
  margin-top: 10px;
}
</style>
