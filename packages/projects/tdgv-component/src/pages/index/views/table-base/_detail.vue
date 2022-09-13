<route-meta>
{
  "title": "文章详情",
  "isShowSideBar": false
}
</route-meta>
<template>
  <div class="m-detail">
    <div class="g-main-header">
      <div class="inner">
        <span class="l">
          <span class="back" @click="$router.go(-1)"
            ><t-icon name="arrow-left" /><span class="title">详情页面</span></span
          >

          <t-breadcrumb>
            <t-breadcrumbItem href="">上一级</t-breadcrumbItem>
            <t-breadcrumbItem disabled>本级</t-breadcrumbItem>
          </t-breadcrumb>

          <t-divider theme="vertical" />

          <span class="desc">描述文案等信息，可为空。</span>
        </span>

        <span class="r">
          <t-button variant="outline">暂存草稿</t-button>
          <t-button>发布</t-button>
        </span>
      </div>
    </div>

    <div class="page-content">
      <div class="block">
        <h1>1级标题</h1>
        <p>
          薄雾弥漫，云层浓密，日子过得郁闷愁烦，龙脑香在金兽香炉中缭袅。又到了重阳佳节，卧在玉枕纱帐中，半夜的凉气刚将全身浸透。在东篱边饮酒直到黄昏以后，淡淡的黄菊清香溢满双袖。此时此地怎么能不令人伤感呢？风乍起，卷帘而入，帘内的人儿因过度思念身形竟比那黄花还要瘦弱。薄雾弥漫，云层浓密，日子过得郁闷愁烦，龙脑香在金兽香炉中缭袅。又到了重阳佳节，卧在玉枕纱帐中，半夜的凉气刚将全身浸透。在东篱边饮酒直到黄昏以后，淡淡的黄菊清香溢满双袖。此时此地怎么能不令人伤感呢？风乍起，卷帘而入，帘内的人儿因过度思念身形竟比那黄花还要瘦弱。
        </p>
      </div>

      <div class="block">
        <h2>2级标题</h2>
        <p>
          薄雾弥漫，云层浓密，日子过得郁闷愁烦，龙脑香在金兽香炉中缭袅。又到了重阳佳节，卧在玉枕纱帐中，半夜的凉气刚将全身浸透。在东篱边饮酒直到黄昏以后，淡淡的黄菊清香溢满双袖。此时此地怎么能不令人伤感呢？
        </p>
      </div>

      <div class="block">
        <h3>3级标题</h3>
        <p>
          简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容
        </p>
        <ul class="list">
          <li>内容项目</li>
          <li>内容项目</li>
          <li>内容项目</li>
        </ul>
      </div>

      <div class="block">
        <h4>4级标题</h4>
        <p>简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内。</p>
        <t-textarea
          value="简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内容简要描述内。"
          disabled
          placeholder="请输入描述文案"
          name="desc"
        ></t-textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$route);
  },
};
</script>

<style lang="less" scoped>
@container-width: 1184px;

.g-main-header {
  padding: 14px 24px;
  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: @container-width;
    margin: 0 auto;
  }

  .l {
    display: flex;
    align-items: center;
  }

  .back {
    display: flex;
    align-items: center;
    cursor: pointer;

    .title {
      margin: 0 24px 0 12px;
    }
  }

  .t-breadcrumb,
  .desc {
    font-size: 12px;
    font-weight: normal;
    color: #999;
  }

  .t-breadcrumb__item {
    color: #999;

    &:last-child {
      color: #62667a;
    }
  }

  .r {
    .t-button + .t-button {
      margin-left: 8px;
    }
  }
}

.page-content {
  width: @container-width;
  padding: 24px;
  margin: 24px auto;
  background: #fff;
  border-radius: 2px;

  .block + .block {
    margin-top: 24px;
  }

  p {
    margin: 16px 0;
    font-size: 14px;
    line-height: 21px;
  }

  h1 {
    margin: 0;
    font-size: 40px;
    line-height: 60px;
  }

  h2 {
    margin: 0;
    font-size: 32px;
    line-height: 48px;
  }

  h3 {
    margin: 0;
    font-size: 24px;
    line-height: 36px;
  }

  h4 {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
  }

  .list {
    padding: 0;
    margin: 16px 24px 0;
    li {
      padding: 2px 0;
      font-size: 14px;
      color: #3858e6;
    }
  }

  .t-textarea /deep/ textarea {
    line-height: 21px;
  }
}
</style>
