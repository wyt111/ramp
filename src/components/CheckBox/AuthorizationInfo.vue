<template>
  <div id="AuthorizationInfo">
    <div class="agreement-content">
      <div class="agreement-radio">
        <el-checkbox v-model="childData.agreement"></el-checkbox>
      </div>
      <div class="agreement-text">
        {{ $t("nav.agreement_components_text1") }}
        <span>{{ $t("nav.agreement_components_text2") }}</span>
        {{ $t("nav.agreement_components_text3") }}
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 勾选协议复选框
 */
export default {
  name: "AuthorizationInfo",
  props: {
    childData: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
#AuthorizationInfo {
  margin-top: 0.18rem;
  .agreement-content {
    display: flex;
    .agreement-radio {
      display: flex;
    }
    .agreement-text {
      font-size: 13px;
      font-family: Regular;
      font-weight: 400;
      color: #6e7687;
      margin-left: 0.08rem;
      margin-top: 0.02rem;
      //text-align: justify;
      word-break: break-all;
      span {
        color: #6e7687;
      }
    }
  }
}

//element-ui复选框
#AuthorizationInfo ::v-deep .el-checkbox__inner:hover {
  border-color: #dfdfdf !important;
}
#AuthorizationInfo ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #0059da;
  border: 1px solid #0059da;

  border-radius: 0.5rem;
}
#AuthorizationInfo ::v-deep .el-checkbox__inner {
  border: 1px solid #dfdfdf;
  border-radius: 0.5rem;
}
</style>
