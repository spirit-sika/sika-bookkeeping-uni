<script setup lang="ts">
import { DeviceType } from '@/type/ServerType'
import type { CaptchaVO, LoginDTO } from '@/type/ServerType'
import { onMounted, ref } from 'vue';
import { getCaptchaAPI, loginAPI } from '@/api/login';
import { useLoginStore } from '@/store/login';

const loginFrom = ref<LoginDTO>({
  phone: '',
  password: '',
  deviceType: DeviceType.MINI_PROGRAM,
  code: '',
  codeKey: '',
  rememberMe: true
});
const captchaEntity = ref<CaptchaVO>({
  codeKey: '',
  base64: ''
})
const loginStore = useLoginStore()
const showCodeError = ref<boolean>(false)

/**
 * 登录逻辑, 调用登录接口后将接口返回的VO放入pinia
 * 然后跳转页面
 */
const handleLogin = async () => {
  // 登录表单前置校验
  if(loginFrom.value.phone.length === 0 || loginFrom.value.password.length === 0 || loginFrom.value.code.length === 0) {
    return uni.showToast({
      title: '表单项不能为空!',
      icon: 'error'
    })
  }

  // 发起登录请求
  // const {data, code} = await loginAPI(loginFrom.value);
  loginAPI(loginFrom.value)
    .then(res => {
      /* 组件缓存与token本地缓存 */
      const data = res.data
      loginStore.nickname = data.nickname;
      loginStore.sexCode = data.sex;
      loginStore.avatar = data.avatar;
      loginStore.token = data.token;
      uni.setStorage({ key: 'token', data: data.token })

      // 关闭所有页面并打开到目标页面
      uni.showToast({ title: '登录成功!', duration: 1000 })
      uni.reLaunch({
        url: '/pages/index/index'
      })
    })
    .catch(response => {
      if (response.code === 400) {
        showCodeError.value = true;
        getCaptcha()
        loginFrom.value.code = ''
      }
    })
}

/**
 * 获取验证码, 通过验证码的键名进行登录校验
 */
const getCaptcha = async () => {
  const { data } = await getCaptchaAPI();
  captchaEntity.value.codeKey = data.codeKey;
  loginFrom.value.codeKey = data.codeKey;
  captchaEntity.value.base64 = data.base64;
}

onMounted(() => {
  getCaptcha()
})
</script>

<template>

  <view class="login-area">
    <!-- 手机 -->
    <fui-input required label="手机" :bottomLeft="0" placeholder="请输入手机号码" clearable maxlength="11"
      v-model="loginFrom.phone"></fui-input>

    <!-- 密码 -->
    <fui-input required label="密码" :bottomLeft="0" placeholder="请输入密码" maxlength="30" password clearable
      v-model="loginFrom.password"></fui-input>

    <!-- 验证码区域 -->
    <view id="captcha-area">
      <!-- 输入框 -->
      <fui-input required placeholder="请输入验证码" clearable v-model="loginFrom.code" maxlength="5"></fui-input>
      <!-- 图片 -->
      <image :src="captchaEntity.base64" aspectFit id="captcha" @click="getCaptcha"></image>
    </view>
    <text class="error-tips" v-show="showCodeError">验证码错误!</text>

    <view id="loginBtn">
      <fui-button @click="handleLogin">登录</fui-button>
    </view>
  </view>
</template>

<style lang="scss">
.login-area {
  padding: 0 5px;
}

#captcha-area {
  display: flex;
  justify-content: space-between;


  #captcha {
    width: 100px;
    height: 50px;
    margin-right: 10px;
  }
}

#loginBtn {
  margin: 10px auto 0;
  width: 90%;
}

.error-tips {
  color: rgb(246, 102, 102);
  font-size: small;
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>