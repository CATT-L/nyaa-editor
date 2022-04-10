<template>
  <div class="panel-edit">
    <div class="editor-container">
      <textarea v-model="currentValue" @keydown="handleKeyDown"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      currentValue: "",
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.currentValue = val;
      },
    },
    currentValue: {
      handler(val) {
        this.$emit("update:value", val);
      },
    },
  },

  methods: {
    handleKeyDown(e) {
      if (e.key === "Tab") {
        this.currentValue += "\t";

        e.preventDefault();
      }
    },
  },
};
</script>

<style scoped>
.panel-edit {
  height: 100%;
  width: 100%;
  background: orange;
}

.editor-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.editor-container > textarea {
  position: absolute;
  display: block;
  padding: 0;
  resize: none;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1.5rem;

  padding: 10px;

  width: calc(100% - 20px);
  height: calc(100% - 20px);

  tab-size: 4;
}
</style>
