<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
      <button @click="handleLogout">退出登录</button>
      <button @click="handleTest">测试登录状态</button>
      <button @click="handleGetLedger">获取账本</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logoutAPI, testLoginStatusAPI } from '@/api/login';
import { getLedgerAPI } from '@/api/ledger';
import type { StatusBaseQuery } from '@/type/ServerType';
const title = ref('Hello')

const handleLogout = async () => {
  const { data } = await logoutAPI()
  console.log('退出登录结果: ', data);
}

const handleTest = async () => {
  const { data } = await testLoginStatusAPI();
  console.log('测试登录状态结果: ', data);
}

const handleGetLedger = async () => {
  const statusQuery: StatusBaseQuery = {
    pageNum: 1,
    pageSize: 10,
    status: 0,
  }
  const {data} = await getLedgerAPI(statusQuery);
  console.log('getLedger data is ', data);
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
