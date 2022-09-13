<template>
  <div>
    <h3>store中的token和userInfo</h3>
    <t-textarea v-model="storeData"></t-textarea>
    <h3>sessionStorage中的token和userInfo</h3>
    <t-textarea v-model="sessionStorageData"></t-textarea>
    <h3>清除sessionStorage中的token和userInfo</h3>
    <t-button variant="dashed" theme="primary" @click="removeSessionStorageTokenAndUserInfo"
      >清除sessionStorage中的token和userInfo</t-button
    >
    <h3>清除store中的token和userInfo</h3>
    <t-button variant="text" theme="primary" @click="removeStoreTokenAndUserInfo"
      >赋空store中的token和userInfo</t-button
    >
  </div>
</template>

<script>
export default {
  name: 'checkAuthTest',
  data() {
    return {
      storeData: {},
      sessionStorageData: {},
    };
  },
  created() {
    this.getStoreData();
    this.getSessionStorageData();
  },
  methods: {
    getStoreData() {
      const { userInfo, token } = this.$store.state.index;
      this.storeData = JSON.stringify({
        userInfo,
        token,
      });
    },
    getSessionStorageData() {
      const userInfo = sessionStorage.getItem('userInfo') || {};
      const token = sessionStorage.getItem('token') || '';
      this.sessionStorageData = JSON.stringify({
        userInfo,
        token,
      });
    },
    removeSessionStorageTokenAndUserInfo() {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      this.getSessionStorageData();
    },
    removeStoreTokenAndUserInfo() {
      this.$store.commit('SET_USERINFO', {});
      this.$store.commit('SET_TOKEN', '');
      this.getStoreData();
    },
  },
};
</script>

<style lang="less" scoped></style>
