<template>
  <div class="powered-by">
    <div class="pay-way" v-if="showPayWay">
      <img src="@/assets/images/powered/1.svg" alt="" />
      <img src="@/assets/images/powered/2.svg" alt="" />
      <img src="@/assets/images/powered/3.svg" alt="" />
      <img src="@/assets/images/powered/4.svg" alt="" />
      <img src="@/assets/images/powered/5.svg" alt="" />
    </div>
    <div class="by">
      <span class="text">Powered by</span>
      <img src="@/assets/images/powered/6.svg" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  name: "PoweredBy",
  props: ["showPayWay"],
  data() {
    return {};
  },

  computed: {},

  mounted() {
    this.$emit("setPaddingBottom");
  },
  beforeDestroy() {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.powered-by {
  overflow: hidden;
  background: #fff;
  padding-bottom: 1px;
  // transform: scale(1.2);
  .pay-way {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 0.1rem;
    padding-top: 0.1rem;

    // transform: scale(1.3);

    img {
      width: 0.62rem;

      &:nth-child(1) {
      }
      &:nth-child(2) {
        margin-left: -0.14rem;
      }
      &:nth-child(3) {
        margin-left: -0.2rem;
      }
      &:nth-child(4) {
        margin-left: -0.16rem;
      }
      &:nth-child(5) {
        margin-left: -0.17rem;
        position: relative;
        top: 0.01rem;
      }
    }
    & + .by {
      margin-top: -0.04rem;
      padding-top: 0;
    }
  }
  .by {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 0.01rem;
    padding-top: 0.16rem;
    .text {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.156rem;
      color: #252830;
      margin-right: 0.062rem;
      position: relative;
      top: 0.01rem;
    }
    img {
      width: 0.74rem;
    }
  }
}
</style>
