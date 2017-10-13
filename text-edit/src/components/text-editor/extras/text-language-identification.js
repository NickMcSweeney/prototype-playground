

const LanguageDetect = require("languagedetect");

const lngDetector = new LanguageDetect();

export default {
  props: {
    toDisplayLang: {
      default: false,
    },
  },
  data() {
    return {
      showLang: this.toDisplayLang,
      linesPerLanguage: "",
      supportedLang: [
        "english",
        "spanish",
        "portuguese",
        "german",
        "japanese",
        "russian",
        "turkish",
        "italian",
        "french",
        "cantonese",
        "korean",
        "hindi",
        "mandarin",
      ],
    };
  },
  methods: {
    checkLanguage(strArr) {
      const lineString = _.replace(_.toString(strArr), ",", " ");
      return this.identify(lineString);
    },
    identify(str) {
      let lang = lngDetector.detect(str, 3);
      if (lang.length > 0) {
        lang = this.filter(lang);
        if (lang == undefined) {
          return "unknown";
        } else if (lang[1] < 0.2) {
          return "unknown";
        }
        return lang;
      }
      return "empty";
    },
    filter(langArr) {
      let temp;
      langArr.forEach((lang) => {
        if (_.indexOf(this.supportedLang, lang[0]) != -1 && temp == undefined) {
          temp = lang;
        }
      });
      return temp;
    },
  },
};
