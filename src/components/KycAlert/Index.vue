<template>
  <div class="kyc-alert" v-if="showKycAlert && status">
    <div class="alert-inner" :class="[status]">
      <div class="fl" @click="goKycStatus">
        <template v-if="status === 'waiting'">
          <span class="text">
            {{ $t("kycAlert.waiting_msg") }}
          </span>
          <span class="time">{{ timeFormat }}</span>
        </template>
        <template v-else-if="status === 'succeeded'">
          <span class="text">{{ $t("kycAlert.success_msg") }}</span>
        </template>
        <template v-else-if="status === 'failed'">
          <span class="text cursor-pointer">
            {{ $t("kycAlert.failure_msg") }}
          </span>
        </template>
      </div>
      <div class="fr">
        <img
          src="@/assets/images/kycOnfido/8.svg"
          alt=""
          @click="onCloseKycAlert"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { getKycRule } from "@/utils/publicRequest.js";

export default {
  name: "KycAlert",
  data() {
    return {
      showKycAlert: false,
      waitingTime: 0,
      timer: null,
      kycInfo: {},
      getKycStatusTimer: null,
    };
  },
  computed: {
    timeFormat() {
      let time = this.waitingTime;
      let hours = String(parseInt(time / 60 / 60)).padStart(2, 0);
      let minutes = String(parseInt((time / 60) % 60)).padStart(2, 0);
      let seconds = String(time % 60).padStart(2, 0);

      return time < 3600
        ? `${minutes}:${seconds}`
        : `${hours}:${minutes}:${seconds}`;
    },
    status() {
      let currentComponentName = "";
      switch (true) {
        case this.kycInfo.userLevel == 1 &&
          this.kycInfo.kycFlag == 2 &&
          (this.kycInfo.currKycStatus == 4 || this.kycInfo.currKycStatus == 5):
          currentComponentName = "waiting";
          break;
        case this.kycInfo.userLevel == 1 &&
          this.kycInfo.kycFlag == 2 &&
          this.kycInfo.currKycStatus == 3:
          currentComponentName = "failed";
          break;
        /* case this.kycInfo.kycFlag == 2 &&
            this.kycInfo.currKycStatus == 2:
            // currentComponentName = "VerifyFailed";
            break;
          case this.kycInfo.kycFlag == 0 &&
            this.kycInfo.currKycStatus == 1:
            // currentComponentName = "succeeded";
            break; */

        // 成功或彻底失败不展示;
      }
      return currentComponentName;
    },
  },

  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.getKycStatusTimer);
  },
  watch: {
    $route: {
      immediate: true,
      deep: true,
      handler(routeObj) {
        if (
          routeObj.path === "/index" &&
          localStorage.getItem("token") &&
          localStorage.getItem("email") &&
          localStorage.getItem("kycAlertClosed") !== "true"
        ) {
          this.showKycAlert = true;
          this.init();
          clearInterval(this.getKycStatusTimer);
          this.getKycStatusTimer = setInterval(() => {
            this.init();
          }, 5000);
        } else {
          clearInterval(this.timer);
          clearInterval(this.getKycStatusTimer);
          this.showKycAlert = false;
        }
      },
    },
  },
  methods: {
    async init() {
      // let kycRule = localStorage.getItem('kycRule');
      let kycRule = await getKycRule();
      // if (!kycRule) {
      //   kycRule = await getKycRule();
      //   console.log(kycRule,"---kycRule")
      // }
      if (kycRule == 2) {
        clearInterval(this.timer);
        clearInterval(this.getKycStatusTimer);
        return;
      }

      await this.getKycStatus()
        .then((res) => {
          this.kycInfo = res;
          this.waitingTime = parseInt(
            (this.kycInfo.currTime - this.kycInfo.kycStartTime) / 1000
          );
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.waitingTime++;
          }, 1000);

          if (
            !(
              this.kycInfo.kycFlag == 2 &&
              (this.kycInfo.currKycStatus == 4 ||
                this.kycInfo.currKycStatus == 5) &&
              this.kycInfo.userLevel == 1
            )
          ) {
            clearInterval(this.timer);
            clearInterval(this.getKycStatusTimer);
          }
        })
        .catch((err) => {
          clearInterval(this.timer);
          clearInterval(this.getKycStatusTimer);
          console.error(err);
        });
    },
    getKycStatus() {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(this.$api.get_findUserDetail, "", "")
          .then((res) => {
            if (res && res.returnCode === "0000" && res.data) {
              localStorage.setItem("kyc_user_detail", JSON.stringify(res.data));
              resolve(res.data);
            } else {
              reject("get key status error");
            }
          })
          .catch((error) => {
            console.error(error);
            // reject('get key status error'); // todo show
          });
      });
    },
    goKycStatus() {
      this.$router.push({
        path: "/kycStatus",
      });
    },
    onCloseKycAlert() {
      localStorage.setItem("kycAlertClosed", "true"); // 存储 是否点击过 关闭按钮;
      this.showKycAlert = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.kyc-alert {
  height: 0.36rem;
  .alert-inner {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.36rem;
    padding: 0 0.16rem;

    &.waiting {
      background: rgba(255, 141, 36, 0.1);
    }
    &.succeeded {
      background: rgba(10, 178, 77, 0.1);
    }
    &.failed {
      background: rgba(253, 102, 38, 0.1);
    }
    .fl {
      display: flex;
      align-items: center;
      .text {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.2rem;
        color: #252830;
        line-height: 0.36rem;
        &.cursor-pointer {
          cursor: pointer;
        }
      }
      .time {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 700;
        font-size: 0.14rem;
        line-height: 0.2rem;
        color: #ff8d24;
        margin-left: 0.08rem;
      }
    }
    .fr {
      img {
        width: 0.16rem;
        height: 0.16rem;
        display: block;
        cursor: pointer;
      }
    }
  }
}
</style>
