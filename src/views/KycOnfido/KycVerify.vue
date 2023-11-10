<template>
  <div class="kyc-check-container">
    <div class="tips">
      {{ $t("kycVerificationFonts.kycminutestitle") }}
    </div>
    <verify-language-select
      @onSetlanguage="onSetlanguage"
      :onfido-language="onfidoLanguage"
    ></verify-language-select>
    <div class="onfido-box">
      <div id="onfido-mount"></div>
    </div>
  </div>
</template>
<script>
import VerifyLanguageSelect from "./KycVerifyChildren/VerifyLanguageSelect.vue";

import { init } from "onfido-sdk-ui/dist/onfidoAuth.min.js";
import "onfido-sdk-ui/dist/style.css";
export default {
  name: "kycVerify",
  components: {
    VerifyLanguageSelect,
  },
  data() {
    return {
      onfidoOut: null,
      onfidoLanguage: "",
    };
  },
  beforeDestroy() {
    this.tearDown();
    window.removeEventListener("userAnalyticsEvent", this.FACIAL_CAPTURE_EVENT);
  },
  mounted() {
    this.initDown();
    window.addEventListener("userAnalyticsEvent", this.FACIAL_CAPTURE_EVENT);
  },
  methods: {
    FACIAL_CAPTURE_EVENT(event) {
      if (event.detail.eventName == "FACIAL_CAPTURE") {
        let video_play_timer = setInterval(() => {
          let camera_video = document.querySelector(
            "#onfido-mount .onfido-sdk-ui-Camera-video"
          );
          if (camera_video) {
            if (camera_video.paused) {
              camera_video.play();
              clearInterval(video_play_timer);
            } else {
              clearInterval(video_play_timer);
            }
          }
        }, 30);
      }
    },
    getToken() {
      return new Promise((resolve, reject) => {
        const params = {
          userNo: window.localStorage.getItem("userNo"),
          reference: window.location.origin + "/",
        };
        this.$axios
          .post(this.$api.post_getToken, params, "")
          .then((res) => {
            if (res && res.returnCode === "0000" && res.data) {
              resolve(res.data.token);
            } else {
              reject("get token error");
            }
          })
          .catch((error) => {
            console.error(error);
            reject("get token error");
          });
      });
    },
    kycCheckSubmit(data) {
      // console.log(data);
      const params = {
        userNo: window.localStorage.getItem("userNo"),
      };
      this.$axios
        .post(this.$api.post_onfidoCheckSubmit, params, "")
        .then((res) => {
          if (res && res.returnCode === "0000") {
            localStorage.removeItem("kycAlertClosed");
            this.$router.replace({
              path: "/kycStatus",
              query: {
                fromKycVerifySubmit: true,
                type: this.$route.query.type,
              },
            });
          } else {
            console.error("onfido check submit error");
          }
        })
        .catch((error) => {
          console.error(error);
          console.error("onfido check submit error");
        });
    },
    async initDown() {
      let language = this.getOnfidoLanguage();
      const token = await this.getToken();
      const _this = this;
      this.onfidoOut = init({
        // useModel: true,
        // isModalOpen: true,
        useMemoryHistory: true,
        token,
        containerId: "onfido-mount",
        customUI: {
          borderRadiusButton: "5px",
          fontSizeTitle: "22px",
          fontSizeSubtitle: "16px",
          fontSizeBody: "14px",
          // buttonGroupStacked: true
        },
        language,
        onComplete: function (data) {
          _this.kycCheckSubmit(data);
        },
        onError: function () {},
        onUserExit: function () {},
        onModalRequestClose: function () {},
        steps: [
          "welcome",
          {
            type: "document",
            options: {
              documentTypes: {
                national_identity_card: true,
                driving_licence: true,
              },
            },
          },
          "face",
          "complete",
        ],
      });
    },
    tearDown() {
      try {
        this.onfidoOut && this.onfidoOut.tearDown();
      } catch (e) {
        console.error(e);
      }
    },
    onSetlanguage(language) {
      try {
        this.onfidoLanguage = language;
        localStorage.setItem("onfido_language", language);
        this.onfidoOut && this.onfidoOut.setOptions({ language });
      } catch (e) {
        console.error(e);
      }
    },
    getOnfidoLanguage() {
      let language = localStorage.getItem("onfido_language");
      if (!language) {
        language = this.$i18n.locale === "zh-HK" ? "zh_TW" : "en_US";
        localStorage.setItem("onfido_language", language);
      }
      this.onfidoLanguage = language;
      return this.onfidoLanguage;
    },
  },
  computed: {},
  watch: {
    /*" $i18n.locale": {
      immediate: true,
      handler(val) {
        let language = val === "zh-HK" ? "zh_TW" : "en_US";
        try {
          this.onfidoOut && this.onfidoOut.setOptions({ language });
        } catch (e) {
          console.error(e);
        }
      },
    },*/
  },
};
</script>
<style lang="scss" scoped>
.kyc-check-container {
  padding-top: 0.18rem;
  .tips {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #6e7687;
    margin-bottom: 0.2rem;
  }
  .onfido-box {
    ::v-deep #onfido-mount {
      .onfido-sdk-ui-Modal-inner {
        width: 100%;
        height: 37.5em;
        position: relative;
        border-radius: var(--osdk-border-radius-surface-modal);
        .ods-button {
          line-height: 1.5em;
        }
      }
    }
  }
  .Verification_content .kyc_nav .tips,
  .verif_kyc .verif_kyc_nav .tips {
    font-family: "SF Pro Display"; //400;
    font-style: normal;
    font-weight: 400;
    font-size: 0.12rem;
    line-height: 0.18rem;
    color: #6e7687;
    // margin-bottom: 0.2rem;
  }
}
</style>
