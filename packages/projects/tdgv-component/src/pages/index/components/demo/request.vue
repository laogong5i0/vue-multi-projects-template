<template>
  <div>
    <h2>apiTest</h2>
    <h3>getAppUserDetails:</h3>
    <div>
      <strong>method: getApiGetAppUserDetails</strong>
      <t-textarea :value="JSON.stringify(appUserDetailsData)"></t-textarea>
    </div>

    <h3>checkLogin:</h3>
    <div>
      <strong>method: getApiCheckLoginRes</strong>
      <t-textarea :value="JSON.stringify(checkLoginData)"></t-textarea>
    </div>
  </div>
</template>

<script>
import api from '@/pages/index/api/demo/request';

export default {
  name: 'DemoRequest',
  data() {
    return {
      oldSuccessRes: '',
      oldFailRes: '',
      successRes: '',
      failRes: '',
      errRes: '',
      appUserDetailsData: '',
      checkLoginData: '',
    };
  },

  mounted() {
    this.getApiSuccess();
    this.getApiFail();
    this.getApiError();
    this.getOldApiSuccess();
    this.getOldApiFail();
    this.getApiSuccessArray();
    this.getApiSuccessBoolean();
    this.getApiSuccessNumber();
    this.getApiSuccessString();

    this.initPage();
  },

  methods: {
    async initPage() {
      console.log('开始请求');
      //  测试同步
      const appUserDetailsDataTest = await this.getApiGetAppUserDetails();
      console.log('this.appUserDetailsData');
      console.log(this.appUserDetailsData);

      console.log('appUserDetailsDataTest');
      console.log(appUserDetailsDataTest);

      await this.getApiCheckLogin();
      //  测试mock
      this.getApiTestMock();
      console.log('this.checkLoginData');
      console.log(this.checkLoginData);
      console.log('完成请求');
    },

    getApiSuccess() {
      return api
        .success({
          params: {
            testParam1: 1,
            testParam2: {
              objKey: {
                key1: '1-1-1',
                testArr: [
                  {
                    keyValue: {
                      key: 'test',
                    },
                    string1: 'string value',
                  },
                ],
              },
              key2: '1-2',
            },
          },
        })
        .then((res) => {
          this.successRes = JSON.stringify(res);
        });
    },

    getApiFail() {
      return api
        .fail({
          data: {
            dataStr: 'sdfsdf',
            dataObj: {
              dataArray: [
                {
                  dataStr1: 'xxxx',
                  dataObj1: {
                    check: 'checked',
                  },
                },
              ],
            },
          },
          params: {
            testParam2: {
              key1: '1-1',
              key2: '1-2',
            },
          },
        })
        .then((res) => {
          console.log('====>> res', res);
        })
        .catch((err) => {
          this.failRes = JSON.stringify(err);
        });
    },

    getApiError() {
      return api.error().catch((err) => {
        this.errRes = JSON.stringify(err);
      });
    },

    getOldApiSuccess() {
      return api
        .oldSuccess({
          testParam1: 1,
          testParam2: {
            key1: '1-1',
            key2: '1-2',
          },
        })
        .then((res) => {
          this.oldSuccessRes = JSON.stringify(res);
        });
    },

    getOldApiFail() {
      return api
        .oldFail()
        .then((res) => {
          this.oldFailRes = JSON.stringify(res);
        })
        .catch((err) => {
          this.oldFailRes = JSON.stringify(err);
        });
    },

    getApiSuccessArray() {
      return api.successArray({}).then((res) => {
        console.log('====>> Array res', res);
      });
    },

    getApiSuccessBoolean() {
      return api.successBoolean({}).then((res) => {
        console.log('====>> Boolean res', res);
      });
    },

    getApiSuccessNumber() {
      return api.successNumber({}).then((res) => {
        console.log('====>> Number res', res);
      });
    },

    getApiSuccessString() {
      return api
        .successString({})
        .then((res) => {
          console.log('====>> String res', res);
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getApiGetAppUserDetails() {
      return api
        .getAppUserDetails({})
        .then((res) => {
          console.log('====>> String res', res);
          this.appUserDetailsData = res.data;
          return res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getApiCheckLogin() {
      return api
        .checkLogin({})
        .then((res) => {
          console.log('====>> String res', res);
          this.checkLoginData = res.data;
          return res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },

    getApiTestMock() {
      return api
        .testMock({})
        .then((res) => {
          console.log('====>> String res', res);
          this.checkLoginData = res.data;
          return res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>
