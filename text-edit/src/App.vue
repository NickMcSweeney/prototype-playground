<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="global-menu">
      <router-link :to="{ name: 'convertData', params: {} }"><button>Type Ahead</button></router-link>
      <router-link :to="{ name: 'textEditor', params: {} }"><button>Vue Text Editor</button></router-link>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
const _ = require("lodash");

export default {
  name: "app",
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
.global-menu {
  width: 700px;
  display: flex;
  margin: 0 auto;
  border-top: 2px solid rgb(173, 182, 190);
  border-bottom: 2px solid rgb(173, 182, 190);
  padding: 6px 12px;
  box-sizing: border-box;
  justify-content: center;
}
.global-menu button {
  margin: 0 6px;
  height: 36px;
  width: auto;
  outline: none;
  border: none;
  background-color: rgb(227, 233, 240);
  border-radius: 3px;
  cursor: pointer;
}
.global-menu button:hover {
  background-color: rgba(227, 233, 240, .9);
}
.global-menu button:active {
  background-color: rgba(227, 233, 240, .86);
  box-shadow: inset 1px 1px 2px 1px rgba(39, 41, 46, 0.41)
}
.container {
  width: 700px;
  margin: 0 auto;
  padding: 10px 0;
  border-bottom: 1px solid rgb(173, 182, 190);
  box-sizing: border-box;
}
</style>
