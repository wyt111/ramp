<template>
  <div id="text-input">
    <div class="text-input-content" :class="{ inputFocusClass }">
      <div class="input-title">{{ title }}</div>
      <div class="input-view">
        <van-field
          class="textInput"
          :type="type"
          v-model="inputData"
          @input="updateValue"
          @blur="inputBlur('phone')"
          @focus="inputFocus"
          :disabled="disabled"
          :placeholder="placeholder"
          :maxlength="maxlength"
        />
        <!-- :formatter="formatter" -->
      </div>
    </div>
  </div>
</template>

<script>
/**
 * number input组件
 */

export default {
  name: "numberInput",
  props: ["title", "type", "value", "disabled", "placeholder", "maxlength"],
  data() {
    return {
      inputFocusClass: false,
      inputData: this.value,
    };
  },
  methods: {
    //只能输入英文
    // formatter(value) {
    //   return value.replace(/[^a-zA-Z ]/g, '');
    // },
    updateValue() {
      this.$emit("input", this.inputData);
    },
    inputBlur() {
      this.inputFocusClass = false;
    },
    inputFocus() {
      this.inputFocusClass = true;
    },
  },
};
</script>

<style lang="scss" scoped>
#text-input {
  display: flex;
  align-items: center;
  justify-content: center;
  .text-input-content {
    width: 100%;
    min-height: 0.64rem;
    background: #ffffff;
    border: 1px solid #ebebeb;
    border-radius: 0.16rem;
    padding: 0 0.16rem;
    margin: auto;
    .input-title {
      font-family: Regular;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #6e7687;
      margin-top: 0.12rem;
    }
    .input-view {
      width: 100%;
      height: 100%;
      margin-top: 0.08rem;
      .textInput {
        border: none;
        width: 100%;
        min-height: 0.2rem;
        background: #ffffff;
        font-family: Medium;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
        padding: 0;
      }
    }
  }
}

//禁止状态
#text-input ::v-deep .van-field__control:disabled {
  cursor: no-drop;
}

//placeholder
#text-input ::v-deep .van-field__control::placeholder {
  font-family: Regular;
  font-weight: 400;
  font-size: 0.16rem;
  line-height: 0.2rem;
  color: #bfbfbf;
}

//输入框焦点样式
.inputFocusClass {
  border: 1px solid #0059da !important;
}
</style>
