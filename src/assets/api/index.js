/**
 * 统一接口管理
 */

import http from "./http.js";

export default {

    // 分页查询需求列表
    qryRequirements(data) {
        return http.post('/requirement/qryRequirements', data)
    },

    /* *************************系统应用************************************************ */
    // 分页查询系统列表
    qryApplicationSystems(data) {
        return http.post('/applicationSystem/qryApplicationSystems', data)
    },

    // 添加系统应用
    addApplicationSystem(data) {
        return http.post('/applicationSystem/addApplicationSystem', data)
    },

    // 删除系统应用
    deleteApplicationSystem(data) {
        return http.post('/applicationSystem/deleteApplicationSystem', data)
    },

    // 修改系统应用
    updateApplicationSystem(data) {
        return http.post('/applicationSystem/updateApplicationSystem', data)
    },

    /* *************************需求类型************************************************ */
    // 分页查询需求类型列表
    qryRequirementTypes(data) {
        return http.post('/requirementType/qryRequirementTypes', data)
    },

    // 添加需求类型
    addRequirementType(data) {
        return http.post('/requirementType/addRequirementType', data)
    },

    // 删除需求类型
    deleteRequirementType(data) {
        return http.post('/requirementType/deleteRequirementType', data)
    },

    // 修改需求类型
    updateRequirementType(data) {
        return http.post('/requirementType/updateRequirementType', data)
    },

    /* *************************需求部门************************************************ */
    // 查询部门树结构
    qryDepartmentsTree(data) {
        return http.post('/department/qryDepartments', data)
    },
}
