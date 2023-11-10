<template>
  <div class="unauthorized-access-container">
    <div class="unauthorized-access-logo">
      <img
        src="@/assets/images/unauthorizedAccess/unauthorizedAccess.png"
        alt
      />
    </div>
    <div class="unauthorized-access-info">
      <div class="tips">{{ $t("unauthorizedAccess.tips") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "unauthorizedAccess",
};
</script>

<style lang="scss" scoped>
.unauthorized-access-container {
  .unauthorized-access-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.6rem;
    margin-bottom: 0.24rem;
    img {
      width: 1.6rem;
      height: 1.6rem;
      // object-fit: cover;
    }
  }
  .unauthorized-access-info {
    display: flex;
    flex-direction: column;
    font-style: normal;
    .tips {
      font-family: Semibold;
      font-weight: 700;
      font-size: 0.2rem;
      line-height: 0.24rem;
      text-align: center;
      color: #252830;
      margin-bottom: 0.08rem;
    }
  }
}
</style>
