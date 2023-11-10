<template>
  <div class="top-bar">
    <notice-bar
      :notice-list="noticeList"
      :logo-state="logoState"
      v-if="!logoState && noticeList.length > 0"
    ></notice-bar>
    <kyc-alert></kyc-alert>
  </div>
</template>
<script>
import KycAlert from "@/components/KycAlert/Index.vue";

export default {
  name: "TopBar",
  props: ["noticeList", "logoState"],
  components: {
    KycAlert,
  },
  data() {
    return {};
  },
  computed: {},

  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.top-bar {
  margin-bottom: 0.24rem;
  &:empty {
    margin-bottom: 0;
  }
}

@media (max-width: 791px) {
  .top-bar {
    margin-top: -0.26rem;
    &:empty {
      margin-top: 0;
    }
  }
}
</style>
