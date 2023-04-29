<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <TopBar/>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Sidebar/>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
import TopBar from "./components/TopBar.vue";
</script>

<style scoped>
.el-header{
  padding: 0;
}
</style>
