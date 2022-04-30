<template>
  <span class="node-icon">
    <el-icon>
      <template v-if="data.type === 'project'">
        <el-icon-folder />
      </template>
      <template v-else>
        <template v-if="data.isDir">
          <el-icon-folder />
        </template>
        <template v-else>
          <el-icon-document />
        </template>
      </template>
    </el-icon>
  </span>
  <span class="node-text">{{ data.name }}</span>
</template>

<script>
export default {
  props: {
    node: {},
    data: {},
  },
};
</script>

<style scoped>
.node-icon {
  display: inline-block;
  margin-right: 4px;
}

.node-text {
  font-size: 0.8rem;
}
</style>
