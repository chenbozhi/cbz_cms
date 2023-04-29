<template>

  <el-table v-loading="loading"
            :data="list"
            element-loading-text="加载中..."
            style="width: 100%">
    <el-table-column label="编号" prop="requirementId" width="100"/>
    <el-table-column label="需求名称" prop="requirementName"/>
    <el-table-column label="申请日期" prop="requirementApplyDate"/>
    <el-table-column label="关联系统" prop="applicationSystem.applicationSystemName"/>
    <el-table-column label="需求描述" prop="requirementDescribe"/>
    <el-table-column label="需求类型" prop="requirementType.requirementTypeName"/>
    <el-table-column label="需求部门" prop="departments[departments.length - 1].departmentName">
      <template #default="scope">
        {{ scope.row.departments[scope.row.departments.length - 1].departmentName }}
      </template>
    </el-table-column>
    <el-table-column label="创建日期" prop="requirementCreateTime"/>
    <el-table-column label="需求备注" prop="requirementRemarks"/>

    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          <el-icon>
            <Edit/>
          </el-icon>
          编辑
        </el-button>

        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
          <el-icon>
            <Delete/>
          </el-icon>
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <PaginationCpm ref="paginationCpmRef" @on-change="doQryListData"/>
</template>

<script setup>

import {onMounted, ref} from "vue";
import api from "../../assets/api/index.js";
import PaginationCpm from "../../components/PaginationCpm.vue";

const paginationCpmRef = ref(null)

const list = ref([])

const loading = ref(false)

const doQryListData = () => {
  let params = {
    pageNum: paginationCpmRef.value.pageInfo.pageNum,
    pageSize: paginationCpmRef.value.pageInfo.pageSize
  }
  loading.value = true
  api.qryRequirements(params).then(res => {
    list.value = res.list
    paginationCpmRef.value.pageInfo.total = res.total
  }).catch(err => {
  }).finally(() => {
    loading.value = false
  })
}

const handleEdit = (index, row) => {

}

const handleDelete = (index, row) => {

}

const init = () => {
  doQryListData()
}

onMounted(() => {
  init()
})
</script>

<style scoped>

</style>
