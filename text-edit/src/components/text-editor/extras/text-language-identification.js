"use strict";
var LanguageDetect = require("languagedetect");
var lngDetector = new LanguageDetect();

export default {
  data() {
    return {
      showLang: false,
      linesPerLanguage: "",
    };
  },
  computed: {
    languageOfLine() {
      const lineNumber = this.target;
      let lineString = _.toString(this.editorArray[lineNumber]);
      lineString = _.replace(lineString, ",", " ");
      return this.identify(lineString);
    },
    languageOfLines() {
      var langs = {};
      this.editorArray.forEach(line => {
        let lineString = _.toString(line);
        lineString = _.replace(lineString, ",", " ");
        let langRet = this.identify(lineString);
        if (langRet == "unknown") {
          langs.unknown > 0 ? langs.unknown++ : (langs.unknown = 1);
        } else if (_.has(langs, langRet[0][0])) {
          langs[langRet[0][0]]++;
        } else {
          langs[langRet[0][0]] = 1;
        }
      });
      return JSON.stringify(langs);
    },
  },
  methods: {
    identify(str) {
      var lang = lngDetector.detect(str, 2);
      if (lang.length > 0) {
        return lang;
      }
      return "unknown";
    },
    displayLang(index) {
      const lineNumber = index;
      let lineString = _.toString(this.editorArray[lineNumber]);
      lineString = _.replace(lineString, ",", " ");
      const langArray = this.identify(lineString);
      let humanOut = langArray == "unknown" ? "Unknown" : langArray[0][0];
      return humanOut;
    },
  },
};
