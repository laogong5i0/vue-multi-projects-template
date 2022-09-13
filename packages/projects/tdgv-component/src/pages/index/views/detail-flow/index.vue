<route-meta>
{
  "title": "业务配置",
  "isShowSideBar": false
}
</route-meta>
<template>
  <div class="m-detail">
    <div class="g-main-header">
      <div class="inner">
        <span class="l">
          <span class="back" @click="$router.go(-1)"
            ><t-icon name="arrow-left" /><span class="title">业务配置</span></span
          >

          <t-breadcrumb>
            <t-breadcrumbItem href="">上一级</t-breadcrumbItem>
            <t-breadcrumbItem disabled>本级</t-breadcrumbItem>
          </t-breadcrumb>

          <t-divider theme="vertical" />

          <span class="desc">描述文案等信息，可为空。</span>
        </span>
      </div>
    </div>

    <div class="page-content">
      <div class="content">
        <div class="block">
          <div class="sub-title">基础信息</div>
          <div class="descriptions-table">
            <table>
              <tbody>
                <tr class="row">
                  <th class="label">名称</th>
                  <td class="content">腾讯云</td>
                  <th class="label">标题2</th>
                  <td class="content">内容内容内容</td>
                </tr>
                <tr class="row">
                  <th class="label">标题</th>
                  <td class="content" colspan="3">内容内容内容</td>
                </tr>
                <tr class="row">
                  <th class="label">标题</th>
                  <td class="content" colspan="3">内容内容内容</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="block">
          <div class="sub-title">办理进度</div>

          <t-steps direction="vertical" theme="dot" :current="3">
            <t-step-item title="流程结束"></t-step-item>
            <t-step-item title="补齐补正审批" content="2020/09/11"></t-step-item>
            <t-step-item title="第一次审批（需补齐补正）">
              <template slot="extra">
                <div class="extra-content">
                  <t-row>
                    <t-col :span="6">
                      <span class="content">经办人：李四</span>
                    </t-col>
                    <t-col :span="6">
                      <span class="content">审批结果：需补齐补正</span>
                    </t-col>
                  </t-row>
                  <!-- <t-row>
                  <t-col>
                    <span class="content">
                      描述：内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内。</span
                    >
                  </t-col>
                </t-row> -->
                </div>
              </template>
            </t-step-item>
            <t-step-item title="受理">
              <template slot="extra">
                <div class="extra-content">
                  <t-row>
                    <t-col>
                      <span class="content">经办人：李四</span>
                    </t-col>
                  </t-row>
                  <t-row>
                    <t-col>
                      <span class="content">
                        描述：内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内。</span
                      >
                    </t-col>
                  </t-row>
                </div>
              </template>
            </t-step-item>
          </t-steps>
        </div>
      </div>

      <div class="sidebar">
        <div class="block">
          <div class="sub-title">关联标签</div>
          <div class="tags">
            <t-tag size="small">标签标签标签</t-tag>
            <t-tag size="small">标签标签</t-tag>
            <t-tag size="small">标签标签</t-tag>
            <t-tag size="small">5G移动通信</t-tag>
            <t-tag size="small">标签标签</t-tag>
            <t-tag size="small">选项</t-tag>
            <t-tag size="small">标签标签标签</t-tag>
            <t-tag size="small">选项</t-tag>
          </div>
        </div>

        <div class="block">
          <div class="sub-title">相关热点</div>

          <ul class="list">
            <li class="item">
              <p class="title">一条这是一条热点新闻消息等等内容一条这是一条热点新闻消息等等内容</p>
              <p class="desc">2020/12/10 12:00:00</p>
            </li>
            <li class="item">
              <p class="title">一条这是一条热点新闻消息等等内容一条这是一条热</p>
              <p class="desc">2020/12/10 12:00:00</p>
            </li>
            <li class="item">
              <p class="title">一条这是一条热点新闻消息等等内容一条这是一条热</p>
              <p class="desc">2020/12/10 12:00:00</p>
            </li>
            <li class="item">
              <p class="title">一条这是一条热点新闻消息等等内容一条这是一条热</p>
              <p class="desc">2020/12/10 12:00:00</p>
            </li>
          </ul>
        </div>
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
  display: flex;
  width: @container-width;
  margin: 24px auto;
  background: #fff;
  border-radius: 2px;

  .content {
    flex: 1;
    padding: 24px;
  }
}

.sidebar {
  width: 284px;
  padding: 24px;
  background-color: #fff;
  border-left: 1px solid rgba(39, 40, 46, 0.08);

  .tags {
    margin-bottom: -8px;
    .t-tag {
      margin: 0 8px 8px 0;
    }
  }

  .list {
    padding: 0;
    margin-top: -24px;
    list-style: none;

    .item {
      padding: 20px 0 16px;
      border-bottom: 1px solid rgba(39, 40, 46, 0.08);
    }

    .title {
      margin: 0;
      line-height: 22px;
      color: #62667a;
    }

    .desc {
      margin: 4px 0 0;
      font-size: 12px;
      line-height: 20px;
      color: #999;
    }
  }
}

.block {
  margin-bottom: 40px;
}

.sub-title {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #27282e;
}

.descriptions-table {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgba(39, 40, 46, 0.08);
  border-radius: 2px;

  > table {
    width: 100%;
    background: #fff;
    border-collapse: collapse;
    table-layout: auto;
  }

  .row {
    border-bottom: 1px solid rgba(39, 40, 46, 0.08);

    &:last-child {
      border-bottom: 0;
    }
  }

  .label {
    color: #62667a;
    background: #fafafa;
  }

  .content {
    color: #27282e;
  }

  .label,
  .content {
    padding: 11px 16px;
    font-weight: normal;
    line-height: 22px;
    border-right: 1px solid rgba(39, 40, 46, 0.08);

    &:last-child {
      border-right: 0;
    }
  }
}

.t-steps /deep/ .t-steps-item__inner {
  width: 100%;
}

.t-steps /deep/ .t-steps-item-content {
  width: 100%;
  margin-right: 16px;
}

.t-steps /deep/ .t-steps-item-extra .extra-content {
  padding: 12px 16px;
  font-size: 12px;
  line-height: 20px;
  color: #62667a;
  background: #f7f8fa;
  border-radius: 2px;

  .t-row + .t-row {
    margin-top: 8px;
  }
}
</style>
