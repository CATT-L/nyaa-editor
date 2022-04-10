<template>
  <div class="editor full-height" flex>
    <div style="width: 50%" flex>
      <panel-edit v-model:value="source"></panel-edit>
    </div>
    <div style="width: 50%; position: relative" flex>
      <panel-result :markdown="source"></panel-result>
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
      source: "",
      timerAutoSave: null,
    };
  },
  computed: {},
  mounted() {
    this.handleLoad();

    this.timerAutoSave = setInterval(() => {
      this.handleSave();
    }, 5e3);
  },

  unmounted() {
    clearInterval(this.timerAutoSave);
    this.timerAutoSave = null;
    this.handleSave();
  },
  methods: {
    handleItemClick({ item }) {
      console.log(item);
    },
    handleLoad() {
      try {
        var source = JSON.parse(localStorage.source);
      } catch (e) {
        var source = "";
      }
      this.source = source;
    },

    handleSave() {
      localStorage.source = JSON.stringify(this.source);
    },
  },
};
</script>
