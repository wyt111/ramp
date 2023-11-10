<template>
  <div
    class="notice-bar-box"
    v-if="noticeText && !hasCloseNotice && $route.path === '/index'"
  >
    <el-tooltip
      popper-class="notice-tooltip"
      :content="noticeText"
      placement="top"
      :disabled="!logoState"
    >
      <div class="notice-bar">
        <img src="@/assets/images/noticeBar/1.jpg" alt="" class="notice-img" />
        <div class="text-box" ref="text_box">
          <van-notice-bar :text="noticeText" />
        </div>
        <img
          class="close-img"
          src="@/assets/images/kycOnfido/8.svg"
          alt=""
          @click="closeNotice"
        />
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  name: "NoticeBar",
  props: ["noticeList", "logoState"],
  data() {
    return {
      hasCloseNotice: false,
    };
  },
  computed: {
    noticeText() {
      let text = "";
      try {
        let originNoticeList = this.noticeList;
        let noticeItem = originNoticeList.sort((a, b) => {
          return b.publishTime - a.publishTime;
        })[0];
        if (noticeItem.endTime >= noticeItem.systemTime) {
          text = noticeItem.content;
        }
      } catch (e) {
        console.log(e);
      }

      return text;
    },
  },

  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {
    closeNotice() {
      this.hasCloseNotice = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@media (min-width: 791px) {
  .notice-bar-box {
    height: 0;
    position: relative;
    width: 3.75rem;
    top: 0.24rem;
    .notice-bar {
      height: 0.4rem;
      width: 100%;
      background: rgba(255, 255, 255);
      box-shadow: 0px 0px 0.96rem rgba(0, 0, 0, 0.12);
      border-radius: 1rem;
      position: relative;
      padding: 0 0.12rem 0 0.4rem;
      display: flex;
      align-items: center;
      .notice-img {
        width: 0.16rem;
        position: absolute;
        left: 0.12rem;
        // transform: rotateY(180deg);
      }
      .close-img {
        display: none;
      }
      .text-box {
        width: 3.23rem;
        width: 100%;
        overflow: hidden;
        ::v-deep .van-notice-bar {
          padding: 0;
          height: 0.14rem;
          background: transparent;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.14rem;
          white-space: nowrap;
          color: #252830;
        }
      }
      &:after {
        content: "";
        position: absolute;
        width: 0.24rem;
        height: 0.2rem;
        right: 0.1rem;
        background: linear-gradient(
          270deg,
          #ffffff 0%,
          rgba(255, 255, 255, 0.4) 79.69%,
          rgba(255, 255, 255, 0) 97.4%
        );
      }
    }
  }
}
@media (max-width: 791px) {
  .notice-bar-box {
    height: 0.36rem;
    background: #f5f5f5;
    position: relative;
    .notice-bar {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 0.44rem;
      .notice-img {
        width: 0.16rem;
        position: absolute;
        left: 0.16rem;
        top: 50%;
        transform: translateY(-50%);
      }
      .close-img {
        width: 0.16rem;
        height: 0.16rem;
        right: 0.16rem;
        position: absolute;
        cursor: pointer;
      }
      .text-box {
        width: 100%;
        ::v-deep .van-notice-bar {
          padding: 0;
          height: 0.14rem;
          background: transparent;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.14rem;
          white-space: nowrap;
          color: #252830;
        }
      }
      &:after {
        content: "";
        position: absolute;
        width: 0.24rem;
        height: 0.2rem;
        right: 0.44rem;
        background: linear-gradient(
          270deg,
          #f5f5f5 0%,
          rgba(245, 245, 245, 0.4) 100%
        );
      }
    }
  }
}
</style>
