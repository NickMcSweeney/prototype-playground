<template>
  <div id="app">
    <div class="container">
      <text-editor
        :searchable="false"
        @edited="editContent"
      >
      <div
        slot="dropdown-on-word"
        class="drop-box-word"
        v-if="isMessage"
      >
        <div class="drop-content" >
          <h6>{{ '@me' }}</h6>
          <h6>{{ '@nick' }}</h6>
          <h6>{{ '@help' }}</h6>
          <h6>{{ '@...' }}</h6>
        </div>
      </div>
    </text-editor>
    </div>
  </div>
</template>

<script>
import { TextEditor } from '@/index.js';
export default {
  name: 'app',
  components: { TextEditor },
  data() {
    return {
      content: Object(),
      isMessage: false,
    };
  },
  methods: {
    editContent(data) {
      this.content = data;
      let temp = false
      Object.keys(data).forEach(key => {
        data[key].forEach(item => {
          if (item.word.indexOf('@') >= 0) {
            temp = true;
          }
        });
      });
      this.isMessage = temp
    },
  },
};
</script>

<style>
body {
  background: #373d42;
  width: 100%;
  height: 100%;
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container {
  width: 700px;
  min-height: 36px;
  margin: 20px auto;
  padding: 10px 0;
  border-bottom: 1px solid rgb(173, 182, 190);
  border-top: 1px solid rgb(173, 182, 190);
  box-sizing: border-box;
}
.container .editor #edit-container .edit-content {
  clip-path: unset;
  border-radius: 2px;
  padding: 0.5rem 0;
  overflow: visible;
}
.drop-box-word {
  position: relative;
  top: 1.5rem;
  z-index: 2;
  left: -100%;
}
.drop-box-word .drop-content {
  background: #FBFDFF;
  box-shadow: 0 2px 7px 0 rgba(0,0,0,0.10);
  border-radius: 3px;
  position: absolute;
  padding: .5rem;
}
.drop-box {
  position: relative;
  top: 1px;
  z-index: 1;
  left: 0;
  height: 60px;
  width: 100%;
  box-sizing: border-box;
}
.drop-box .drop-content {
  background: #FBFDFF;
  box-shadow: 0 2px 7px 0 rgba(0,0,0,0.10);
  border-radius: 1px;
  position: absolute;
  padding: .5rem;
  width: 100%;
  box-sizing: border-box;
}
h5, h6 {
  margin: .4rem .2rem;
  display: flex;
  font-family: rubik;
}
</style>
