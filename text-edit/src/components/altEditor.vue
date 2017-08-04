<template>
<div class="editor" align="middle">
  <div class="edit-box">
    <div class="edit-content">
      <div class="row" v-for="(row, index) in editorArray">
        <div
        class="row-show"
        @click="openForEdit(index)"
        v-if="editMe!==index"
        >
          {{ editorArray[index] }}
        </div>
        <input
          v-if="editMe==index"
          class="row-edit"
          v-model="editorData"
          @blur="readInputs(index)"
          @keypress.enter="nextLine"
          @keypress.enter.shift="createNew(index)"
          :id="'line-'+index"
        >
      </div>
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
  name: "altEditor",
  data() {
    return {
      editMe: -1,
      editorData: "",
      editorArray: [""]
    };
  },
  methods: {
    openForEdit(index) {
      this.editMe = index;
      this.editorData = this.editorArray[index];
      let myId = "line-" + index;
      process.nextTick(() => {
        document.getElementById(String(myId)).focus();
      });
    },
    readInputs(index) {
      let temp = this.editorData;
      this.editorData = "";
      this.editorArray.splice(index, 1, temp);
    },
    createNew(index) {
      this.editorArray.splice(index + 1, 0, "");
    },
    nextLine() {
      this.editMe++;
      process.nextTick(() => {
        if (document.getElementById("line-" + this.editMe) === null) {
          this.editorArray.push("");
        }
      });
      setTimeout(() => {
        let myId = "line-" + this.editMe;
        this.editorData = this.editorArray[this.editMe];
        document.getElementById(String(myId)).focus();
      }, 100);
    }
  }
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
  /*background-color: #FFF;*/
}
.edit-content .row {
  height: 28px;
  margin: 2px;
  background-color: #f5f5f5;
}

.row-show, .row-edit {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  text-align: left;
  line-height: 28px;
}
.row-show {

}
.row-edit {
  outline: none;
  border: none;
  margin: 0px;
  height: 26px;
  width: 99.5%;
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
