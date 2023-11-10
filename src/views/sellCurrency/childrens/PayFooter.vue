<template>
  <footer class="footer" ref="footer_ref">
    <div class="errorTips" v-if="form_errorTips">
      Please fill in all fields with valid information.
    </div>
    <button class="continue" @click="submitPay" v-show="buttonIsShow">
      {{ $t("nav.Confirm") }}
      <img
        class="rightIcon"
        src="@/assets/images/button-right-icon.svg"
        v-if="!request_loading"
      />
      <button-loading v-else class="rightIcon" />
    </button>
    <powered-by
      @setPaddingBottom="
        $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
      "
    />
  </footer>
</template>

<script>
export default {
  name: "PayFooter",
  props: ["payFormType", "disabled", "request_loading", "buttonIsShow"],
  data() {
    return {
      // 表单错误信息
      form_errorTips: false,
    };
  },
  activated() {
    this.form_errorTips = false;
  },
  methods: {
    submitPay() {
      if (this.disabled && !this.request_loading) {
        this.form_errorTips = true;
        this.$emit("getRequest_loading", false);
        return;
      }
      this.form_errorTips = false;
      this.$emit("submitPay");
    },
  },
};
</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  position: sticky;
  left: 0;
  background: #ffffff;
  padding: 0.08rem 0 0;
  z-index: 999;
  .errorTips {
    margin-bottom: 0.05rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.13rem;
    line-height: 0.18rem;
    color: #f53f3f;
  }
  button {
    width: 100%;
    height: 0.48rem;
    border-radius: 0.06rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.19rem;
    text-align: center;
    color: #ffffff;
    .rightIcon {
      width: 0.2rem;
      margin-left: 0.08rem;
      span {
        height: 0.17rem;
      }
    }

    background: #0059da;
    opacity: 1;
    cursor: pointer;
    &:hover {
      background: #0052c9;
    }
    &:active {
      background: #004bb7;
    }
    &[disabled] {
      background: #0059da;
      opacity: 0.2;
      cursor: no-drop;
    }
  }
}
</style>
