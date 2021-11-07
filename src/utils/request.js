import axios from 'axios'
const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net/' // 基地址
})
export default request
