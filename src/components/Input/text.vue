<template>
  <div id="text-input">
    <div class="text-input-content" :class="{ inputFocusClass }">
      <div class="input-title" :class="{ transparent: disabled }">
        {{ title }}
      </div>
      <div class="input-view">
        <van-field
          class="textInput"
          :type="type"
          v-model="inputData"
          @input="updateValue"
          @blur="inputBlur('phone')"
          @focus="inputFocus"
          :formatter="formatter"
          :disabled="disabled"
          :placeholder="placeholder"
          :maxlength="maxlength"
        />
      </div>
    </div>
  </div>
</template>

<script>
/**
 * input组件
 */

export default {
  name: "textInput",
  props: [
    "title",
    "type",
    "type1",
    "value",
    "disabled",
    "placeholder",
    "maxlength",
  ],
  data() {
    return {
      inputFocusClass: false,
      inputData: "",
    };
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.inputData = val;
      },
    },
  },
  methods: {
    //只能输入英文
    formatter(value) {
      if (this.type === "text") {
        return value.replace(/[^a-zA-Z ]/g, "");
      }
      //多语言输入框 - 特殊字符和数字不能输入
      if (this.type === "MultilingualInput") {
        return value.replace(
          /[`~!#$%^&*()_\-+=<>?:\"{}|,.\/;'\\[\]|0-9]/im,
          ""
        );
      }
      //西班牙语和英文
      if (this.type === "spanish") {
        let regexp = /[\p{sc=Latin} ]/gu;
        return value.match(regexp) !== null ? value.match(regexp).join("") : "";
      }
      // 输入数字 不能输入 -
      if (this.type1 && this.type1 === "pse" && this.type === "number") {
        return value.replace(/-/im, "");
      }
      // 钱包地址输入框 - 英文和数字
      if (this.type === "walletAddress") {
        return value.replace(/[^a-zA-Z0-9]/g, "");
      }
      // 拉丁文姓名
      if (this.type === "latinName") {
        let regexp = /[\p{sc=Latin} -]/gu;
        return value.match(regexp) !== null ? value.match(regexp).join("") : "";
      }
      // 拉丁文地址输入框
      if (this.type === "latinAddress") {
        let regexp = /[\p{sc=Latin}0-9`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/gu;
        return value.match(regexp) !== null ? value.match(regexp).join("") : "";
      }
      // 只能输入 / 和 数字
      if (this.type1 && this.type1 === "nigeria") {
        return value.replace(/[^0-9/]/g, "");
      }
      return value;
    },
    updateValue() {
      this.$emit("input", this.inputData);
    },
    inputBlur() {
      this.inputFocusClass = false;
      if (this.type1 && this.type1 === "pse") {
        this.$parent.FormValidation("id");
      }
      this.$emit("blur");
    },
    inputFocus() {
      this.inputFocusClass = true;
      if (this.type1 === "nigeria") {
        //  || ['latinName','latinAddress'].includes(this.type)
        this.$emit("focus");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#text-input {
  width: 100%;
  height: 0.48rem;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .text-input-content {
    width: 100%;
    border: 1px solid #dbdee3;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    border-radius: 0.06rem;
    overflow: hidden;
    height: 100%;
    &:hover {
      border-color: #babfc8;
    }

    //输入框焦点样式
    &.inputFocusClass {
      border-color: #0059da;
      // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
      .input-title {
        color: #0059da;
      }
    }
    .input-title {
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
    .transparent {
      background: linear-gradient(
        to top,
        #f4f8fb 0%,
        #f4f8fb 50%,
        #fff 51%,
        #fff 100%
      );
    }
    .input-view {
      height: 100%;
      .textInput {
        height: 100%;
        padding: 0;
      }
    }
  }

  &.error-input {
    .text-input-content {
      border-color: #f53f3f;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);

      .input-title {
        color: #f53f3f;
      }
    }
  }
}

#text-input {
  ::v-deep .van-cell__value {
    height: 100%;
    .van-field__body {
      height: 100%;
      .van-field__control {
        height: 100%;
        padding: 0 0.12rem;

        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #252830;
      }
    }
  }
}

//禁止状态
#text-input ::v-deep .van-field__control:disabled {
  cursor: no-drop;
  background: #f4f8fb;
  -webkit-text-fill-color: #252830;
}

//placeholder
#text-input ::v-deep .van-field__control::placeholder {
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 300;
  font-size: 0.16rem;
  line-height: 0.24rem;
  color: #b7bcc5;
}
</style>
