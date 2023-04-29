<template>
  <div style="width: 100%;">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :ellipsis="false"
    >
      <el-menu-item index="0">
        <strong style="font-size: 18px;">CBZ接口自动化测试系统</strong>
      </el-menu-item>
      <div class="flex-grow" />
      <el-sub-menu index="2">
        <template #title>
          <el-avatar :icon="UserFilled" class="s-avatar"/>
         <span style="padding-left: 10px;">张三</span>
        </template>
        <el-menu-item index="2-1">设置</el-menu-item>
        <el-menu-item index="2-2">退出系统</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import {ref} from "vue";

const activeIndex = ref('1')
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

:deep(.s-avatar .el-icon) {
  margin-right: 0;
}
</style>
