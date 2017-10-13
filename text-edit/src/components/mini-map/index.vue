<template>
  <div class="mini-map">
    <div class="page">
      <div
        class="line"
        v-for="(line, index) in fakeDoc"
        :class="{view: index <= bottomVisLine && index >= topVisLine}"
        @click="$emit('mini-map-focus', index)"
      >
        <div
          v-for="(word, key) in line"
          class="word"
          :class="{
            'seach-highlight': isSearchReult(index, key),
            'miss-spell': isSpErr(index, key)
          }"
          :style="{width: word+'px'}"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "mini-map",
  data() {
    return {};
  },
  props: {
    phrases: {
      type: Array,
      required: true,
    },
    topLine: {
      type: Number,
      default: 0,
    },
    bottomLine: {
      type: Number,
      default: 0,
    },
    isSearchReult: {
      required: true,
    },
    isSpErr: {
      required: true,
    },
  },
  mixins: [],
  computed: {
    fakeDoc() {
      const temp = [];
      this.phrases.forEach(line => {
        let lineLength = [];
        line.forEach(word => {
          if (word == " " || word == null || word == "\n") lineLength.push(0);
          else lineLength.push(word.length);
        });
        temp.push(lineLength);
      });
      return temp;
    },
    // TODO:
    // for dragging mini map, use mousedown, mouseup, mouseover to simulate drag
    topVisLine() {
      return this.topLine;
    },
    bottomVisLine() {
      if (this.bottomLine == 0) {
        return this.phrases.length - 1;
      }
      return this.bottomLine;
    },
  },
  methods: {},
  watch: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .mini-map
    height: auto
    width: 80px
    padding-left: 42px
    margin-left: -40px
    justify-content: flex-end;
    background-color: rgba(69, 88, 106, 0.36)
    border-bottom-right-radius: 6px
    border-top-right-radius: 6px
    overflow-y: scroll
    .page
      margin: 0rem .25rem .5rem 0
      background-color: rgba(#fcfcff, 0.36)
      padding: .2rem .1rem .8rem
      border-bottom-right-radius: 5px
      border-top-right-radius: 2px
      .line
        height: 0.2rem
        width: 100%
        display: flex
        justify-content: flex-start
        flex-direction: row
        padding: 0.04rem 0
        margin: 0
        .word
          margin: 0 .5px
          background-color: rgba(15, 78, 143, 0.69)
          height: 0.14rem
          vertical-align: middle
        .seach-highlight
          background-color: #f8fad2
        .miss-spell
          background-color: rgb(255, 101, 69)

  .view
    background-color: rgba(226, 240, 246, 0.64)
</style>
