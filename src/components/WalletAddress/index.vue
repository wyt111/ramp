<template>
  <div id="addressForm">
    <div class="formLine">
      <div class="formContent">
        <div class="formTitle">
          {{ $t("WalletAddress_components.title1") }}
          {{ placeOrderQuery.network }}
          {{ $t("WalletAddress_components.title2") }}
          {{ $t("nav.networkAddress_components_title") }}
        </div>
        <p>
          {{
            placeOrderQuery.address
              ? placeOrderQuery.address.substring(0, 10) +
                "……" +
                placeOrderQuery.address.substring(
                  placeOrderQuery.address.length - 10,
                  placeOrderQuery.address.length
                )
              : ""
          }}
        </p>
      </div>
      <p class="copy-icon">
        <copy-img
          v-clipboard:copy="placeOrderQuery.address"
          v-clipboard:success="copySuccess"
          v-clipboard:error="copyError"
        />
      </p>
    </div>
  </div>
</template>

<script>
/**
 * 接收钱包币地址和网络名称的模块
 */
import { mapState } from "vuex";

export default {
  name: "CryptoCurrencyAddress",
  computed: {
    ...mapState("buyPayments", {
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
  },
  methods: {
    copySuccess() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
    copyError() {
      this.$toast({
        duration: 3000,
        message: this.$t("nav.copyTips"),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formLine {
  margin-top: 0.12rem;
  width: 100%;
  min-height: 0.64rem;
  background: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 0.16rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.16rem;
  cursor: pointer;
  .formContent {
    font-family: Medium;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.2rem;
    color: #252830;
    .formTitle {
      font-family: Regular;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #6e7687;
      margin-bottom: 0.08rem;
    }
  }
  .copy-icon {
    margin-left: auto;
    display: flex;
    align-items: center;
    img {
      width: 0.2rem;
    }
  }
}
</style>
