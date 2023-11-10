<template>
  <div class="verify-waiting-container">
    <verify-img-status status="waiting"></verify-img-status>
    <div class="under-review">
      <div class="under-review-label">
        <img src="@/assets/images/kycOnfido/1.svg" alt="" />
        <span>{{ $t("kycStatus.verify_waiting.under_review") }}</span>
      </div>

      <div class="waiting-time style1" v-if="waitingTime <= 300">
        <div class="label">
          {{ $t("kycStatus.verify_waiting.estimated_time") }}
        </div>
        <div class="val">{{ timeFormat }}</div>
      </div>

      <div class="waiting-time style2" v-else>
        <div class="label">
          {{ $t("kycStatus.verify_waiting.waiting_time") }}
        </div>
        <div class="val">{{ timeFormat }}</div>
      </div>
    </div>
    <div class="verify-status-reason">
      <div class="label">
        <img src="@/assets/images/kycOnfido/2.svg" alt="" />
        <span>
          {{ $t("kycStatus.verify_waiting.reviewed_now") }}
        </span>
      </div>
      <div class="content">
        {{ $t("kycStatus.verify_waiting.notify_you") }}
      </div>
    </div>

    <div class="submit-successed-dialog" v-if="isFromKycVerifySubmit">
      <div class="mask"></div>
      <div class="dialog">
        <img src="@/assets/images/kycOnfido/3.svg" alt="" />
        <div class="label">
          {{ $t("kycStatus.verify_waiting.received_documents") }}
        </div>
        <div class="content">
          {{ $t("kycStatus.verify_waiting.notify_you") }}
        </div>
        <div class="btn" @click="isFromKycVerifySubmit = false">
          <span>{{ $t("nav.Confirm") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VerifyImgStatus from "./VerifyImgStatus";
export default {
  name: "VerifyWaiting",
  components: {
    VerifyImgStatus,
  },

  data() {
    return {
      waitingTime: 0, // 初始值不一定为0
      isFromKycVerifySubmit: false,
      timer: null,
    };
  },
  props: ["kycInfo"],
  computed: {
    timeFormat() {
      let time = this.waitingTime;
      if (time <= 300) {
        time = 300 - time;
      }
      let hours = String(parseInt(time / 60 / 60)).padStart(2, 0);
      let minutes = String(parseInt((time / 60) % 60)).padStart(2, 0);
      let seconds = String(time % 60).padStart(2, 0);
      return time <= 300
        ? `${minutes}:${seconds}`
        : `${hours}:${minutes}:${seconds}`;
    },
  },
  mounted() {
    this.waitingTime = parseInt(
      (this.kycInfo.currTime - this.kycInfo.kycStartTime) / 1000
    );
    this.isFromKycVerifySubmit =
      this.$route.query.fromKycVerifySubmit === "true";
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.waitingTime++;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>
<style lang="scss" scoped>
.verify-waiting-container {
  width: 3.15rem;
  margin: 0 auto;
  .under-review {
    border-radius: 0.12rem;
    overflow: hidden;
    margin-bottom: 0.24rem;
    .under-review-label {
      width: 3.15rem;
      height: 0.48rem;
      background: linear-gradient(90deg, #438ffa 0.04%, #0059da 100.4%);
      display: flex;
      align-items: center;
      img {
        margin: 0 0.08rem 0 0.16rem;
        width: 0.28rem;
        height: 0.28rem;
      }
      span {
        font-family: "Medium";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #ffffff;
      }
    }
    .waiting-time {
      display: flex;
      align-items: center;
      background: linear-gradient(
        90deg,
        rgba(67, 143, 250, 0.1) 0.04%,
        rgba(0, 89, 218, 0.1) 100.4%
      );

      .label {
      }
      .val {
      }
      &.style1 {
        justify-content: space-between;
        padding: 0 0.16rem;
        height: 0.36rem;

        .label {
          font-family: "Regular";
          font-style: normal;
          font-weight: 400;
          font-size: 0.14rem;
          line-height: 0.22rem;
          color: #252830;
        }
        .val {
          font-family: "Semibold";
          font-style: normal;
          font-weight: 700;
          font-size: 0.18rem;
          line-height: 0.22rem;
          color: #ff8d24;
          min-width: 0.52rem;
          text-align: left;
        }
      }
      &.style2 {
        flex-direction: column;
        height: 0.9rem;
        justify-content: center;
        .label {
          font-family: "Regular";
          font-style: normal;
          font-weight: 400;
          font-size: 0.16rem;
          line-height: 0.2rem;
          text-align: center;
          color: #252830;
          margin-bottom: 0.08rem;
        }
        .val {
          font-family: "Semibold";
          font-style: normal;
          font-weight: 700;
          font-size: 0.18rem;
          line-height: 0.22rem;
          color: #0059da;
          min-width: 0.76rem;
          text-align: left;
        }
      }
    }
  }
  .verify-status-reason {
    background: rgba(255, 141, 36, 0.05);
    border-radius: 0.12rem;
    padding: 0.16rem;
    .label {
      margin-bottom: 0.1rem;
      display: flex;
      img {
        width: 0.2rem;
        height: 0.2rem;
        margin: 0.02rem 0.1rem 0 0.02rem;
      }
      span {
        font-family: "Medium";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #ff8d24;
      }
    }
    .content {
      font-family: "Regular";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.22rem;
      color: #6e7687;
    }
  }
  .submit-successed-dialog {
    .mask {
      position: absolute;
      z-index: 3;

      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.25);
    }
    .dialog {
      position: absolute;
      z-index: 4;
      width: 3.45rem;
      min-height: 3.4rem;
      background: #ffffff;
      border-radius: 0.18rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 0.32rem 0.16rem;
      img {
        display: block;
        margin: 0 auto 0.2rem;
        width: 0.56rem;
        height: 0.56rem;
      }
      .label {
        font-family: "Medium";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.2rem;
        color: #252830;
        margin-bottom: 0.1rem;
      }
      .content {
        font-family: "Regular";
        font-style: normal;
        font-weight: 400;
        font-size: 0.14rem;
        line-height: 0.22rem;
        color: #6e7687;
        margin-bottom: 0.32rem;
      }
      .btn {
        height: 0.5rem;
        background: linear-gradient(88.06deg, #0059da 0%, #1bb2f2 100%);
        border-radius: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        span {
          font-family: "Medium";
          font-style: normal;
          font-weight: 500;
          font-size: 0.16rem;
          line-height: 0.19rem;
          text-align: center;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
