<template>
  <div class="search-bar" @keydown.esc.prevent.stop="close">
    <div class="box">
      <div class="input-box">
        <div class="search-icn" v-if="!searching" @click="searching=!searching"></div>
        <div class="close-icn" v-if="searching" @click="close"></div>
        <input
          v-if="searching"
          v-model="searchStr"
          class="search-box"
          @keydown.enter.prevent.stop="findMatches"
          @keydown.esc.prevent.stop="close"
          name="search-input"
          id="search-input"
          type="search"
        >
        <div class="input-button" v-if="searching">
          <button @click="findMatches">Find</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "search-bar",
  data() {
    return {
      searching: false,
      searchStr: "",
      matchArray: [],
    };
  },
  props: {
    data: {
      required: true,
    },
  },
  mixins: [],
  computed: {},
  methods: {
    findMatches() {
      this.matchArray = [];
      this.data.forEach((phrase, i) => {
        let temp = [];
        phrase.forEach((word, n) => {
          word = _.lowerCase(word);
          if (
            _.trim(word, ",.?!") === _.lowerCase(this.searchStr) ||
            word == _.lowerCase(this.searchStr)
          ) {
            temp.push(true);
          } else {
            temp.push(false);
          }
        });
        this.matchArray.push(temp);
      });
      this.$emit("search", this.matchArray);
    },
    close() {
      this.searching = false;
      this.matchArray = [];
      this.searchStr = "";
      this.$emit("search", this.matchArray);
    },
  },
  watch: {
    searching(bool) {
      if (bool) {
        process.nextTick(() => {
          document.getElementById("search-input").focus();
          this.$emit("focus");
        });
      }
    },
    searchStr(str) {
      if (str != str.match(/\S*/)[0]) {
        str = str.match(/\S*/);
        this.searchStr = str[0];
      }
    },
  },
  mounted() {
    document.addEventListener("keydown", ev => {
      if (ev.metaKey && ev.key == "f") {
        ev.preventDefault();
        ev.stopPropagation();
        this.searching = true;
        // console.log("event me", ev);
        // let myEvent = new CustomEvent("find", { ev });
        // document.dispatchEvent(myEvent);
      }
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .search-bar
    position: relative
    bottom: .5rem
    display: flex
    justify-content: flex-end
    flex-direction: column
    .box
      position: fixed
      display: flex
      padding: 0rem .5rem
      justify-content: flex-end
      flex-direction: column
      .input-box
        display: flex
        justify-content: flex-start
        flex-direction: row
        width: 100%
        height: 2rem
        .search-icn
          background-image: url("../../assets/img/search-icn.svg")
          background-size: 1.4rem 1.3rem
          background-repeat: no-repeat
          background-position: left center
          width: 2.5rem
          height: 1.4rem
          margin: .25rem
          display: flex
          flex-direction: row
          justify-content: flex-start
          cursor: pointer
        .close-icn
          background-image: url("../../assets/img/close-icn.svg")
          background-size: 1rem
          background-repeat: no-repeat
          background-position: center
          width: 2.5rem
          height: 1.5rem
          margin: .24rem
          cursor: pointer
        .search-box
          background-color: #F7FAFD
          border-radius: 3px
          box-sizing: border-box
          border: 1px solid #cddae3
          height: 1.5rem
          margin: .25rem
          width: 100%
          outline: none
          font-size: .85rem
          font-family: 'Rubik', sans-serif
          font-weight: 400
          color: rgba(#2f374b, 0.68)
          padding: 0 .25rem
        .input-button
          width: 21rem
          display: flex
          flex-direction: row
          justify-content: flex-start
          button
            margin-left: .5rem
            width: 6rem
            background-color: #F7FAFD
            border-radius: 3px
            box-sizing: border-box
            border: 1px solid #cddae3
            height: 1.5rem
            padding: .25rem
            outline: none
            text-align: center
            font-size: .8rem
            font-family: 'Rubik', sans-serif
            font-weight: 400
            color: rgba(#2f374b, 0.68)
            margin: .25rem
            cursor: pointer
          button:active
            background-color: #c9d6e4


</style>
