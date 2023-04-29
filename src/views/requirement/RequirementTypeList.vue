<template>

  <!--    条件查询-->
    <div>
        <el-form :inline="true" :model="conditionQueryForm">
            <el-form-item label="需求类型ID/名称">
                <el-input v-model="conditionQueryForm.requirementTypeName" placeholder="输入需求类型ID/名称"/>
            </el-form-item>

            <el-form-item>
                <el-button @click="onQueryReset">重置</el-button>
                <el-button type="primary" @click="onConditionQuery">查询</el-button>
            </el-form-item>
        </el-form>
    </div>

  <!--   添加需求类型-->
    <div style="display: flex;justify-content: right;">
        <el-button type="primary" @click="openAddRequirementTypesDialog">
            <el-icon>
                <Plus/>
            </el-icon>
            添加需求类型
        </el-button>
    </div>

    <el-table
            v-loading="loading"
            :data="list"
            element-loading-text="加载中..."
            style="width: 100%">
        <el-table-column label="编号" prop="requirementTypeId"/>
        <el-table-column label="需求类型名称" prop="requirementTypeName"/>

        <el-table-column label="操作" width="170">
            <template #default="scope">
                <el-button size="small" @click="openEditRequirementTypeByEditBtn(scope.$index, scope.row)">
                    <el-icon>
                        <Edit/>
                    </el-icon>
                    修改
                </el-button>

                <el-popconfirm :title="`你确定要删除【${scope.row.requirementTypeName}】类型么?`"
                               width="220"
                               @confirm="handleDeleteRequirementType(scope.row.requirementTypeId)"
                >
                    <template #reference>
                        <el-button size="small" type="danger">
                            <el-icon>
                                <Delete/>
                            </el-icon>
                            删除
                        </el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>

    <PaginationCpm ref="paginationCpmRef" @on-change="doQryListData"/>


  <!--  添加需求类型对话框-->
    <el-dialog
            v-model="addRequirementTypeDialog.dialogVisible"
            :title="addRequirementTypeDialog.type === 'EDIT' ? '修改需求类型' : '添加需求类型'"
            width="30%">
        <div style="margin-right: 20px;">
            <el-form :model="addRequirementTypeDialog.form" label-width="120px">
                <el-form-item label="需求类型名称">
                    <el-input v-model="addRequirementTypeDialog.form.requirementTypeName"/>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="addRequirementTypeDialog.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRequirementTypeDialogEnsure">
          <el-icon v-if="addRequirementTypeDialog.type === 'ADD'">
            <Plus/>
          </el-icon>
            <el-icon v-if="addRequirementTypeDialog.type === 'EDIT'">
                <Edit/>
            </el-icon>
          {{ addRequirementTypeDialog.type === 'EDIT' ? '修改' : '添加' }}
        </el-button>
      </span>
        </template>
    </el-dialog>

</template>

<script setup>

import {onMounted, ref} from "vue";
import api from "../../assets/api/index.js";
import PaginationCpm from "../../components/PaginationCpm.vue";
import {ElMessage} from "element-plus";

import {toRaw} from '@vue/reactivity'

const paginationCpmRef = ref(null)

const list = ref([])

const loading = ref(false)

const conditionQueryForm = ref({
    requirementTypeName: '' // 编号或者名称查询
})

// 条件查询按钮事件
const onConditionQuery = () => {
    doCondQryListData()
}
// 重置按钮事件
const onQueryReset = () => {
    conditionQueryForm.value.requirementTypeName = ''
    doCondQryListData()
}

// 条件查询
const doCondQryListData = () => {
    let params = {
        pageNum: paginationCpmRef.value.pageInfo.pageNum,
        pageSize: paginationCpmRef.value.pageInfo.pageSize,
        queryParams: {
            requirementTypeName: conditionQueryForm.value.requirementTypeName
        },
    }
    loading.value = true
    api.qryRequirementTypes(params).then(res => {
        list.value = res.list
        paginationCpmRef.value.pageInfo.total = res.total
    }).catch(err => {
    }).finally(() => {
        loading.value = false
    })
}

