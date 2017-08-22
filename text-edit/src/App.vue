<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div>
      <!-- <router-link :to="{ name: 'convertData', params: {} }"><button>CONVERT DATA</button></router-link> -->
    </div>
    <router-link :to="{ name: 'editor', params: {} }"><button>CONTENT EDITABLE</button></router-link>
    <!-- <router-link :to="{ name: 'altEditor', params: {} }"><button>EDITABLE DIVs</button></router-link>
    <router-link :to="{ name: 'keyBoundEdit', params: {} }"><button>KEY BOUND EDITOR</button></router-link> -->
    <router-link :to="{ name: 'textEditor', params: {} }"><button>Vue Text Editor</button></router-link>

    <router-view></router-view>
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
</style>
