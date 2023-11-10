<template>
  <div class="kyc-verify-status-container">
    <component
      :is="currentComponentName"
      :kyc-info="kycInfo"
      :email-slice="emailSlice"
    >
    </component>
  </div>
</template>
<script>
import VerifySucceeded from "./KycVerifyChildren/VerifySucceeded.vue";
import VerifyException from "./KycVerifyChildren/VerifyException.vue";
import VerifyFailed from "./KycVerifyChildren/VerifyFailed.vue";
import VerifyWaiting from "./KycVerifyChildren/VerifyWaiting.vue";
import ErrorCountryCheck from "@/views/kycResult/error-countryCheck.vue";
import { mapState } from "vuex";
import { AES_Decrypt } from "@/utils/encryp";

export default {
  name: "kycStatus",
  components: {
    VerifySucceeded,
    VerifyException,
    VerifyFailed,
    VerifyWaiting,
    ErrorCountryCheck,
  },
  data() {
    return {
      kycInfo: {
        kycFlag: 0, // "0": 不需要kyc, "1": 需要kyc, "2": kyc异常;
        userLevel: 0, // 需要做的kyc等级 1, 2;
        currUserLevel: 0, // 当前kyc等级0, 1, 2;
        currKycStatus: 0, // 当前kyc状态 "0"：未完成,"1": 已完成, "2"：永久拒绝 ,"3"：临时拒绝 "4"：人工审核 "5"：kyc审核中
        kycStartTime: 0, // kyc开始时间戳; 当userLevel为1 并且currKycStatus为1,2，3，4，5时才会有值
        systemTime: 0, // 系统时间戳;
        failList: [{}], // 当currKycStatus为 2：永久拒绝 3：临时拒绝 时不为null
      },
      email: "",
      timer: null,
    };
  },
  mounted() {
    localStorage.getItem("email")
      ? (this.email = AES_Decrypt(localStorage.getItem("email")))
      : (this.email = "");

    this.getKycStatus()
      .then((res) => {
        this.kycInfo = res;
        // 存储kyc信息
        this.$store.commit("kycInfo/set_kycCheck", res.isPassByPwcWorld);
        this.$store.commit("kycInfo/set_kycResultInfo", res);
      })
      .catch((err) => {
        console.error(err);
      });
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.getKycStatus()
        .then((res) => {
          this.kycInfo = res;
          // 存储kyc信息
          this.$store.commit("kycInfo/set_kycCheck", res.isPassByPwcWorld);
          this.$store.commit("kycInfo/set_kycResultInfo", res);
        })
        .catch((err) => {
          clearInterval(this.timer);
          console.error(err);
        });
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getKycStatus() {
      return new Promise((resolve, reject) => {
        let params = {
          payWayCode:
            this.payMethodInfo.payWayCode || this.placeOrderQuery.payWayCode,
        };
        this.$axios
          .get(this.$api.get_findUserDetail, params, "")
          .then((res) => {
            localStorage.removeItem("goKycStatusAfterLogin");
            if (res && res.returnCode === "0000" && res.data) {
              resolve(res.data);
            } else {
              reject("get key status error");
            }
          })
          .catch((error) => {
            if (this.$route.query.from === "email") {
              localStorage.setItem("goKycStatusAfterLogin", "true");
            }
          });
      });
    },
  },
  computed: {
    currentComponentName() {
      let currentComponentName = "";
      switch (true) {
        case this.kycInfo.isPassByPwcWorld === false &&
          this.$store.state.homeTabstate === "buyCrypto":
          currentComponentName = "ErrorCountryCheck";
          break;
        case this.kycInfo.kycFlag == 2 &&
          (this.kycInfo.currKycStatus == 4 || this.kycInfo.currKycStatus == 5):
          currentComponentName = "VerifyWaiting";
          break;
        case this.kycInfo.kycFlag == 2 && this.kycInfo.currKycStatus == 3:
          currentComponentName = "VerifyException";
          break;
        case this.kycInfo.kycFlag == 2 && this.kycInfo.currKycStatus == 2:
          currentComponentName = "VerifyFailed";
          break;
        case this.kycInfo.kycFlag == 0 && this.kycInfo.currKycStatus == 1:
          currentComponentName = "VerifySucceeded";
          break;
      }
      if (currentComponentName && currentComponentName !== "VerifyWaiting") {
        clearInterval(this.timer);
      }
      return currentComponentName;
    },
    emailSlice() {
      let email = this.email;
      let email1 =
        email.slice(0, 3) +
        " *** " +
        email.slice(email.indexOf("@"), email.indexOf("@") + 6) +
        "...";
      return email1;
    },
    ...mapState("buyPayments", {
      placeOrderQuery: (state) => state.placeOrderQuery,
      payMethodInfo: (state) => state.payMethodInfo,
    }),
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.kyc-verify-status-container {
  height: 100%;
}
</style>
