<template>
  <div>
    <slot v-if="showSlot"></slot>
  </div>
</template>

<script>
import api from '@/pages/index/api/demo/request';

export default {
  name: 'CheckAuth',
  data() {
    return {
      showSlot: false,
      userInfo: {},
    };
  },
  created() {
    this.checkAuth();
    if (!window.location.href.includes('/check-auth/')) {
      this.showSlot = true;
    }
  },

  methods: {
    checkAuth() {
      //  1. 判断URL参数是否有token,
      const paramToken = this.getUrlParam('token');
      if (paramToken) {
        this.showSlot = true;
        // 如果URL存在token，根据token获取用户信息
        this.$message.success(`浏览器存在参数token:（${paramToken}），获取用户信息`);
        this.getUserInfo(paramToken);
      } else {
        this.$message.error(`浏览器不存在参数token`);
        this.checkSessionStorageToken();
      }
    },

    checkSessionStorageToken() {
      //  判断sessionStorage是否存在token
      const sessionToken = sessionStorage.getItem('token');
      if (sessionToken) {
        this.showSlot = true;
        const { token } = this.$store.state.index;
        if (sessionToken !== token) {
          this.$message.error(`sessionStorage和store的token不同，用sessionStorage的token获取用户信息`);
          this.getUserInfo(sessionToken);
        } else {
          this.$message.success(`sessionStorage和store的token相同，结束流程`);
        }
      } else {
        this.$message.error(`sessionStorage不存在token，跳转到登录页`);
        this.goToLoginPage();
      }
    },

    getUserInfo(paramToken) {
      //  根据token调用用户信息接口
      console.log(`正在获取用户信息:（${paramToken}）`);
      return api
        .getUserInfo({})
        .then((res) => {
          console.log('====>> String res.data', res.data.data);
          //  把用户信息和新的token存入sessionStorage和
          const { userInfo, token } = res.data.data;
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          sessionStorage.setItem('token', token);
          this.$store.commit('SET_USERINFO', userInfo);
          this.$store.commit('SET_TOKEN', token);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    goToLoginPage() {
      //  跳转到登录页 登录成功后保存用户信息到sessionStorage和state
    },

    getUrlParam(param) {
      const url = window.location.href;
      const p = url.split('?')[1];
      const params = new URLSearchParams(p);
      return params.get(param);
    },
  },
};
</script>
