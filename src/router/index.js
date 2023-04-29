import CmsMain from '../views/CmsMain.vue'
import RequirementList from '../views/requirement/RequirementList.vue'
import RequirementApply from '../views/requirement/RequirementApply.vue'
import RequirementType from '../views/requirement/RequirementTypeList.vue'
import SystemApplicationList from '../views/system_application/SystemApplicationList.vue'
import DepartmentList from '../views/department/DepartmentTree.vue'
import * as VueRouter from 'vue-router'

const routes = [
    {path: '/', component: CmsMain},
    {path: '/requirement/requirementList', component: RequirementList},
    {path: '/requirement/requirementApply', component: RequirementApply},
    {path: '/requirement/requirementType', component: RequirementType},
    {path: '/department/departmentList', component: DepartmentList},
    {path: '/system_application/systemApplicationList', component: SystemApplicationList},
]

let router = VueRouter.createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: VueRouter.createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

router.beforeEach((to, from, next) => {
    document.title = 'CBZ自动化接口系统'

    next()
})


export default router
