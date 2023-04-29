<template>

  <!--    条件查询-->
    <div>
        <el-form :inline="true" :model="conditionQueryForm">
            <el-form-item label="系统ID/名称">
                <el-input v-model="conditionQueryForm.applicationSystemName" placeholder="输入系统ID/名称"/>
            </el-form-item>

            <el-form-item>
                <el-button @click="onQueryReset">重置</el-button>
                <el-button type="primary" @click="onConditionQuery">查询</el-button>
            </el-form-item>
        </el-form>
    </div>

  <!--   添加系统-->
    <div style="display: flex;justify-content: right;">
        <el-button type="primary" @click="openAddApplicationSystemsDialog">
            <el-icon>
                <Plus/>
            </el-icon>
            添加系统
        </el-button>
    </div>

    <el-table
            v-loading="loading"
            :data="list"
            element-loading-text="加载中..."
            style="width: 100%">
        <el-table-column label="编号" prop="applicationSystemId"/>
        <el-table-column label="系统名称" prop="applicationSystemName"/>
        <el-table-column label="创建日期" prop="applicationCreateTime"/>

        <el-table-column label="操作" width="170">
            <template #default="scope">
                <el-button size="small" @click="openEditSystemApplicationByEditBtn(scope.$index, scope.row)">
                    <el-icon>
                        <Edit/>
                    </el-icon>
                    修改
                </el-button>

                <el-popconfirm :title="`你确定要删除【${scope.row.applicationSystemName}】系统么?`"
                               width="220"
                               @confirm="handleDeleteSystemApplication(scope.row.applicationSystemId)"
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


  <!--  添加系统对话框-->
    <el-dialog
            v-model="addSystemApplicationDialog.dialogVisible"
            :title="addSystemApplicationDialog.type === 'EDIT' ? '修改系统' : '添加系统'"
            width="30%">
        <div>
            <el-form :model="addSystemApplicationDialog.form" label-width="120px">
                <el-form-item label="系统名称">
                    <el-input v-model="addSystemApplicationDialog.form.applicationSystemName"/>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="addSystemApplicationDialog.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSystemApplicationDialogEnsure">
          <el-icon v-if="addSystemApplicationDialog.type === 'ADD'">
            <Plus/>
          </el-icon>
            <el-icon v-if="addSystemApplicationDialog.type === 'EDIT'">
                <Edit/>
            </el-icon>
          {{ addSystemApplicationDialog.type === 'EDIT' ? '修改' : '添加' }}
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
    applicationSystemName: '' // 编号或者名称查询
})

// 条件查询按钮事件
const onConditionQuery = () => {
    doCondQryListData()
}
// 重置按钮事件
const onQueryReset = () => {
    conditionQueryForm.value.applicationSystemName = ''
    doCondQryListData()
}

// 条件查询
const doCondQryListData = () => {
    let params = {
        pageNum: paginationCpmRef.value.pageInfo.pageNum,
        pageSize: paginationCpmRef.value.pageInfo.pageSize,
        queryParams: {
            applicationSystemName: conditionQueryForm.value.applicationSystemName
        },
    }
    loading.value = true
    api.qryApplicationSystems(params).then(res => {
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
    api.qryApplicationSystems(params).then(res => {
        list.value = res.list
        paginationCpmRef.value.pageInfo.total = res.total
    }).catch(err => {
    }).finally(() => {
        loading.value = false
    })
}

const addSystemApplicationDialog = ref({
    dialogVisible: false,
    form: {
        applicationSystemId: '',
        applicationSystemName: '',
    },
    type: 'EDIT',  // ADD
})

// 打开添加系统应用弹窗
const openAddApplicationSystemsDialog = () => {
    addSystemApplicationDialog.value.form.applicationSystemId = ''
    addSystemApplicationDialog.value.form.applicationSystemName = ''

    addSystemApplicationDialog.value.type = 'ADD'

    addSystemApplicationDialog.value.dialogVisible = true
}
const openEditSystemApplicationByEditBtn = (index, row) => {

    const data = toRaw(row)

    console.log(data.applicationSystemName)

    addSystemApplicationDialog.value.form.applicationSystemId = data.applicationSystemId
    addSystemApplicationDialog.value.form.applicationSystemName = data.applicationSystemName

    addSystemApplicationDialog.value.type = 'EDIT'

    addSystemApplicationDialog.value.dialogVisible = true
}

// 弹窗的修改按钮事件(当是修改的时候)
const handleEditSystemApplication = () => {

    const params = {
        applicationSystemId: addSystemApplicationDialog.value.form.applicationSystemId,
        applicationSystemName: addSystemApplicationDialog.value.form.applicationSystemName
    }

    // 加载状态
    loading.value = true
    // 请求开始
    api.updateApplicationSystem(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '修改成功!', type: 'success',})
            // 参数置空
            addSystemApplicationDialog.value.form.applicationSystemName = ''
            // 关闭弹窗
            addSystemApplicationDialog.value.dialogVisible = false
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
const handleSystemApplicationDialogEnsure = () => {
    // 空值检查
    if (addSystemApplicationDialog.value.form.applicationSystemName === null || addSystemApplicationDialog.value.form.applicationSystemName === '') {
        ElMessage({message: '系统名称不能为空!', type: 'warning',})
        return
    }

    if (addSystemApplicationDialog.value.type === 'EDIT') {
        handleEditSystemApplication()
    } else if (addSystemApplicationDialog.value.type === 'ADD') {
        handleAddSystemApplication()
    }
}

// 弹窗的添加按钮事件(当是添加的时候)
const handleAddSystemApplication = () => {

    const params = {
        applicationSystemName: addSystemApplicationDialog.value.form.applicationSystemName
    }
    // 加载状态
    loading.value = true
    // 请求开始
    api.addApplicationSystem(params).then(res => {
        if (res.operation) {
            // 提示消息
            ElMessage({message: '添加成功!', type: 'success',})
            // 参数置空
            addSystemApplicationDialog.value.form.applicationSystemName = ''
            // 关闭弹窗
            addSystemApplicationDialog.value.dialogVisible = false
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

// 删除系统
const handleDeleteSystemApplication = (applicationSystemId) => {
    const params = {
        applicationSystemId,
    }
    api.deleteApplicationSystem(params).then(res => {
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
