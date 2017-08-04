<template>
<div class="editor" align="middle">
  <div class="edit-box">
    <div class="edit-content" contenteditable="true" @input="setEditorData" @blur="updateonchange" @keypress.enter="updateonchange">
      <div><br /></div>
    </div>
  </div>
  <div class="display-box">
    <div class="display-line" v-for="line in editorArray">
      {{ line }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'editor',
  data() {
    return {
      editorData: '',
      editorArray: [],
    };
  },
  methods: {
    updateonchange() {
      this.editorArray = this.editorData.split("\n");
    },
    setEditorData(ev) {
      const inputs = ev.srcElement.children;
      let temp = "";
      for (var i = 0; i < inputs.length; i++) {
        temp = temp + String(inputs[i].textContent) + '\n';
      }
      this.editorData = temp;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor {
  width: 100%;
  height: 100%;
  margin: 0;
}

.edit-box {
  width: 600px;
  height: 400px;
  background: #e6e8e9;
  border-radius: 3px;
  padding: 20px;
}

.edit-content {
  text-align: left;
  outline: none;
  height: 100%;
}
.edit-content > div:focus {
  color: red;
}

.display-box {
  width: 600px;
  height: 300px;
  background: #e6e8e9;
  border-radius: 3px;
  padding: 20px;
  margin-top: 50px;
}
</style>
