<template>
  <div>
    <div class="g-main-header">tooltip-label组件</div>
    <div class="page-content">
      <div class="block">
        <h4>介绍</h4>
        <p>
          tooltip-label组件，用于可能出现超长文本的字符区域。当文本超长时，以...结尾，鼠标移动到文本上，弹出tooltip显示全部文本
        </p>
      </div>

      <div class="block">
        <h4>示例</h4>
        <p>
          <t-divider>demo1：设置最大宽度为数字100</t-divider>
          <tooltip-label :max-width="100" label="当文字长度过长时，使用TDesign的tooltip展示全部数据" />
        </p>

        <p>
          <t-divider>demo2：可使用css的clac计算属性</t-divider>
          <tooltip-label max-width="calc(50px + 50px)" label="当文字长度过长时，使用TDesign的tooltip展示全部数据" />
        </p>

        <p>
          <t-divider>demo3：与t-form配合使用</t-divider>
          <t-form :data="formData" labelWidth="100px">
            <t-form-item name="field1">
              <tooltip-label slot="label" label="一二三四五六七八九十"></tooltip-label>
              <t-input v-model="formData.field1"> </t-input>
            </t-form-item>
            <t-form-item name="field2">
              <tooltip-label slot="label" label="字段2"></tooltip-label>
              <t-input v-model="formData.field2"> </t-input>
            </t-form-item>
          </t-form>
        </p>
      </div>

      <div class="block">
        <h4>Props</h4>
        <p>
          <t-table :data="listData" :columns="columns" rowKey="name" />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listData: [
        {
          name: 'label',
          type: 'String',
          defaultValue: "''",
          required: 'true',
          desc: '文本内容',
        },
        {
          name: 'maxWidth',
          type: 'String | Number',
          defaultValue: '100%',
          required: 'false',
          desc: '文本最大长度',
        },
      ],
      columns: [
        {
          width: '100',
          colKey: 'name',
          title: '名称',
        },
        {
          width: '100',
          colKey: 'type',
          title: '类型',
        },
        {
          width: '100',
          colKey: 'defaultValue',
          title: '默认值',
        },
        {
          width: '100',
          colKey: 'required',
          title: '必传',
        },
        {
          width: '300',
          colKey: 'desc',
          title: '简介',
        },
      ],
      formData: {
        field1: '',
        field2: '',
      },
    };
  },
};
</script>

<style lang="less" scoped>
.page-content {
  padding: 24px;
  margin: 24px;
  background: #fff;
  border-radius: 2px;

  .block + .block {
    margin-top: 36px;
  }

  p {
    margin: 16px 0;
    font-size: 14px;
    line-height: 21px;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }
}
</style>
