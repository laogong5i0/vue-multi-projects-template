<template>
  <t-content style="padding: 24px">
    <t-checkbox v-model="isClassify">是否分类</t-checkbox>
    <t-checkbox v-model="isObject">数据是否对象类型</t-checkbox>
    <t-divider />
    <t-row :gutter="16">
      <t-col>
        <t-button @click="isShowProduct = true">编辑分组选择器弹窗(单列表)</t-button>
      </t-col>
    </t-row>
    <t-divider />
    <t-row :gutter="16">
      <t-col>
        <t-button @click="isShowPerson = true">人员选择器(双列表，自定义左侧内容)</t-button>
      </t-col>
    </t-row>
    <t-divider />
    <p>选中的值：</p>
    <pre v-html="result"></pre>
    <g-select-dialog
      ref="selectDialog"
      v-model="productItems"
      :visible.sync="isShowProduct"
      :width="460"
      title="编辑分组"
      target-text="分组"
      :object-key="isObject ? 'id' : undefined"
      :classify="isClassify"
      :element-lists="productLists"
      :disabled-values="productDisabledDefaultValue"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template slot="search">
        <g-search
          :width="250"
          placeholder="请输入搜索内容"
          :option-key="searchOptionKey"
          :element-lists="searchElementLists"
          :disabled-values="[]"
          @change="handleSearchChange"
          @enter="handleSearchEnter"
          @click="handleSearchClick"
        />
        <!-- <t-input placeholder="自定义搜索框"></t-input> -->
      </template>
    </g-select-dialog>
    <g-select-dialog
      v-model="personItems"
      :visible.sync="isShowPerson"
      :width="720"
      :left-width-percent="26"
      :object-key="isObject ? 'id' : undefined"
      target-text="成员"
      :classify="isClassify"
      :element-lists="elementLists"
      :disabled-values="personDisabledDefaultValue"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template slot="search">
        <g-search
          :width="250"
          placeholder="请输入搜索内容"
          :option-key="searchOptionKey"
          :element-lists="searchElementLists"
          @change="handleSearchChange"
          @enter="handleSearchEnter"
          @click="handleSearchClick"
        />
      </template>
      <template slot="leftContent">
        <t-list stripe>
          <t-list-item @click.native="clickItem(0)">企业微信</t-list-item>
          <t-list-item @click.native="clickItem(1)">腾讯会议</t-list-item>
          <t-list-item @click.native="clickItem(2)">QQ管家</t-list-item>
        </t-list>
      </template>
    </g-select-dialog>
  </t-content>
</template>

<script>
import { GSelectDialog, GSearch } from '@wecity/tdesign-gov-vue';

