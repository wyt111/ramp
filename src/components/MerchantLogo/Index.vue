<template>
  <div
    class="merchant-logo"
    :class="{ position_index: path == 'index' }"
    v-if="merchantInfo.merchantStatus && merchantLogo"
  >
    <img class="img1" src="@/assets/images/merchant/1.svg" alt="" />
    <img class="img2" src="@/assets/images/merchant/2.svg" alt="" />
    <img class="img3" :src="merchantLogo" alt="" />
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "MerchantLogo",
  props: ["path"],
  data() {
    return {};
  },
  computed: {
    //商户信息
    ...mapState("buyCryptoMerchant", ["merchantInfo", "merchantLogo"]),
  },

  mounted() {
    this.$emit("setPaddingBottom");
  },
  beforeDestroy() {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.merchant-logo {
  display: flex;
  align-items: center;
  justify-content: center;

  padding-top: 0.12rem;
  .img1 {
    height: 0.22rem;
  }
  .img2 {
    height: 0.08rem;
    margin: 0 0.05rem;
  }
  .img3 {
    height: 0.22rem;
  }

  &.position_index {
    justify-content: flex-start;
    height: 0.28rem;
    margin-bottom: 0.26rem;
    padding-top: 0;
    .img1 {
      height: 0.28rem;
    }
    .img2 {
      height: 0.09rem;
      margin: 0 0.08rem;
    }
    .img3 {
      height: 0.28rem;
    }
  }
}
</style>
