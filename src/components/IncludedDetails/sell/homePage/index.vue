<template>
  <!-- Payment information -->
  <div class="paymentInformation">
    <!-- 详细费用信息 -->
    <div class="fee-content">
      <div class="fee-content-title" @click="expandCollapse">
        <div class="left">
          {{ $t("buyFee_components.youOrder") }}
        </div>
        <div class="right">
          <span>{{ cryptoAmount }} {{ cryptoInfo.crypto }}</span>
          {{ $t("sellFee_components.title2") }}
          <span>{{ fiatCurrencyAmount }} {{ fiatCurrencyInfo.fiat }}</span>
          <div class="img-box">
            <img :class="{ rotate: detailsState }" :src="imageBottom" />
          </div>
        </div>
      </div>
      <!-- 详细费用信息 -->
      <el-collapse-transition>
        <div class="fee-content-details" v-show="detailsState">
          <div class="fee-content-details-line">
            <div class="title">
              {{ $t("sellFee_components.rampFee") }}
              <el-popover
                :close-delay="1"
                placement="top-start"
                :offset="55"
                :trigger="triggerType"
              >
                <p>{{ $t("sellFee_components.tips") }}</p>
                <div slot="reference">
                  <img
                    class="tipsIcon"
                    src="@/assets/images/exclamatoryMarkIcon.svg"
                  />
                </div>
              </el-popover>
            </div>
            <div class="value">
              <span class="minText"
                >{{ $t("sellFee_components.RampFeeTips") }} &nbsp;</span
              >
              {{ feeInfo.fiatSymbol }}&nbsp;{{ feeInfo.rampFee }}
            </div>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
/**
 * 卖币费用组件
 */
import { mapState } from "vuex";
import common from "@/utils/common";

export default {
  name: "includedDetails-info",
  props: {
    type: {
      type: Number,
      default: null,
    },
    //确认订单页支付方式code
    payWayCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      triggerType: "hover",
      detailsState: false,
      imageBottom: require("@/assets/images/blackDownIcon1.svg"),
    };
  },
  mounted() {
    this.scenarioVerification();
  },
  activated() {
    this.scenarioVerification();
  },
  computed: {
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
      feeInfo: (state) => state.feeInfo,
    }),
  },
  methods: {
    scenarioVerification() {
      //判断是pc还是移动端，用于展示的提示信息是click还是hover触发
      this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
    },
    //展开费用信息
    expandCollapse() {
      this.detailsState = !this.detailsState;
      if (this.detailsState) {
        setTimeout(() => {
          this.$parent.$refs.includedDetails_ref.$el.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "end",
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" src="../css/index.scss" scoped></style>
