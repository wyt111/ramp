<template>
  <div class="status-img-box" :class="[status]">
    <div class="inner">
      <img class="bg" :src="imgBgUrl" />
      <template v-if="status === 'waiting'">
        <img class="scanning" src="@/assets/images/kycOnfido/scanning.svg" />
        <img class="status" src="@/assets/images/kycOnfido/waiting.svg" />
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "StatusImgBox",
  props: ["status"],
  computed: {
    imgBgUrl() {
      let imgName = "";
      switch (this.status) {
        case "waiting":
          imgName = "identity";
          break;
        case "exception":
          imgName = "exception";
          break;
        case "succeeded":
          imgName = "succeeded";
          break;
        case "failed":
          imgName = "failed";
          break;
      }
      return require(`@/assets/images/kycOnfido/${imgName}.svg`);
    },
  },
};
</script>
<style lang="scss" scoped>
.status-img-box {
  padding: 0.52rem 0 0.12rem 0;
  .inner {
    position: relative;
    width: 1.6rem;
    height: 1.6rem;
    margin: 0 auto;
  }
  img {
    display: block;
  }
  .bg {
    width: 100%;
    height: 100%;
  }
  &.waiting {
    padding-bottom: 0.16rem;
    @keyframes scanning {
      0% {
        top: 0.1rem;
        opacity: 0.1;
      }

      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        top: 1rem;
        opacity: 0.1;
      }
    }

    .scanning {
      position: absolute;
      z-index: 1;
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      animation: scanning 1.2s linear infinite;
      width: 70%;
    }
    .status {
      position: absolute;
      z-index: 2;
      bottom: 0;
      right: 0;
    }
  }
}
</style>
