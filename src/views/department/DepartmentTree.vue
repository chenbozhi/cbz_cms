<template>

    <el-tree :data="data"
             :default-expanded-keys="defaultExpandedKeys"
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

                <el-popconfirm :title="`你确定要删除【${data.departmentName}】部门么?`"
                               width="220"
                               @confirm="handleDeleteDepartment(data.departmentId)"
                >
                  <template #reference>
                     <el-link :underline="false" style="margin-left: 10px" type="danger">
                      <el-icon>
                          <Delete/>
                      </el-icon>删除
                    </el-link>
                  </template>
                </el-popconfirm>

            </span>
          </span>
        </template>
    </el-tree>

    <el-dialog
            v-model="addDepartmentDialog.dialogVisible"
            :title="addDepartmentDialog.type === 'EDIT' ? '修改部门' : '添加部门'"
            width="30%">
        <div style="margin-right: 20px;">
            <el-form :model="addDepartmentDialog.form" label-width="120px">
                <el-form-item label="是否一级部门">
                    <el-switch
                            v-model="isDepartmentTopLevel"
                            :disabled="addDepartmentDialog.type === 'EDIT'"
                            active-text="是"
                            inactive-text="否"
                            inline-prompt
                    />
                </el-form-item>

                <el-form-item v-show="!isDepartmentTopLevel" label="父级部门">
                    <el-tree-select
                            v-model="addDepartmentDialog.form.departmentParentId"
                            :data="data"
                            :props="defaultProps"
                            :render-after-expand="false"
                            check-strictly
                    />
                </el-form-item>

                <el-form-item label="部门名称">
                    <el-input v-model="addDepartmentDialog.form.departmentName"/>
                </el-form-item>

                <el-form-item label="同级排序">
                    <el-input-number v-model="addDepartmentDialog.form.departmentSort" :min="1"/>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDepartmentDialog.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDepartmentDialogEnsure">
          <el-icon v-if="addDepartmentDialog.type === 'ADD'">
            <Plus/>
          </el-icon>
            <el-icon v-if="addDepartmentDialog.type === 'EDIT'">
                <Edit/>
            </el-icon>
          {{ addDepartmentDialog.type === 'EDIT' ? '修改' : '添加' }}
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script setup>

import {onMounted, ref} from "vue";
import api from "@/assets/api/index.js";
import {toRaw} from "@vue/reactivity";
import {ElMessage} from "element-plus";

const data = ref([])

const loading = ref(true)

const defaultProps = {
    children: 'children',
    label: 'departmentName',
    value: 'departmentId',
}

// 默认展开的节点
const defaultExpandedKeys = ref([])

const qryDepartmentsTree = () => {
    api.qryDepartmentsTree({}).then(res => {
        data.value = res.tree
    }).catch(err => {
    }).finally(() => {
    })
}

const handleNodeClick = () => {

}

const appendNode = (node, data) => {
    addDepartmentDialog.value.form.departmentId = ''
    addDepartmentDialog.value.form.departmentName = ''
    addDepartmentDialog.value.form.departmentParentId = data.departmentId
    addDepartmentDialog.value.form.departmentSort = 1

    openAddDepartmentsDialog()
}

const editNode = (node, data) => {
    openEditDepartmentByEditBtn(data)
}

const removeNode = (node, data) => {

}

const addDepartmentDialog = ref({
    dialogVisible: false,
    form: {
        departmentId: 0,
        departmentName: '',
        departmentParentId: 0,
        departmentSort: 1,
    },
    type: 'EDIT',  // ADD
})

// 在添加或者修改的时候，判断是否添加一级部门
const isDepartmentTopLevel = ref(false)

// 打开添加部门弹窗
const openAddDepartmentsDialog = () => {
    addDepartmentDialog.value.type = 'ADD'

    addDepartmentDialog.value.dialogVisible = true

    isDepartmentTopLevel.value = false
}
const openEditDepartmentByEditBtn = (row) => {

    const data = toRaw(row)

    addDepartmentDialog.value.form.departmentId = data.departmentId
    addDepartmentDialog.value.form.departmentName = data.departmentName
    addDepartmentDialog.value.form.departmentParentId = data.departmentParentId
    addDepartmentDialog.value.form.departmentSort = data.departmentSort

    isDepartmentTopLevel.value = data.departmentParentId === 0

    addDepartmentDialog.value.type = 'EDIT'

    addDepartmentDialog.value.dialogVisible = true
}

