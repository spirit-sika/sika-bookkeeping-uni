import type { BaseResponse } from "@/type/ServerType";
import env from "./env";

type HttpMethod = 
  'OPTIONS' 
  | 'GET' 
  | 'HEAD' 
  | 'POST' 
  | 'PUT' 
  | 'DELETE' 
  | 'TRACE' 
  | 'CONNECT' 
  | undefined;

type RequestOptions = {
  url: string, 
  data?: any, 
  method?: HttpMethod, 
  header?: any,
  /* 为 true 时不需要携带token */
  notAuth?: boolean,
  loadingMsg?: string
}  
type reLoginOptions = {
  title?: string,
  content?: string,
  cancelText?: string,
  confirmText?: string
}


/**
 * @todo: 添加响应拦截器处理错误信息, 超时时间
 * @param options 
 * @returns 
 */
const request = <T>(options:RequestOptions): Promise<BaseResponse<T>> => {

  /* 
  1. 处理token, 
  查看方法是否需要携带token, 
  如果需要token在本地获取token添加到请求头
  */
  if(!options.notAuth || options.notAuth === undefined) {
    const token = uni.getStorageSync('token')
    /* 未获取到token提示重新登录 */
    if(!token) {
      reLogin({
        title: '身份验证失败',
        content: '是否前往登录',
        cancelText:'留在页面',
        confirmText:'前往登录'
      });
    }
    options.header = {
      'content-type': 'application/json',
      'sika': `Bearer ${token}`
    }
  }

  return new Promise((resolve, reject) => {
    /* 添加加载蒙层 */
    uni.showLoading({
      title: options.loadingMsg || '加载中',
      mask: true
    })

    /* 发起请求 */
    uni.request({
      url: spliceURL(env.baseUrl, options.url),
      method: options.method,
      data: options.data,
      timeout: env.timeout,
      header: options.header
    })
    /* 结果处理 */
    .then(uniResponse => {
      const data = uniResponse.data as BaseResponse<T>
      uni.hideLoading()
      /* 后端接收到请求但是发生错误 */
      if(data.code !== 200) {
        uni.showToast({
          duration: 2000,
          title: `${data.message}`,
          icon: 'error'
        })
        reject(data)
      }
      /* 处理成功, 执行回调 */
      else {
        resolve(data)
      }
    })
    /* 非后端服务器处理后的异常错误, 屏蔽并统一展示所有未处理的错误 */
    .catch(err => {
      uni.hideLoading()
      uni.showToast({
        title: '服务器开小差了, 请稍后再试',
        duration: 2000
      })
      reject(err)
    })
  })
}

/**
 * 显示蒙层提示用户重新登录,
 * 用户确定后跳转登录页
 */
const reLogin = (options?:reLoginOptions) => {
  uni.showModal({
    title: options?.title || '身份验证失败',
    content: options?.content || '是否重新登录?',
    cancelText: options?.cancelText || '留在页面',
    confirmText: options?.confirmText || '重新登录'
  }).then(modelRes => {
    // reLogin 点击返回结果为:  {errMsg: "showModal:ok", cancel: false, confirm: true, content: null}
    // console.log('reLogin 点击返回结果为: ', modelRes);
    if(modelRes.confirm) {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  })
}

/* 拼接url, 防止配置baseURL 和 api地址之间出现'/'重复或缺失 */
const spliceURL = (baseURL:string, targetURL:string) => {
  if(baseURL.endsWith('/')) {
    baseURL = baseURL.substring(0, baseURL.length-1)
    console.log('new baseURL is ', baseURL);
  }
  if(targetURL.startsWith('/')) {
    targetURL = targetURL.substring(1, targetURL.length)
    console.log('new targetURL is ', targetURL);
  }

  return baseURL + '/' + targetURL;
}

export default request;