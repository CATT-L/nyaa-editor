<template>
  <div style="height: 100%">
    <el-container>
      <el-header>
        <div style="font-size: 2rem;">Markdown Editor</div>
      </el-header>
      <el-container>
        <el-aside width="280px">
          
          <div style="background: #eee; height: 100%;">
            <project-tree></project-tree>
          </div>


        </el-aside>
        <el-container>
          <el-main>

            <el-button>button</el-button>
            
            <el-row :gutter="15" style="height: 100%">
              <el-col :span="12">
                <el-input
                  type="textarea"
                  input-style="
                    display: block;
                    width: 100%;
                    height: 100%;
                    outline: none;
                    resize: none;
                    padding: 5px;
                  "
                  v-model="source"
                ></el-input>
              </el-col>
              <el-col :span="12">
                <div style="padding: 5px; height: 100%">
                  <div
                    class="result"
                    style="
                      height: 100%;
                      border: solid 1px #dcdfe6;
                      border-radius: 5px;
                      padding: 5px;
                    "
                    v-html="html"
                  ></div>
                </div>
              </el-col>
            </el-row>
          </el-main>
          <!-- <el-footer>Footer</el-footer> -->
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import "@/assets/themes/github.css";

export default {
  components: {
    'project-tree': require('./project-tree').default,
  },
  data() {
    return {
      source: "",
      mdit: new MarkdownIt(),
    };
  },
  computed: {
    html() {
      return this.mdit.render(this.source);
    },
  },
  methods: {},
};
</script>

<style>
.el-container {
  height: 100%;
}

.result img {
  max-width: 100%;
}
</style>
