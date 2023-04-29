<template>
    <el-tree :data="data"
             :expand-on-click-node="false"
             :props="defaultProps"
             class="s-tree-cpm"
             node-key="departmentId"
             @node-click="handleNodeClick">

        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-link :underline="false" type="primary" @click.prevent="appendNode(node, data)">
                  <el-icon>
                      <Plus/>
                  </el-icon>添加
              </el-link>
                <el-link :underline="false" style="margin-left: 10px" type="primary"
                         @click.prevent="editNode(node, data)">
                    <el-icon>
                      <Edit/>
                  </el-icon>修改
                </el-link>

              <el-link :underline="false" style="margin-left: 10px" type="danger"
                       @click.prevent="removeNode(node, data)">
                  <el-icon>
                      <Delete/>
                  </el-icon>删除
              </el-link>
            </span>
          </span>
        </template>
    </el-tree>
</template>

<script setup>

import {onMounted, ref} from "vue";
import api from "@/assets/api/index.js";

const data = ref([])

const defaultProps = {
    children: 'children',
    label: 'departmentName',
}

const qryDepartmentsTree = () => {
    api.qryDepartmentsTree({}).then(res => {
        console.log(res.tree)
        data.value = res.tree
    }).catch(err => {
    }).finally(() => {
    })
}

const handleNodeClick = () => {

}

const appendNode = (node, data) => {
    console.log('添加')
}

const editNode = (node, data) => {

}

const removeNode = (node, data) => {

}


const init = () => {
    qryDepartmentsTree()
}

onMounted(() => {
    init()
})

</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.s-tree-cpm {
    width: 500px;
}
</style>
