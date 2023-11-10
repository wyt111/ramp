<template>
  <!-- 填写手机 -->
  <div id="phone-input" :class="{ inputFocusClass }">
    <div class="phone-input-content">
      <div class="title">{{ title }}</div>
      <div class="contentView">
        <div class="areaCode">+{{ areaCode }}</div>
        <div class="input">
          <van-field
            class="number"
            type="number"
            v-model="inputData"
            @input="updateValue"
            @blur="inputBlur('phone')"
            @focus="inputFocus"
            :disabled="disabled"
            :placeholder="placeholder"
            :maxlength="maxlength"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 手机号input组件
 */

export default {
  name: "phoneInput",
  props: [
    "title",
    "areaCode",
    "value",
    "disabled",
    "placeholder",
    "maxlength",
    "type",
  ],
  data() {
    return {
      inputFocusClass: false,
      inputData: this.value,
    };
  },
  methods: {
    updateValue() {
      this.$emit("input", this.inputData);
      if (this.type === "nigeria") {
        this.handlePhone();
      }
    },
    inputBlur() {
      this.inputFocusClass = false;
      this.$emit("blur");
    },
    handlePhone() {
      if (this.inputData?.length > 4) {
        let str = this.inputData.substring(0, 4);
        let str1 = this.inputData.substring(4, this.inputData.length);
        this.inputData = `${str} ${str1}`;
      }
    },
    inputFocus() {
      this.inputFocusClass = true;
      if (this.type === "nigeria") {
        this.$emit("focus");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#phone-input {
  width: 100%;
  min-height: 0.48rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  border: 1px solid #dbdee3;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
  border-radius: 0.06rem;

  .phone-input-content {
    width: 100%;
    padding: 0 0.12rem;
  }
  .title {
    position: absolute;
    left: 0.07rem;
    top: -0.09rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.13rem;
    line-height: 0.18rem;
    color: #5d636d;
    z-index: 1;
    padding: 0 0.04rem;
    background: #fff;
  }
  .contentView {
    display: flex;
    align-items: center;
    justify-content: center;
    .areaCode {
      font-family: "HarmonyOS Sans";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: #252830;
      border-right: 1px solid #dbdee3;
      padding-right: 0.12rem;
    }
    .input {
      width: 100%;
      display: flex;
      position: relative;
    }
  }
  &:hover {
    border-color: #babfc8;
  }

  //输入框焦点样式
  &.inputFocusClass {
    border-color: #0059da;
    // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
    .title {
      color: #0059da;
    }
  }

  &.error-input {
    border-color: #f53f3f;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);

    .title {
      color: #f53f3f;
    }
  }
}
.number {
  padding: 0;
}
#phone-input ::v-deep .van-field__control {
  font-family: "HarmonyOS Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 0.16rem;
  line-height: 0.24rem;
  color: #252830;
  padding-left: 0.12rem;
}
#phone-input ::v-deep .van-field__control:disabled {
  cursor: no-drop;
}
#phone-input ::v-deep .van-field__control::placeholder {
  font-family: "HarmonyOS Sans";
  font-style: normal;
  font-weight: 300;
  font-size: 0.16rem;
  line-height: 0.24rem;
  color: #b7bcc5;
}
#phone-input ::v-deep .number {
}
</style>
