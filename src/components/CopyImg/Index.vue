<template>
  <img @click="switchUrl" :src="src" alt="" />
</template>
<script>
export default {
  name: "CopyImg",
  data() {
    return {
      copyUrl: require("@/assets/images/paymentResult/5.svg"),
      successUrl: require("@/assets/images/paymentResult/5_1.svg"),
      src: require("@/assets/images/paymentResult/5.svg"),
    };
  },
  computed: {},

  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {
    switchUrl() {
      if (this.src == this.successUrl) {
        return;
      }
      this.src = this.successUrl;
      setTimeout(() => {
        this.src = this.copyUrl;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  cursor: pointer;
}
</style>