// 添加或者更新
const handleDepartmentDialogEnsure = () => {
    // 空值检查
    if (addDepartmentDialog.value.form.departmentName === null || addDepartmentDialog.value.form.departmentName === '') {
        ElMessage({message: '部门名称不能为空!', type: 'warning',})
        return
    }

    if (addDepartmentDialog.value.type === 'EDIT') {
        handleEditDepartment()
    } else if (addDepartmentDialog.value.type === 'ADD') {
        handleAddDepartment()
    }
}

// 弹窗的添加按钮事件(当是添加的时候) 实际动作
const handleAddDepartment = () => {

    const params = {
        departmentName: addDepartmentDialog.value.form.departmentName,
        departmentParentId: isDepartmentTopLevel.value ? 0 : addDepartmentDialog.value.form.departmentParentId,
        departmentSort: addDepartmentDialog.value.form.departmentSort,
    }
    // 加载状态
    loading.value = true
    // 请求开始
    api.addDepartment(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '添加成功!', type: 'success',})

            // 默认展开当前被添加节点的父亲节点，如果添加的为根节点就没有默认展开
            if (isDepartmentTopLevel.value) {
                defaultExpandedKeys.value = []
            } else {
                defaultExpandedKeys.value = [addDepartmentDialog.value.form.departmentParentId]
            }

            // 参数置空
            addDepartmentDialog.value.form.departmentName = ''
            addDepartmentDialog.value.form.departmentParentId = 0
            addDepartmentDialog.value.form.departmentSort = 0
            // 关闭弹窗
            addDepartmentDialog.value.dialogVisible = false
            // 刷新页面
            doQryListData()
        } else {
            ElMessage({message: '添加失败,请稍后重试!', type: 'error',})
        }
    }).catch(err => {
        ElMessage({message: '添加失败,请稍后重试!', type: 'error',})
    }).finally(() => {
        loading.value = false
    })
}

// 弹窗的修改按钮事件(当是修改的时候)
const handleEditDepartment = () => {

    const params = {
        departmentId: addDepartmentDialog.value.form.departmentId,
        departmentName: addDepartmentDialog.value.form.departmentName,
        departmentSort: addDepartmentDialog.value.form.departmentSort,
        departmentParentId: addDepartmentDialog.value.form.departmentParentId,
    }

    // 加载状态
    loading.value = true
    // 请求开始
    api.updateDepartment(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '修改成功!', type: 'success',})
            // 参数置空
            addDepartmentDialog.value.form.departmentId = 0
            addDepartmentDialog.value.form.departmentName = ''
            addDepartmentDialog.value.form.departmentSort = 1
            addDepartmentDialog.value.form.departmentParentId = 0
            // 关闭弹窗
            addDepartmentDialog.value.dialogVisible = false
            // 刷新页面
            doQryListData()
        } else {
            ElMessage({message: '更新失败,请稍后重试!', type: 'error',})
        }
    }).catch(err => {
        ElMessage({message: '更新失败,请稍后重试!', type: 'error',})
    }).finally(() => {
        loading.value = false
    })
}

// 删除部门 实际动作
const handleDeleteDepartment = (departmentId) => {
    debugger
    const departmentIdLink = getDepartmentIdLink(data.value, departmentId)
    const params = {
        departmentId,
        departmentIdLink,
    }
    api.deleteDepartment(params).then(res => {
        if (res.operation) {
            ElMessage({message: '删除成功!', type: 'success',})
        }
    }).then(err => {

    }).finally(() => {
        init()
    })
}

// 获取树结构部门数据中，某个部门及根部门之间的链路
const getDepartmentIdLink = (data, departmentId) => {
  for(let i = 0; i < data.length; i++) {
      if(data[i].departmentId === departmentId) {
          return data[i].departmentId + ''
      }
      if(data[i].children !== null && data[i].children !== undefined && data[i].children.length > 0) {
          let tempDepartmentId = getDepartmentIdLink(data[i].children, departmentId)
          if(tempDepartmentId !== '') {
              return (data[i].departmentId + ',') + tempDepartmentId
          }
      }
  }
  return ''
}

const doQryListData = () => {
    qryDepartmentsTree()
}


const init = () => {
    doQryListData()
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
