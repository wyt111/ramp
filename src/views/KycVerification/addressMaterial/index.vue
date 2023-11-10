<template>
  <div class="KycVer-container">
    <div class="content" v-if="new_kycVerState === 0">
      <img src="@/assets/images/kyc/kycIcon4.svg" alt="" />
      <p class="tips-text">
        <span class="lvText">Lv.2</span>
        {{ $t("kycVerificationFonts.kycminutestitle") }}
      </p>
      <div class="tips-list tips-list-start">
        <p>·</p>
        <p>{{ $t("kycVerificationFonts.kyc2_startTitle") }}</p>
      </div>
    </div>
    <!-- kyc验证成功 -->
    <div class="content" v-else-if="new_kycVerState === 1">
      <img src="@/assets/images/kyc/kycIcon5.svg" alt="" />
      <p class="tips-text">
        {{ $t("kycVerificationFonts.kyccompleted1") }}<br />{{
          $t("kycVerificationFonts.kyccompleted2")
        }}
      </p>
    </div>
    <!-- kyc验证失败 不可重试 -->
    <div class="content" v-else-if="new_kycVerState === 2">
      <img src="@/assets/images/kyc/kycIcon3.svg" alt="" />
      <p class="tips-text">{{ $t("kycVerificationFonts.kycError") }}</p>
      <div class="tips-list" style="margin-top: 0">
        <p>·</p>
        <p>{{ $t("kycVerificationFonts.kycErrorTips") }}</p>
      </div>
    </div>
    <!-- kyc验证失败 可以重试 -->
    <div class="content" v-else>
      <img src="@/assets/images/kyc/kycIcon3.svg" alt="" />
      <p class="tips-text">{{ $t("kycVerificationFonts.kycRiskAccount") }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  props: ["kycVerState"],
  computed: {
    new_kycVerState() {
      return this.kycVerState;
    },
  },
};
</script>

<style lang="scss" src="../index.scss" scoped></style>
