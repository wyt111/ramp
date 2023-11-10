<template>
  <!-- 选择 - 单选 -->
  <div id="select-input">
    <div
      class="select-input-content"
      :class="{ inputFocusClass: listStatus, disable }"
      @click.stop="openList"
    >
      <div class="contentView">
        <span v-if="value">{{ $t(value) }}</span>
        <span class="placeholder" v-else>{{ placeholder }}</span>
      </div>
      <div class="right-icon">
        <img
          :class="listStatus ? 'transfromOrigin1' : 'transfromOrigin'"
          v-if="!disable"
          src="@/assets/images/imageTop.png"
          alt=""
        />
      </div>
    </div>
    <div
      :class="!listStatus ? 'bank_typeList bank_typeListShow' : 'bank_typeList'"
    >
      <p
        v-for="item in selectList"
        :key="item.id"
        :class="{ selectItem: item.name === value }"
        @click="selectItem(item)"
      >
        {{ $t(item.name) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "selectInput",
  props: ["value", "selectList", "disable", "placeholder"],
  data() {
    return {
      listStatus: false,
    };
  },
  methods: {
    openList() {
      if (this.disable) {
        return;
      }
      this.listStatus = this.listStatus === true ? false : true;
    },
    selectItem(val) {
      this.$emit("selectItem", val);
      this.listStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
#select-input {
  width: 100%;
  height: 100%;
  position: relative;
  .select-input-content {
    cursor: pointer;
    width: 100%;
    height: 0.48rem;
    background: #ffffff;
    border: 1px solid #dbdee3;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
    border-radius: 0.06rem;
    padding: 0 0.16rem;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border-color: #babfc8;
    }

    .contentView {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.24rem;
      color: #252830;
      .placeholder {
      }
    }
    .right-icon {
      margin-left: auto;
      img {
        height: 0.24rem;
      }
    }

    //禁选样式
    &.inputFocusClass {
      border-color: #0059da;
      // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
    }
  }
}

.transfromOrigin {
  transform: rotate(-180deg);
  transition: 0.35s;
}
.transfromOrigin1 {
  transform: rotate(0deg);
  transition: 0.35s;
}
.bank_typeList {
  position: absolute;
  top: 100%;
  margin-top: 0.04rem;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0px 0px 0.32rem rgba(0, 0, 0, 0.14);
  border-radius: 0.06rem;
  padding: 0.04rem;
  z-index: 999;
  overflow: hidden;
  transition: 0.2s;
  max-height: 1.2rem;
  overflow-y: auto;
  p {
    height: 0.4rem;
    line-height: 0.4rem;
    padding: 0 0.12rem;
    border-radius: 0.04rem;
    font-family: "HarmonyOS Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 0.14rem;
    color: #252830;
    cursor: pointer;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background: #f5f5f5;
    }
    //选中样式
    &.selectItem {
      background: #ededed;
    }
  }
}
//卡类型动画
.bank_typeListShow {
  height: 0 !important;
  opacity: 0 !important;
  overflow: hidden;
  z-index: -1;
}

.disable {
  cursor: no-drop !important;
  background: #f4f8fb !important;
}
</style>
