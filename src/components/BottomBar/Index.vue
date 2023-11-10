<template>
  <div class="bottom-bar">
    <merchant-logo v-if="merchantInfo.merchantStatus && merchantLogo" />
    <powered-by v-else />
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "BottomBar",
  props: [],
  components: {},
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
.bottom-bar {
}
</style>
