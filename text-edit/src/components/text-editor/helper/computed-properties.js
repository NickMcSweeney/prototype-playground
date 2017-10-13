

export default {
  computed: {
    currentWord() {
      //  tracks current word being edited
      const word = this.editorArray[this.editLocation.line][this.editLocation.word];
      if (word.indexOf(" ") > -1 && word !== undefined) {
        return word.trim();
      } else if (word !== " " && word !== undefined) {
        return word;
      }
      return null;
    },
    FocusedLine() {
      // tracks content of current line being edited
      return this.editLocation.line;
    },
    singleSelection() {
      if (_.isEqual(this.selectionLocation.start, this.selectionLocation.end)) {
        return false;
      }
      return true;
    },
    targetLocation() {
      const line = this.editLocation.line;
      const word = this.editLocation.word;
      const letter = this.editLocation.letter;
      return `${line}-${word}-${letter}`;
    },
    endOfLastLine() {
      if (this.editorArray[0][0] == [" "]) {
        return "0-0-1";
      }
      const line = this.editorArray.length - 1;
      const word = this.editorArray[line].length - 1;
      const letter = this.editorArray[line][word].length;
      return `${line}-${word}-${letter}`;
    },
    currentLine() {
      return this.target;
    },
    wordIndex() {
      return this.editLocation.word;
    },
    // editorTop() {
    //   // give editors top height in number of lines
    //   const elm = document.getElementById("edit-container");
    //   const top = elm.scrollTop;
    //   const childHeight = elm.children[1].children[0].clientHeight;
    //   const topElem = _.floor(top / childHeight);
    //   return topElem;
    // },
    // editorBottom() {
    //   // give editors bottom height in number of lines
    //   const elm = document.getElementById("edit-container");
    //   const top = elm.scrollTop;
    //   const bottom = elm.clientHeight + top;
    //   const childHeight = elm.children[1].children[0].clientHeight;
    //   const bottomElem = _.floor(bottom / childHeight);
    //   return bottomElem;
    // },
  },
};
