import request from "@/utils/request"
import type { CaptchaVO, LoginDTO, LoginVO } from "@/type/ServerType"

/**
 * 获取验证码接口
 * @returns 验证码键值对
 */
export const getCaptchaAPI = () => {
  return request<CaptchaVO>({
    url: 'user/captcha',
    method: 'GET',
    notAuth: true
  })
}

export const loginAPI = (loginDTO: LoginDTO) => {
  return request<LoginVO>({
    url: 'user/login',
    method: 'POST',
    data: loginDTO,
    notAuth: true,
    loadingMsg: '登录中'
  })
}

export const logoutAPI = () => {
  return request<string>({
    url: 'user/logout',
    method: 'POST',
    notAuth: false,
    loadingMsg: '退出登录...'
  })
}

export const testLoginStatusAPI = () => {
  return request<string>({
    url: 'greeting',
    method: 'GET',
    notAuth: false,
    loadingMsg: '测试登录状态...'
  })
}