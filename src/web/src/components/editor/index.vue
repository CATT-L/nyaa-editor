<template>
  <div class="editor full-height" flex>
    <div style="width: 50%" flex>
      <panel-edit v-model:value="content"></panel-edit>
    </div>
    <div style="width: 50%; position: relative" flex>
      <panel-result ref="panel-result" :markdown="content"></panel-result>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "panel-edit": require("./panel-edit.vue").default,
    "panel-result": require("./panel-result.vue").default,
  },
  data() {
    return {
      file: null,
      content: "",
      timerAutoSave: null,
    };
  },
  computed: {},
  mounted() {
    // this.handleLoad();
    // this.timerAutoSave = setInterval(() => {
    //   this.handleSave();
    // }, 5e3);
  },

  unmounted() {
    // clearInterval(this.timerAutoSave);
    // this.timerAutoSave = null;
    // this.handleSave();
  },
  methods: {
    async export() {
      this.$nextTick(() => {
        this.$refs["panel-result"].export();
      });
    },
    async openFile(file) {
      this.file = file;

      var re = await this.$store.dispatch("app/explorer/readFile", { file });

      this.content = re.data.content;
    },

    async save() {
      if (!this.file) {
        return false;
      }

      await this.$store.dispatch("app/explorer/saveFile", {
        file: this.file,
        content: this.content,
      });

      // if (!this.file) {
      //   return false;
      // }

      // await this.$store.dispatch("app/content/save", {
      //   item: this.file,
      //   content: this.content,
      // });

      // this.$message({
      //   type: "success",
      //   message: `The file '${this.file.name}' has been saved sucessfully.`,
      // });
    },
    reset() {
      this.file = null;
      this.content = "";
    },
  },
};
</script>
