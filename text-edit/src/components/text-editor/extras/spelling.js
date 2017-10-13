

// const spellcheck = require("nodehun-sentences");

import affFile from "@/assets/dictionaries/en_US-lg/en_US-large.aff";
import dicFile from "@/assets/dictionaries/en_US-lg/en_US-large.dic";

// import affFile_es from "@/assets/dictionaries/es/es.aff";
// import dicFile_es from "@/assets/dictionaries/es/es.dic";

const Typo = require("typo-js");

const dictionary_en = new Typo("en_US", affFile, dicFile);
// var dictionary_es = new Typo("es", affFile_es, dicFile_es);

export default {
  props: {
    showSpelling: {
      default: true,
    },
    defaultDictionary: {
      type: Object,
      default() {
        return dictionary_en;
      },
    },
    dictionaries: {
      type: Object,
    },
  },
  data() {
    return {
      checkSpelling: false,
      currentSuggestions: [],
      showSuggestions: false,
      lastCurrentWord: "",
      missSpellingArray: [],
    };
  },
  watch: {
    currentWord(loc) {
      if (this.lastCurrentWord !== loc) {
        this.lastCurrentWord = loc;
      }
    },
    targetLocation() {
      if (this.showSpelling) {
        this.currentSuggestions = [];
        this.showSuggestions = false;
      }
    },
  },
  computed: {},
  methods: {
    isSpErr(line, word) {
      if (this.showSpelling) {
        const lineIndex = _.padStart(_.toString(line), 4, "0");
        const wordIndex = _.padStart(_.toString(word), 2, "0");
        const phraseID = lineIndex + wordIndex;

        let wordOfIntrest = {};
        Object.keys(this.phraseObject).forEach((key) => {
          this.phraseObject[key].forEach((item) => {
            if (item.id === phraseID) {
              wordOfIntrest = item;
            }
          });
        });
        if (wordOfIntrest.meta) {
          return wordOfIntrest.meta.spelling;
        }
        return false;
      }
      return false;
    },
    checkSegmentSpelling(str, lang) {
      let dictionary = "";
      if (lang === "english" && _.has(this.dictionaries, "english")) {
        dictionary = this.dictionaries.english;
      } else if (
          lang === "spanish" &&
          _.has(this.dictionaries, "spanish")
        ) {
        dictionary = this.dictionaries.spanish;
      } else {
        dictionary = this.defaultDictionary;
      }
      return !dictionary.check(_.trim(str, ",.?!"));
    },
    checkWordSpelling(ev, line, word) {
      this.showSuggestions = false;
      if (this.showSpelling) {
        const lineIndex = _.padStart(_.toString(line), 4, "0");
        const wordIndex = _.padStart(_.toString(word), 2, "0");
        const phraseID = lineIndex + wordIndex;

        let wordOfIntrest = {};
        Object.keys(this.phraseObject).forEach((key) => {
          this.phraseObject[key].forEach((item) => {
            if (item.id === phraseID) {
              wordOfIntrest = item;
            }
          });
        });
        if (wordOfIntrest.meta) {
          const lang = wordOfIntrest.meta.language[0];
          const str = wordOfIntrest.word;
          let dictionary = "";
          if (lang === "english" && _.has(this.dictionaries, "english")) {
            dictionary = this.dictionaries.english;
          } else if (
                lang === "spanish" &&
                _.has(this.dictionaries, "spanish")
              ) {
            dictionary = this.dictionaries.spanish;
          } else {
            dictionary = this.defaultDictionary;
          }
          this.currentSuggestions = dictionary.suggest(_.trim(str, ",.?!"));
          if (this.currentSuggestions.length !== 0) this.showSuggestions = true;
        }
        return false;
      }
      return false;
    },
    selectSpSuggest(index) {
      const line = this.editLocation.line;
      const word = this.editLocation.word;
      let letter = this.editLocation.letter;
      try {
        const newWord = this.currentSuggestions[index];
        this.editorArray[line].splice(word, 1, newWord);
      } catch (e) {
        console.error(e);
      } finally {
        this.currentSuggestions = [];
        this.showSuggestions = false;
        letter = this.editorArray[line][word].length;
        this.updateData(line, word, letter);
      }
    },
  },
};
