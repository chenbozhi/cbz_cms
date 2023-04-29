<!--
  将分页组件稍微封装一下
-->
<template>
  <div class="s-pagination">
    <el-pagination
        v-model:current-page="pageInfo.pageNum"
        v-model:page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizes"
        :total="pageInfo.total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import {ref} from "vue";

const emits = defineEmits(['on-change'])

const pageInfo = ref({
  pageSizes: [5, 10, 15, 20],
  pageNum: 1,
  pageSize: 10,
  total: 10,
})

const handleSizeChange = (pageSize) => {
  pageInfo.value.pageSize = pageSize
  emits('on-change')
}

const handleCurrentChange = (pageNum) => {
  pageInfo.value.pageNum = pageNum
  emits('on-change')
}

// 在子组件暴露需要被父组件调用的属性
defineExpose({
  pageInfo
})
</script>

<style scoped>
.s-pagination {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
