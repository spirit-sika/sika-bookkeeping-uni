import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoginStore = defineStore('loginStore', ()=> {
  /** 显示名称 */
  const nickname = ref<string>('');
  /** 性别 0未知, 1男, 2女 */
  const sexCode = ref<number>(0);
  /** 头像url */
  const avatar = ref<string>('');
  /** token */
  const token = ref<string>('');

  /* 将性别代码转为文字 */
  const sex = computed(() => {
    switch(sexCode.value) {
      case 1: '男';
      case 2: '女';
      default: '未知';
    }
  })


  return {
    nickname,
    sexCode,
    sex,
    avatar,
    token
  }
})