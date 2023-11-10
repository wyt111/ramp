<template>
  <div class="no_placeholder_container">
    <div class="full_name_input" :class="{ full_name_input_active: isFocus }">
      <div class="full-name-tip">
        <input
          v-model.trim="localValue"
          class="name"
          type="text"
          required
          @input="handleInput"
          @focus="inputFocus"
          @blur="inputBlur"
          :maxlength="maxlength"
          :disabled="disabled"
        />
        <div class="input-title">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "noPlaceholderText",
  props: ["maxlength", "vlaue", "title", "disabled", "regex"],
  watch: {
    localValue(value) {
      this.$emit("update:value", value);
    },
    value(newValue) {
      this.localValue = newValue;
    },
  },

  data() {
    return {
      isFocus: false, //输入框是否聚焦
      localValue: this.value,
    };
  },
  methods: {
    // handleInput
    handleInput(event) {
      // 目前只可以输入英文和空格，要在适配其他正则可自行添加一个属性，进行判断
      this.localValue = this.localValue?.replace(/[^a-zA-Z ]/g, "");
      // this.$emit('update:value', this.localValue);
      this.$emit("input", event.target.value);
    },

    // 聚焦
    inputFocus() {
      this.isFocus = true;
      this.$emit("focus");
    },

    // 失去焦点
    inputBlur() {
      this.isFocus = false;
      this.$emit("blur");
    },
  },
};
</script>

<style lang="scss" scoped>
.no_placeholder_container {
  .full_name_input {
    width: 100%;
    border: 1px solid #dbdee3;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    border-radius: 0.06rem;
    height: 0.48rem;
    position: relative;

    .full-name-tip {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      input {
        width: 100%;
        height: 100%;
        border: 0;
        outline: none;
        padding: 0 0.12rem;
        border-radius: 0.06rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.24rem;
        color: #252830;
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
    }
    &:hover {
      border-color: #babfc8;
    }
    &.full_name_input_active {
      border-color: #0059da;
      // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
      .input-title {
        color: #0059da;
      }
    }
  }
  &.error-input {
    .full_name_input {
      border-color: #f53f3f;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);

      .input-title {
        color: #f53f3f;
      }
    }
  }
}
</style>