const doQryListData = () => {
    let params = {
        pageNum: paginationCpmRef.value.pageInfo.pageNum,
        pageSize: paginationCpmRef.value.pageInfo.pageSize
    }
    loading.value = true
    api.qryRequirementTypes(params).then(res => {
        list.value = res.list
        paginationCpmRef.value.pageInfo.total = res.total
    }).catch(err => {
    }).finally(() => {
        loading.value = false
    })
}

const addRequirementTypeDialog = ref({
    dialogVisible: false,
    form: {
        requirementTypeId: '',
        requirementTypeName: '',
    },
    type: 'EDIT',  // ADD
})

// 打开添加需求类型应用弹窗
const openAddRequirementTypesDialog = () => {
    addRequirementTypeDialog.value.form.requirementTypeId = ''
    addRequirementTypeDialog.value.form.requirementTypeName = ''

    addRequirementTypeDialog.value.type = 'ADD'

    addRequirementTypeDialog.value.dialogVisible = true
}
const openEditRequirementTypeByEditBtn = (index, row) => {

    const data = toRaw(row)

    console.log(data.requirementTypeName)

    addRequirementTypeDialog.value.form.requirementTypeId = data.requirementTypeId
    addRequirementTypeDialog.value.form.requirementTypeName = data.requirementTypeName

    addRequirementTypeDialog.value.type = 'EDIT'

    addRequirementTypeDialog.value.dialogVisible = true
}

// 弹窗的修改按钮事件(当是修改的时候)
const handleEditRequirementType = () => {

    const params = {
        requirementTypeId: addRequirementTypeDialog.value.form.requirementTypeId,
        requirementTypeName: addRequirementTypeDialog.value.form.requirementTypeName
    }

    // 加载状态
    loading.value = true
    // 请求开始
    api.updateRequirementType(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '修改成功!', type: 'success',})
            // 参数置空
            addRequirementTypeDialog.value.form.requirementTypeName = ''
            // 关闭弹窗
            addRequirementTypeDialog.value.dialogVisible = false
            // 更新无需重置分页
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

const init = () => {
    doQryListData()
}

// 添加或者更新
const handleRequirementTypeDialogEnsure = () => {
    // 空值检查
    if (addRequirementTypeDialog.value.form.requirementTypeName === null || addRequirementTypeDialog.value.form.requirementTypeName === '') {
        ElMessage({message: '需求类型名称不能为空!', type: 'warning',})
        return
    }

    if (addRequirementTypeDialog.value.type === 'EDIT') {
        handleEditRequirementType()
    } else if (addRequirementTypeDialog.value.type === 'ADD') {
        handleAddRequirementType()
    }
}

// 弹窗的添加按钮事件(当是添加的时候)
const handleAddRequirementType = () => {

    const params = {
        requirementTypeName: addRequirementTypeDialog.value.form.requirementTypeName
    }
    // 加载状态
    loading.value = true
    // 请求开始
    api.addRequirementType(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '添加成功!', type: 'success',})
            // 参数置空
            addRequirementTypeDialog.value.form.requirementTypeName = ''
            // 关闭弹窗
            addRequirementTypeDialog.value.dialogVisible = false
            // 重置分页
            paginationCpmRef.value.pageInfo.pageNum = 1
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

// 删除需求类型
const handleDeleteRequirementType = (requirementTypeId) => {
    const params = {
        requirementTypeId,
    }
    api.deleteRequirementType(params).then(res => {
        if (res.operation) {
            ElMessage({message: '删除成功!', type: 'success',})
        }
    }).then(err => {

    }).finally(() => {
        init()
    })
}

onMounted(() => {
    init()
})
</script>

<style scoped>

</style>
