<template>
  <div style="">
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        router
        text-color="#fff"
    >
      <!--      首页-->
      <el-menu-item index="/">
        <el-icon>
          <el-icon><HomeFilled /></el-icon>
        </el-icon>
        <span>系统首页</span>
      </el-menu-item>

      <!--      需求管理-->
      <el-sub-menu index="/requirement">
        <template #title>
          <el-icon>
            <el-icon>
              <ReadingLamp/>
            </el-icon>
          </el-icon>
          <span>需求管理</span>
        </template>
        <el-menu-item index="/requirement/requirementList">需求列表</el-menu-item>
        <el-menu-item index="/requirement/requirementApply">需求申请</el-menu-item>
        <el-menu-item index="/requirement/requirementType">需求类型</el-menu-item>
      </el-sub-menu>

      <!--      系统管理-->
      <el-sub-menu index="/system_application">
        <template #title>
          <el-icon>
            <el-icon>
              <Basketball/>
            </el-icon>
          </el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/system_application/systemApplicationList">系统列表</el-menu-item>
      </el-sub-menu>

      <!--      部门管理-->
      <el-sub-menu index="/department">
        <template #title>
          <el-icon>
            <el-icon>
              <GoldMedal/>
            </el-icon>
          </el-icon>
          <span>部门管理</span>
        </template>
        <el-menu-item index="/department/departmentList">部门列表</el-menu-item>
      </el-sub-menu>


    </el-menu>
  </div>
</template>

<script setup>
</script>

<style scoped>
.common-layout {
  width: 100%;
}
</style>