const productString = [
  {
    label: '商务组',
    value: 'sw',
  },
  {
    label: '产品组',
    value: 'cp',
  },
  {
    label: '项目组',
    value: 'xm',
  },
  {
    label: '运营组',
    value: 'yy',
  },
  {
    label: '市场组',
    value: 'sc',
  },
  {
    label: '视觉组',
    value: 'sj',
  },
  {
    label: '交互组',
    value: 'jh',
  },
  {
    label: '重构组',
    value: 'cg',
  },
  {
    label: '前端组',
    value: 'qd',
  },
  {
    label: '后端组',
    value: 'hd',
  },
  {
    label: '测试组',
    value: 'cs',
  },
  {
    label: '运维组',
    value: 'yw',
  },
];
const productObject = [
  {
    label: '商务组',
    value: {
      id: 'sw',
    },
  },
  {
    label: '产品组',
    value: {
      id: 'cp',
    },
  },
  {
    label: '项目组',
    value: {
      id: 'xm',
    },
  },
  {
    label: '运营组',
    value: {
      id: 'yy',
    },
  },
  {
    label: '市场组',
    value: {
      id: 'sc',
    },
  },
  {
    label: '视觉组',
    value: {
      id: 'sj',
    },
  },
  {
    label: '交互组',
    value: {
      id: 'jh',
    },
  },
  {
    label: '重构组',
    value: {
      id: 'cg',
    },
  },
  {
    label: '前端组',
    value: {
      id: 'qd',
    },
  },
  {
    label: '后端组',
    value: {
      id: 'hd',
    },
  },
  {
    label: '测试组',
    value: {
      id: 'cs',
    },
  },
  {
    label: '运维组',
    value: {
      id: 'yw',
    },
  },
];
const valueObject0 = [
  {
    label: '章三说asdsafdasfdsafads',
    description: '22@qq.com',
    value: {
      id: '1',
      info: 'a',
    },
  },
  {
    label: '章利斯章三asdsafdasfdsafads',
    description: '11@qq.com',
    value: {
      id: '2',
      info: 'b',
    },
  },
  {
    label: 'aaaaaaaaaaaaaaaaaaaaaaaaabbbbb',
    value: {
      id: '3',
    },
  },
];
const valueObject1 = [
  {
    label: '1Account',
    value: {
      id: '11',
    },
    description: '1122@qq.com',
  },
  {
    label: '丁一',
    value: {
      id: '12',
    },
  },
];
const valueObject2 = [
  {
    label: '2ccount',
    value: {
      id: '21',
    },
    description: '21@qq.com',
  },
  {
    label: 'Smile',
    value: {
      id: '22',
    },
    description: '12@qq.com',
  },
];
const valueString0 = [
  {
    label: 'AA',
    value: '1',
    description: '22@qq.com',
  },
  {
    label: 'BB',
    value: '2',
  },
  {
    label: '张三',
    value: '3',
  },
  {
    label: '李四',
    value: '4',
  },
  {
    label: 'DDccount',
    value: '5',
  },
  {
    label: '233',
    value: '6',
  },
  {
    label: '王五',
    value: '7',
  },
];
const valueString1 = [
  {
    label: '1Account',
    value: '11',
    description: '1122@qq.com',
  },
  {
    label: '丁一',
    value: '12',
  },
];
const valueString2 = [
  {
    label: '2ccount',
    value: '21',
    description: '21@qq.com',
  },
  {
    label: 'Smile',
    value: '22',
    description: '12@qq.com',
  },
];
const stringList = [valueString0, valueString1, valueString2];
const objectList = [valueObject0, valueObject1, valueObject2];
// const objectContent = [
//   {
//     label: '章利斯章三asdsafdasfdsafads',
//     description: '11@qq.com',
//     value: {
//       id: 'b',
//       info: '2',
//     },
//   },
//   {
//     label: '2ccount',
//     value: {
//       id: '21',
//     },
//     description: '21@qq.com',
//   },
// ];
// const stringContent = [
//   {
//     label: 'BB',
//     value: '2',
//   },
//   {
//     label: '2ccount',
//     value: '21',
//     description: '21@qq.com',
//   },
// ];
export default {
  components: {
    GSelectDialog,
    GSearch,
  },

  data() {
    return {
      isClassify: false, // 是否分类
      isObject: false, // 数据是否对象类型
      isShowPerson: false,
      isShowProduct: false,
      elementIndex: 0,
      optionKey: {
        label: 'name',
        value: 'key',
        description: 'content',
      },
      searchOptionKey: {
        label: 'label',
        value: 'value',
        description: 'description',
        info: 'info',
      },
      productDisabledDefaultValue: ['sw', 'sc'],
      productItems: [
        {
          label: '运营组',
          value: 'yy',
        },
        {
          label: '市场组',
          value: 'sc',
        },
      ],
      personItems: [],
      personDisabledDefaultValue: ['2'],
      result: {},
      searchElementLists: [],
    };
  },
  computed: {
    productLists() {
      return this.isObject ? productObject : productString;
    },
    elementLists() {
      return this.isObject ? objectList[this.elementIndex] : stringList[this.elementIndex];
    },
    // personDefaultContent() {
    //   // 切换源数据(elementLists)的情况下，需要传入完整的选中数据，否则无法展示内容
    //   return this.isObject ? objectContent : stringContent;
    // },
  },
  watch: {
    productItems() {
      console.log('productItems', this.productItems);
    },
    isObject() {
      this.productItems = [];
      this.personItems = [];
    },
  },
  methods: {
    clickItem(index) {
      this.elementIndex = index;
    },
    handleOk(value) {
      this.result = value;
      console.log('ok', value);
    },
    handleCancel(value) {
      console.log('cancel', value);
    },
    handleSearchChange(value, context) {
      console.log('example change', value, context);
      const searchElementLists = [];
      for (let index = 0; index < 10; index++) {
        searchElementLists.push({
          label: `${value}${index}`,
          value: `${value}${index}`,
          description: `abcd${index}@qq.com`,
          info: '广东省/广州市/天河区',
        });
      }
      this.searchElementLists = searchElementLists;
    },
    handleSearchEnter(value, context) {
      console.log('example enter', value, context);
    },
    handleSearchClear(context) {
      console.log('example clear', context);
    },
    handleSearchClick(element, index) {
      console.log('example click', element, index);
      // TODO： 此处业务自行处理数据
      // this.$refs.selectDialog.add(element);
      // this.$refs.selectDialog.remove(element);
      this.clickItem((this.elementIndex + 1) % 3); // 模拟：分组数据跳转到选中元素所在分组
    },
  },
};
</script>
