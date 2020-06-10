/**
 * @module npm-js-web-oss
 * @desc web oss操作
 * @author swg [源码地址](http://gitlab.sys.bandubanxie.com/fe/npm/tree/master/npm-js-oss-upload)
 */
import request from '@/utils/request'

// import uuid from 'uuid';
const uuidv4 = require('uuid/v4')

let $script = null
let fileName = ''
export default {
  /**
   * 获取上传路径+文件名
   * @param {obj} file 上传的文件对象
   * @param {string} uploadPathPrefix 后端下发的上传路径
   * @return {string}
   */
  getFileName(file, uploadPathPrefix) {
    let type = null
    let uuid1 = uuidv4()
    // 长度大于1代表有有扩展名
    let arr = file.name.split('.')
    if (arr.length > 1) {
      type = arr[arr.length - 1]
    }

    // 变成.xx格式
    type = type ? `.${type}` : ''
    return `${uploadPathPrefix}${uuid1}${type}`
  },

  /**
   * 从后端获取初始化oss client的参数，以及上传路径
   * 详情见wiki：http://wiki.sys.bandubanxie.com/pages/viewpage.action?pageId=2884647
   * @param {obj} param 前端触发上传时必传的三个参数：resourceType（资源类型：pic、audio、video），platform（上传平台：fe、ios、android、crm），purpose（用途：xxx/xx_xx多单词使用下划线隔开）
   * @return {obj}
   */
  getSts(param) {
    return new Promise((resolve, reject) => {
      let response = request({
        method: 'get',
        params: {
          resourceType: param.resourceType,
          platform: param.platform,
          purpose: param.purpose
        },
        url:
          'https://mobile.yunshuxie.com/v2/mobile/works_set/get/sts_oss_access_authority.json'
      })
      resolve(response)
    })
  },
  /**
   * 使用scriptjs插入js
   */
  addScript() {
    return new Promise((resolve, reject) => {
      $script = require('scriptjs')
      $script.get(
        'https://cdn.yunshuxie.com/vendor/ali-oss/6.1.0/aliyun-oss-sdk.min.js',
        () => {
          resolve(true)
        }
      )
    })
  },
  /**
   * 初始化oss
   * @param {obj} file 上传的文件对象
   * @param {obj} param 前端触发上传时必传的三个参数: 同getSts方法
   * @return {obj}
   */
  async initClient(file, param) {
    let sts = this.getSts(param)
    console.log(sts, 'sts')
    let script = null,
      promiseData = []
    promiseData.push(sts)
    // 如果页面中已经插入了js，则不再插入
    if (
      !document.querySelector(
        "script[src='https://cdn.yunshuxie.com/vendor/ali-oss/6.1.0/aliyun-oss-sdk.min.js']"
      )
    ) {
      script = this.addScript()
      promiseData.push(script)
    }
    let ossClient = null
    let obj = {}
    await Promise.all(promiseData)
      .then(values => {
        let response = values[0].data.data
        fileName = this.getFileName(file, response.uploadPathPrefix)
        if (
          typeof response !== 'string' &&
          response.accessKeyId &&
          response.accessKeySecret &&
          response.securityToken
        ) {
          ossClient = new OSS({
            // eslint-disable-line
            region: 'oss-cn-beijing',
            bucket: 'ysx-sts-upload',
            // STS账号
            accessKeyId: response.accessKeyId,
            accessKeySecret: response.accessKeySecret,
            stsToken: response.securityToken
            // endpoint: 'mobile.yunshuxie.com',
            // cname: true,
          })
        }
        obj = {
          ossClient
        }
        let now = Date.now()
        if (Math.abs(response.nowTime - now) > 800000) {
          obj.flag = 0
          obj.phoneNow = new Date(now)
            .toLocaleString()
            .replace(/:\d{1,2}$/, ' ')
          obj.now = new Date(parseInt(response.nowTime))
            .toLocaleString()
            .replace(/:\d{1,2}$/, ' ')
        } else {
          obj.flag = 1
        }
      })
      .catch(err => {
        console.log(err)
      })
    return obj
  },
  /**
   * 上传资源
   * @param {obj} file 上传的文件对象
   * @param {obj} param 前端触发上传时必传的三个参数: 同getSts方法
   * @return {string}
   */
  upload(file, param) {
    return new Promise((resolve, reject) => {
      this.initClient(file, param)
        .then(obj => {
          if (!obj.flag) {
            // eslint-disable-line
            let err = new Error(
              `您当前的手机时间不合理，当前时间：${obj.now}，您的手机时间：${obj.phoneNow}`
            )
            reject(err)
          } else {
            obj.ossClient
              .put(`${fileName}`, file)
              .then(result => {
                resolve(result.url)
              })
              .catch(err => {
                reject(err)
              })
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
