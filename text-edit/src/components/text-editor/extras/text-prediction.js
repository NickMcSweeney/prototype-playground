

export default {
  props: {
    predictionSrc: {
      type: Object,
      default() {
        return {
          Text: [
            "And I heard, as it were, the noise of thunder",
            "One of the four beasts saying",
            "Come and see and I saw and behold a white horse",
            "There's a man goin' 'round takin' names",
            "And he decides who to free and who to blame",
            "Everybody won't be treated all the same",
            "There'll be a golden ladder reachin' down",
            "When the man comes around",
            "The hairs on your arm will stand up",
            "At the terror in each sip and in each sup",
            "Will you partake of that last offered cup",
            "Or disappear into the potter's ground?",
            "When the man comes around",
            "Hear the trumpets hear the pipers",
            "One hundred million angels singin'",
            "Multitudes are marchin' to the big kettledrum",
            "Voices callin', voices cryin'",
            "Some are born and some are dyin'",
            "It's alpha and omega's kingdom come",
            "And the whirlwind is in the thorn tree",
          ],
        };
      },
    },
  },
  data() {
    return {
      dataOutput: [],
      availableWords: [],
      availableWordPairs: [],
      availableWordTripples: [],
      wordData: [],
      pairData: [],
      trippleData: [],
      guessNeedsSpace: false,
    };
  },
  computed: {
    // line() {
    //   let line = "";
    //   if (this.editorArray[0][0] == " ") {
    //     return "";
    //   }
    //   this.editorArray[this.FocusedLine].forEach((word) => {
    //     line = `${line} ${word}`;
    //   });
    //   return line;
    // },
    // dataInArray() {
    //   return this.editorArray;
    // },
    // songData() {
    //   return this.line2array();
    // },
    // bestGuess() {
    //   let temp = "";
    //   if (this.possibleLinesArray.length > 0 && this.editorArray[0][0] != " ") {
    //     this.guessNeedsSpace = false;
    //     const pre = this.editorArray[this.FocusedLine];
    //     const guess = this.possibleLinesArray[this.tabNum];
    //     const lineLength = pre.length - 1;
    //     guess.forEach((word, n) => {
    //       if (n > lineLength) {
    //         temp = `${temp + word} `;
    //       } else if (n == lineLength) {
    //         if (
    //           _.lowerCase(word) != _.lowerCase(pre[n]) &&
    //           _.startsWith(_.lowerCase(word), _.lowerCase(pre[n]))
    //         ) {
    //           let tempWord = "";
    //           let i = 0;
    //           while (i < word.length) {
    //             if (pre == "\n") {
    //               tempWord += word[i];
    //             } else if (pre[n].length <= i) {
    //               tempWord += word[i];
    //             }
    //             i++;
    //           }
    //           temp = `${temp + tempWord} `;
    //         } else {
    //           this.guessNeedsSpace = true;
    //         }
    //       } else if (guess.length == 1) {
    //         let tempWord = "";
    //         let i = 0;
    //         while (i < guess[0].length) {
    //           if (pre[lineLength].length <= i) {
    //             tempWord += guess[0][i];
    //           }
    //           i++;
    //         }
    //         temp = `${temp + tempWord} `;
    //       }
    //     });
    //   }
    //   return temp;
    // },
    // possibleLinesArray() {
    //   if (this.editorArray[0][0] == " ") {
    //     return [];
    //   }
    //   let temp = [];
    //   if (this.editLocation.line <= 1) {
    //     temp = this.dataInArray;
    //   } else {
    //     const prevLine = this.editorArray[this.FocusedLine - 1];
    //     const marker = [];
    //     this.dataInArray.forEach((line, n) => {
    //       if (_.isEqual(line, prevLine)) {
    //         marker.push(n + 1);
    //       }
    //     });
    //     marker.forEach((n) => {
    //       temp.push(this.dataInArray[n]);
    //     });
    //   }
    //
    //   temp = this.isContained(temp);
    //
    //   if (temp.length < 3) {
    //     let ret = this.dataInArray;
    //     temp.forEach((match, i) => {
    //       ret = _.filter(ret, n => !_.isMatch(n, temp[i]));
    //     });
    //     ret = this.isContained(ret);
    //     ret.forEach((item) => {
    //       temp.push(item);
    //     });
    //   }
    //
    //   if (this.trigram.length > 0) {
    //     const trigram = this.sortWordList(this.trigram);
    //     trigram.forEach((item) => {
    //       temp.push([item.value]);
    //     });
    //   } else if (this.bigram.length > 0) {
    //     const bigram = this.sortWordList(this.bigram);
    //     bigram.forEach((item) => {
    //         // console.log("B:", this.bigram, item);
    //       temp.push([item.value]);
    //     });
    //   } else if (this.unigram.length > 0) {
    //     const unigram = this.sortWordList(this.unigram);
    //     unigram.forEach((item) => {
    //         // console.log("U:", this.unigram, item);
    //       temp.push([item.value]);
    //     });
    //   }
    //   if (temp.length > 3) {
    //     temp = _.take(temp, 3);
    //   }
    //   return temp;
    // },
    // refLinesArray() {
    //   if (this.editorArray[0][0] == " ") {
    //     return [];
    //   }
    //   let temp = [];
    //   if (this.editLocation.line <= 1) {
    //     temp = this.songData;
    //   } else {
    //     const prevLine = this.editorArray[this.FocusedLine - 1];
    //     const marker = [];
    //     this.songData.forEach((line, n) => {
    //       if (_.isEqual(line, prevLine)) {
    //         marker.push(n + 1);
    //       }
    //     });
    //     marker.forEach((n) => {
    //       temp.push(this.songData[n]);
    //     });
    //   }
    //
    //   temp = this.isContained(temp);
    //
    //   if (temp.length < 3) {
    //     let ret = this.songData;
    //     temp.forEach((match, i) => {
    //       ret = _.filter(ret, n => !_.isMatch(n, temp[i]));
    //     });
    //     ret = this.isContained(ret);
    //     ret.forEach((item) => {
    //       temp.push(item);
    //     });
    //   }
    //   temp = _.take(temp, 3);
    //   return temp;
    // },
    // possibleLines() {
    //   let temp = [];
    //   this.possibleLinesArray.forEach((line) => {
    //     let newLine = "";
    //     line.forEach((word) => {
    //       newLine = `${newLine} ${word}`;
    //     });
    //     temp.push(newLine.trim());
    //   });
    //   temp = _.uniq(temp);
    //   return temp;
    // },
    // refLines() {
    //   let temp = [];
    //   this.refLinesArray.forEach((line) => {
    //     let newLine = "";
    //     line.forEach((word) => {
    //       newLine = `${newLine} ${word}`;
    //     });
    //     temp.push(newLine.trim());
    //   });
    //   temp = _.uniq(temp);
    //   return temp;
    // },
    // unigram() {
    //   let temp = [];
    //   if (this.line === "") return temp;
    //   let breakLine = this.line.toLowerCase();
    //   if (breakLine.indexOf(" ") > -1) {
    //     breakLine = breakLine.slice(breakLine.lastIndexOf(" ")).trim();
    //   }
    //   const lineArray = breakLine.split("");
    //   this.wordData.forEach((item) => {
    //     const word = item.value;
    //     let checkWord = true;
    //
    //     const wordArray = word.split("");
    //     lineArray.forEach((letter, index) => {
    //       if (letter !== wordArray[index]) {
    //         checkWord = false;
    //       }
    //     });
    //     if (checkWord) {
    //       temp.push({
    //         value: word,
    //         occurance: item.occurance,
    //       });
    //     }
    //   });
    //   temp = this.sortWordList(temp);
    //   const ret = [];
    //   temp.forEach((item) => {
    //     if (item != undefined) ret.push(item);
    //   });
    //   return ret;
    // },
    // bigram() {
    //   let temp = [];
    //   if (this.line === "") return temp;
    //
    //   let breakLine = this.line.toLowerCase();
    //   const tempArray = [];
    //
    //   if (breakLine.indexOf(" ") > -1) {
    //     temp = [];
    //     const tempBreakLine = breakLine.slice(breakLine.lastIndexOf(" ")).trim();
    //     const rest = breakLine.slice(0, breakLine.lastIndexOf(" "));
    //     if (rest.indexOf(" ") > -1) {
    //       tempArray.push(rest.slice(rest.lastIndexOf(" ")).trim());
    //       tempArray.push(tempBreakLine);
    //       breakLine = `${rest.slice(rest.lastIndexOf(" ")).trim()} ${tempBreakLine}`;
    //     } else {
    //       tempArray.push(rest.trim());
    //       tempArray.push(tempBreakLine);
    //       breakLine = `${rest.trim()} ${tempBreakLine}`;
    //     }
    //     this.pairData.forEach((item) => {
    //       const pair = item.value;
    //       let checkWord = true;
    //       if (pair[0] !== tempArray[0]) {
    //         return;
    //       }
    //       const lineArray = tempArray[1].split("");
    //       const wordArray = pair[1].split("");
    //       lineArray.forEach((letter, index) => {
    //         if (letter !== wordArray[index]) {
    //           checkWord = false;
    //         }
    //       });
    //       if (checkWord) {
    //         temp.push({
    //           value: pair[1],
    //           occurance: item.occurance,
    //         });
    //       }
    //     });
    //   } else {
    //     temp = [];
    //     this.wordData.forEach((item) => {
    //       const word = item.value;
    //       let checkWord = true;
    //       const lineArray = breakLine.split("");
    //       const wordArray = word.split("");
    //       lineArray.forEach((letter, index) => {
    //         if (letter !== wordArray[index]) {
    //           checkWord = false;
    //         }
    //       });
    //       if (checkWord) {
    //         temp.push({
    //           value: word,
    //           occurance: item.occurance,
    //         });
    //       }
    //     });
    //   }
    //   temp = this.sortWordList(temp);
    //   if (temp.length < 5 && breakLine.indexOf(" ") > -1) {
    //     let fill = [];
    //     this.wordData.forEach((item) => {
    //       const word = item.value;
    //       let checkWord = true;
    //       const lineArray = breakLine
    //         .slice(breakLine.lastIndexOf(" "))
    //         .trim()
    //         .split("");
    //       const wordArray = word.split("");
    //       lineArray.forEach((letter, index) => {
    //         if (letter !== wordArray[index]) {
    //           checkWord = false;
    //         }
    //       });
    //       if (checkWord) {
    //         fill.push({
    //           value: word,
    //           occurance: item.occurance,
    //         });
    //       }
    //     });
    //     fill = this.sortWordList(fill);
    //     for (let i = 0; i < 5; i++) {
    //       temp.push(fill[i]);
    //     }
    //   }
    //   const ret = [];
    //   temp.forEach((item) => {
    //     if (item != undefined) ret.push(item);
    //   });
    //   return ret;
    // },
    // trigram() {
    //   if (this.editLocation.line == 0 && this.editLocation.word == 0) {
    //     return [];
    //   }
    //   const temp = this.trippleData;
    //   const currentLine = this.editorArray[this.FocusedLine];
    //   let ret = [];
    //   temp.forEach((item) => {
    //     const seg = _.split(item.tripple, " ");
    //     if (this.isTrippleMatch(currentLine, seg)) {
    //       ret.push({ value: seg[2], occurance: item.occurance });
    //     }
    //   });
    //   ret = this.sortWordList(ret);
    //   ret = _.take(ret, 3);
    //   return ret;
    // },
  },
  methods: {
    isContained(val) {
      let temp = val;
      if (temp.length > 0) {
        this.editorArray[this.FocusedLine].forEach((word, index) => {
          const newArray = [];
          temp.forEach((line) => {
            if (
                _.toLower(line) != _.toLower(this.editorArray[this.FocusedLine]) &&
                line.length > index
              ) {
              if (_.toLower(line[index].trim()) == _.toLower(word.trim())) {
                newArray.push(line);
              } else if (this.editorArray[this.FocusedLine].length - 1 == index) {
                if (_.startsWith(_.toLower(line[index].trim()), _.toLower(word.trim()))) {
                  newArray.push(line);
                } else if (_.toLower(word.trim()) == "") {
                  newArray.push(line);
                }
              }
            }
          });
          temp = newArray;
        });
        temp = _.uniqWith(temp, _.isEqual);
      }

      return temp;
    },
    isTrippleMatch(line, seg) {
      const end = line.length - 1;
      if (end > 1) {
        if (line[end - 2] == seg[0]) {
          if (line[end - 1] == seg[1]) {
            if (seg[2].startsWith(line[end]) || _.trim(line[end]) == "") {
              return true;
            }
          }
        }
      }
      return false;
    },
    line2array() {
      const temp = [];
      this.predictionSrc.Text.forEach((line) => {
        temp.push(_.split(line, " "));
      });
      return temp;
    },
    replaceWord(word) {
      const editLoc = this.editLocation;
      this.editorArray[editLoc.line].splice(editLoc.word, 1, word);
      const newWord = editLoc.word + 1;
      this.editorArray[editLoc.line].splice(newWord, 0, "");
      this.updatePhraseData();
      this.updateData(editLoc.line, newWord, 0);
    },
    replaceLine(num) {
      if (num < this.possibleLinesArray.length) {
        const editLoc = this.editLocation;
        this.editorArray[editLoc.line] = [];
        this.possibleLinesArray[num].forEach((word) => {
          this.editorArray[editLoc.line].push(word);
        });
        const newWord = this.possibleLinesArray[num].length - 1;
        const newLetter = this.possibleLinesArray[num][newWord].length;
        this.updatePhraseData();
        this.updateData(this.editLocation.line, newWord, newLetter);
      }
    },

    sortWordList(val) {
      let list = val;
      list = list.sort((foo, bar) => foo.occurance - bar.occurance);
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
    },
    cleanData(char) {
      const dataIn = this.predictionSrc.Text;
      const newData = [];
      dataIn.forEach((phrase) => {
        let newPhrase = phrase;
        let temp = "";
        let loc = newPhrase.indexOf(char);
        while (loc > -1) {
          const locNext = _.parseInt(loc) + 1;
          temp = String(newPhrase.slice(0, loc)) + String(newPhrase.slice(locNext));
          newPhrase = temp;
          loc = newPhrase.indexOf(char);
        }
        newData.push(newPhrase);
      });
      this.predictionSrc.Text = newData;
    },
    parseArray() {
      const dataIn = this.predictionSrc.Text;
      dataIn.forEach((phrase) => {
        const temp = [];
        let loc = phrase.indexOf(" ");
        let newPhrase = phrase;
        while (loc > -1) {
          temp.push(String(newPhrase.slice(0, loc)).toLowerCase());
          newPhrase = newPhrase.slice(loc + 1);
          loc = newPhrase.indexOf(" ");
        }
        temp.push(String(newPhrase).toLowerCase());
        this.dataOutput.push(temp);
      });
    },
    setAvailableWords() {
      const TotalWords = this.dataOutput;
      const tempAvailableWords = [];
      TotalWords.forEach((phrase) => {
        phrase.forEach((word) => {
          if (!tempAvailableWords.includes(word)) {
            tempAvailableWords.push(word);
          }
        });
      });
      this.availableWords = tempAvailableWords;
    },
    setAvailableDoubleWords() {
      const TotalWords = this.dataOutput;
      const tempAvailableWords = [];
      TotalWords.forEach((phrase) => {
        const phraseLength = phrase.length;
        let n = 0;
        while (n + 1 < phraseLength) {
          const temp = [];
          temp.push(phrase[n]);
          temp.push(phrase[n + 1]);
          let validate = true;
          tempAvailableWords.forEach((pair) => {
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
      const tempAvailableWords = [];
      TotalWords.forEach((phrase) => {
        const phraseLength = phrase.length;
        let n = 0;
        while (n + 2 < phraseLength) {
          const temp = [];
          temp.push(phrase[n]);
          temp.push(phrase[n + 1]);
          temp.push(phrase[n + 2]);
          let validate = true;
          tempAvailableWords.forEach((tripple) => {
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
      availableWords.forEach((word) => {
        let temp = 0;
        TotalWords.forEach((phrase) => {
          phrase.forEach((trackWord) => {
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
      availableWords.forEach((pair) => {
        let count = 0;
        TotalWords.forEach((phrase) => {
          const phraseLength = phrase.length;
          let n = 0;
          while (n + 1 < phraseLength) {
            const temp = [];
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
      availableWords.forEach((tripple) => {
        let count = 0;
        TotalWords.forEach((phrase) => {
          const phraseLength = phrase.length;
          let n = 0;
          while (n + 2 < phraseLength) {
            const temp = [];
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
          this.trippleData.push({
            tripple: `${tripple[0]} ${tripple[1]} ${tripple[2]}`,
            occurance: count,
          });
        }
      });
    },
  },
  mounted() {
    // this.cleanAll();
    // this.parseArray();
    // this.setAvailableWords();
    // this.singleWordOccurance();
    // this.setAvailableDoubleWords();
    // this.doubleWordOccurance();
    // this.setAvailableTrippleWords();
    // this.trippleWordOccurance();
    // this.wordData = this.sortWordList(this.wordData);
    // this.pairData = this.sortWordList(this.pairData);
    // this.trippleData = this.sortWordList(this.trippleData);
  },
};
