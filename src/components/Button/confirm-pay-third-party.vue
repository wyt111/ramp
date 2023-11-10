<template>
  <button
    class="button"
    :disabled="disabled"
    @click="submit"
    :class="{
      loadingDisabled: this.buttonData.triggerNum >= 1 && loadingDisabled,
    }"
    ref="buttonChild_ref"
  >
    <slot v-if="buttonData.customName" />
    <div style="display: flex; align-items: center" v-else>
      <p>
        {{ $t(buttonName) + "" }}
        <span>{{ timeStatus ? timeStatus : "" }}</span>
      </p>
    </div>
    <i v-if="buttonData.loading" class="el-icon-loading loadingIcon"></i>
    <img
      v-else
      class="rightIcon"
      src="../assets/images/button-right-icon.svg"
      alt=""
    />
  </button>
</template>

<script>
/**
 * 第三方收银台确认支付按钮
 * @param {Object}
 *
 */

export default {
  name: "confirm-pay-third-party",
  props: [],
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.button {
  width: 100%;
  height: 0.58rem;
  background: linear-gradient(88.06deg, #0059da 0%, #1bb2f2 100%);
  border-radius: 0.29rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.17rem;
  font-family: Regular;
  font-weight: 400;
  color: #ffffff;
  margin-top: 0.12rem;
  cursor: pointer;
  border: none;
  .rightIcon {
    width: 0.24rem;
    margin-left: 0.08rem;
  }
  .loadingIcon {
    font-size: 0.24rem;
    margin-left: 0.08rem;
  }
}
.button[disabled] {
  opacity: 0.25;
  cursor: no-drop;
}
.loadingDisabled {
  cursor: no-drop !important;
  opacity: 0.25 !important;
}

.continue {
}
.continue:disabled {
  opacity: 0.25;
  cursor: no-drop;
}
</style>
