<template>
  <div class="ivu-divider ivu-divider-horizontal ivu-divider-with-text-center">
    <span class="ivu-divider-inner-text">
      {{ title }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Divider',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    }
  }
}
</script>

<style scope>

.ivu-divider {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    color: #515a6e;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    background: #e8eaec;
}

.ivu-divider, .ivu-divider-vertical {
    margin: 0 8px;
    display: inline-block;
    height: 0.9em;
    width: 1px;
    vertical-align: middle;
    position: relative;
    top: -0.06em;
}

.ivu-divider-horizontal {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    clear: both;
}

.ivu-divider-horizontal.ivu-divider-with-text-center, .ivu-divider-horizontal.ivu-divider-with-text-left, .ivu-divider-horizontal.ivu-divider-with-text-right {
    display: table;
    white-space: nowrap;
    text-align: center;
    background: transparent;
    font-weight: 500;
    color: #17233d;
    font-size: 16px;
    margin: 16px 0;
}

.ivu-divider-horizontal.ivu-divider-with-text-center:before, .ivu-divider-horizontal.ivu-divider-with-text-left:before, .ivu-divider-horizontal.ivu-divider-with-text-right:before, .ivu-divider-horizontal.ivu-divider-with-text-center:after, .ivu-divider-horizontal.ivu-divider-with-text-left:after, .ivu-divider-horizontal.ivu-divider-with-text-right:after {
    content: '';
    display: table-cell;
    position: relative;
    top: 50%;
    width: 50%;
    border-top: 1px solid #e8eaec;
    -webkit-transform: translateY(50%);
    transform: translateY(50%);
}

.ivu-divider-inner-text {
    display: inline-block;
    padding: 0 24px;
}

.ivu-divider-horizontal.ivu-divider-with-text-center:before, .ivu-divider-horizontal.ivu-divider-with-text-left:before, .ivu-divider-horizontal.ivu-divider-with-text-right:before, .ivu-divider-horizontal.ivu-divider-with-text-center:after, .ivu-divider-horizontal.ivu-divider-with-text-left:after, .ivu-divider-horizontal.ivu-divider-with-text-right:after {
    content: '';
    display: table-cell;
    position: relative;
    top: 50%;
    width: 50%;
    border-top: 1px solid #e8eaec;
    -webkit-transform: translateY(50%);
    transform: translateY(50%);
}

</style>
