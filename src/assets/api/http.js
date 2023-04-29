/**
 * 封装axios
 */
import axios from 'axios';
import {ElMessage} from "element-plus"; // 引入axios

// 创建 Axios 实例
const instance = axios.create({
    baseURL: '/api', // 请求的根路径
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',  // 默认请求类型
    responseType: 'json', // 返回类型
});

// 请求拦截
instance.interceptors.request.use(config => {
    return config;
}, error => {
    return Promise.error(error);
});

// 响应拦截
instance.interceptors.response.use(
    response => {
        if (response.data.code === 200) {
        } else if (response.data.code === 500) {
            ElMessage({message: '系统异常!', type: 'error',})
        } else {
            ElMessage({message: response.data.message, type: 'warning',})
        }
        return Promise.resolve(response.data);
    },
    error => {
        return Promise.reject(error);
    }
);

// GET 方法封装
const get = (url, params) => {
    return instance.get(url, {params}).then((res) => {
        return res.data;
    });
};

// POST 方法封装
const post = (url, data, params = {}) => {
    return instance.post(url, data, params).then((res) => {
        return res.data;
    });
};

export default {
    get, post
}
