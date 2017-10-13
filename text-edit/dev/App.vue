<template>
  <div id="app">
    <div class="container">
      <text-editor></text-editor>
    </div>
  </div>
</template>

<script>
import { TextEditor } from "@/index.js";
export default {
  name: "app",
  components: { TextEditor },
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
  height: 500px;
  margin: 20px auto;
  padding: 10px 0;
  border-bottom: 1px solid rgb(173, 182, 190);
  border-top: 1px solid rgb(173, 182, 190);
  box-sizing: border-box;
}
</style>
