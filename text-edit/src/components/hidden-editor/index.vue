<template>
  <div class="hidden-editor">
    <input
      name="hidden-editor-input"
      @keydown.enter="emitEnter"
      @keydown.delete.prevent.stop="emitDelete"
      @keydown.up.down.left.right.prevent.stop="emitArrow($event)"
      @keydown.tab.prevent.stop="emitTab"
      @keydown.meta.shift="shortcuts"
      type="text"
      v-model="hiddenInput"
      :tabindex="0">
  </div>
</template>

<script>
export default {
  name: "hidden-editor",
  data() {
    return {
      hiddenInput: "",
    };
  },
  props: {
    location: {
      required: true,
    },
    focus: {
      default: false,
    },
  },
  mixins: [],
  computed: {},
  methods: {
    emitEnter() {
      this.$emit("enter");
    },
    emitDelete(ev) {
      if (ev.code === "Delete") {
        if (ev.metaKey) {
          this.$emit("deleteLine");
        } else if (ev.altKey) {
          this.$emit("deleteWord");
        } else {
          this.$emit("delete");
        }
      }
      if (ev.code === "Backspace") {
        if (ev.metaKey) {
          this.$emit("backspaceLine");
        } else if (ev.altKey) {
          this.$emit("backspaceWord");
        } else {
          this.$emit("backspace");
        }
      }
    },
    emitArrow(event) {
      switch (event.code) {
        case "ArrowLeft":
          if (event.metaKey) {
            this.$emit("leftLine", event.shiftKey);
          } else if (event.altKey) {
            this.$emit("leftWord", event.shiftKey);
          } else {
            this.$emit("left", event.shiftKey);
          }
          break;
        case "ArrowRight":
          if (event.metaKey) {
            this.$emit("rightLine", event.shiftKey);
          } else if (event.altKey) {
            this.$emit("rightWord", event.shiftKey);
          } else {
            this.$emit("right", event.shiftKey);
          }
          break;
        case "ArrowUp":
          this.$emit("up", event.shiftKey);
          break;
        case "ArrowDown":
          this.$emit("down", event.shiftKey);
          break;
        default:
          console.error("help i'm a fifth arrow");
      }
    },
    shortcuts(ev) {
      if (ev.key == "?") {
        ev.stop;
        ev.preventDefault();
        this.$emit("unknown");
      } else if (ev.key == "*") {
        ev.stop;
        ev.preventDefault();
        this.$emit("explicit");
      } else if (ev.key == "B") {
        ev.stop;
        ev.preventDefault();
        this.$emit("bold");
      }
    },
    emitTab() {
      this.$emit("tab");
    },
  },
  watch: {
    hiddenInput(input) {
      if (input != "") this.$emit("char", input);
      this.hiddenInput = "";
    },
  },
  mounted() {
    if (this.focus) {
      document.getElementsByName("hidden-editor-input")[0].focus();
    }
    // document.addEventListener("mouseup", ev => {
    //   document.getElementsByName("hidden-editor-input")[0].focus();
    // });
    document.addEventListener("keydown", ev => {});
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .hidden-editor
    display: flex
    position: relative;
    top: 0
    height: .25rem
    width: .25rem
    background-color: transparent
    overflow: hidden
    user-select: none
    input
      border: none
      outline: none
      background-color: transparent
      caret-color: transparent
      height: .1rem
      width: .1rem
      position: absolute
      top: .25rem
</style>
