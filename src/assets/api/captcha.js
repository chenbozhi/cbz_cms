import axios from 'axios'

export async function getCaptcha() {
    //二进制方式读取图片流  验证码
    return axios.get("/api/captcha/getCaptcha", {
        responseType: 'arraybuffer'
    })
}
