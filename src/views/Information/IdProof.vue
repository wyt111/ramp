<template>
  <div class="id-proof">
    <div class="id-proof-content">
      <div class="page-tips">
        {{ $t("kycVerificationFonts.kycminutestitle") }}
      </div>
      <div class="id">
        <!-- identification document -->
        <div class="id-document">
          <el-upload
            ref="upload_action_id"
            :action="upload.action_id"
            :auto-upload="false"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handle_action_id_success"
            :before-upload="before_action_id_upload"
            accept="image/*"
            :on-change="on_change_action_id"
          >
            <template v-if="upload.id_document">
              <img
                class="del-img"
                src="@/assets/images/information/4.svg"
                @click.stop="delImg('id_document')"
                alt=""
              />
              <img :src="upload.id_document" class="id_document preview-img" />
              <div class="img-loading-box" v-if="uploadLoading" @click.stop="">
                <img
                  src="@/assets/images/paymentResult/3.png"
                  alt=""
                  class="img img-loading"
                />
              </div>
            </template>
            <div class="placeholder" v-else>
              <img class="img" src="@/assets/images/information/1.svg" alt="" />
              <span class="text">{{ upload_text_1 }}</span>
            </div>
          </el-upload>
        </div>
        <!-- id-document-back -->
        <div
          class="id-document-back"
          v-if="['id_card', 'dl'].includes(this.legendTradingKycInfo.idType)"
        >
          <el-upload
            ref="upload_action_id_back"
            :action="upload.action_id_back"
            :auto-upload="false"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handle_action_id_back_success"
            :before-upload="before_action_id_back_upload"
            accept="image/*"
            :on-change="on_change_action_id_back"
          >
            <template v-if="upload.id_document_back">
              <img
                class="del-img"
                src="@/assets/images/information/4.svg"
                @click.stop="delImg('id_document_back')"
                alt=""
              />
              <img
                :src="upload.id_document_back"
                class="id_document preview-img"
              />
              <div class="img-loading-box" v-if="uploadLoading" @click.stop="">
                <img
                  src="@/assets/images/paymentResult/3.png"
                  alt=""
                  class="img img-loading"
                />
              </div>
            </template>

            <div class="placeholder" v-else>
              <img class="img" src="@/assets/images/information/2.svg" alt="" />
              <span class="text">{{ upload_text_2 }}</span>
            </div>
          </el-upload>
        </div>
        <!-- your selfie -->
        <div class="your-selfie">
          <el-upload
            ref="upload_selfie"
            :action="upload.action_selfie"
            :auto-upload="false"
            :headers="upload.headers"
            :show-file-list="false"
            :on-success="handle_action_selfie_success"
            :before-upload="before_action_selfie_upload"
            accept="image/*"
            :on-change="on_change_selfie"
          >
            <template v-if="upload.selfie">
              <img
                class="del-img"
                src="@/assets/images/information/4.svg"
                @click.stop="delImg('selfie')"
                alt=""
              />
              <img :src="upload.selfie" class="selfie preview-img" />
              <div class="img-loading-box" v-if="uploadLoading" @click.stop="">
                <img
                  src="@/assets/images/paymentResult/3.png"
                  alt=""
                  class="img img-loading"
                />
              </div>
            </template>

            <div class="placeholder" v-else>
              <img class="img" src="@/assets/images/information/3.svg" alt="" />
              <span class="text">{{ $t("idProof.upload_selfie") }}</span>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="continueBox" ref="footer_ref">
      <button
        class="continue"
        @click="submitUpload"
        :disabled="disabled || uploadLoading"
      >
        {{ $t("button_components.proceed") }}
        <button-loading v-if="uploadLoading" class="rightIcon" />
        <img
          v-else
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </button>
      <bottom-bar
        @setPaddingBottom="
          $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
        "
      />
    </div>
  </div>
</template>
<script>
import { generateSign } from "@/utils/publicRequest";
import { mapState } from "vuex";

export default {
  name: "IdProof",
  data() {
    return {
      upload: {
        action_id: "",
        action_id_back: "",
        action_selfie: "",
        headers: {},
        // 证件照正面;
        id_document: "",
        id_document_loading: false,
        id_document_upload_status: false,
        // 证件照反面;
        id_document_back: "",
        id_document_back_loading: false,
        id_document_back_upload_status: false,
        // 人脸;
        selfie: "",
        selfie_loading: false,
        selfie_upload_status: false,
      },
      kyc_submit_loading: false,
    };
  },
  computed: {
    ...mapState("kycInfo", {
      legendTradingKycInfo: (state) => state.legendTradingKycInfo,
    }),
    disabled() {
      if (["id_card", "dl"].includes(this.legendTradingKycInfo.idType)) {
        return (
          !this.upload.id_document ||
          !this.upload.selfie ||
          !this.upload.id_document_back
        );
      } else {
        return !this.upload.id_document || !this.upload.selfie;
      }
    },
    uploadLoading() {
      if (["id_card", "dl"].includes(this.legendTradingKycInfo.idType)) {
        return (
          this.upload.id_document_loading ||
          this.upload.selfie_loading ||
          this.upload.id_document_back_loading ||
          this.kyc_submit_loading
        );
      } else {
        return (
          this.upload.id_document_loading ||
          this.upload.selfie_loading ||
          this.kyc_submit_loading
        );
      }
    },
    upLoadStatus() {
      if (["id_card", "dl"].includes(this.legendTradingKycInfo.idType)) {
        return (
          this.upload.id_document_upload_status &&
          this.upload.selfie_upload_status &&
          this.upload.id_document_back_upload_status
        );
      } else {
        return (
          this.upload.id_document_upload_status &&
          this.upload.selfie_upload_status
        );
      }
    },
    upload_text_1() {
      if (this.legendTradingKycInfo.idType === "id_card") {
        return this.$t("idProof.upload_id_document1");
      } else if (this.legendTradingKycInfo.idType === "dl") {
        return this.$t("idProof.upload_id_document3");
      } else {
        return this.$t("idProof.upload_id_document");
      }
    },
    upload_text_2() {
      if (this.legendTradingKycInfo.idType === "id_card") {
        return this.$t("idProof.upload_id_document2");
      } else if (this.legendTradingKycInfo.idType === "dl") {
        return this.$t("idProof.upload_id_document4");
      }
    },
  },
  created() {
    this.upload.action_id =
      process.env.VUE_APP_BASE_API +
      this.$api.post_legend_idFileUpload +
      "/id_file";
    this.upload.action_id_back =
      process.env.VUE_APP_BASE_API +
      this.$api.post_legend_idFileUpload +
      "/id_back_file";
    this.upload.action_selfie =
      process.env.VUE_APP_BASE_API + this.$api.post_legend_selfieFileUpload;
    let signTimestamp = generateSign();
    this.upload.headers = {
      timestamp: signTimestamp.timestamp,
      token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
      sign: signTimestamp.sign,
    };
  },
  mounted() {},
  beforeDestroy() {},
  watch: {
    upLoadStatus(val) {
      if (val) {
        this.on_upload_success();
      }
    },
  },
  methods: {
    on_change(file, key1, key2) {
      if (file.status === "ready") {
        const isLt500K = file.size / 1024 <= 500;
        if (isLt500K) {
          this.$toast({
            message: this.$t("idProof.fileZiseLt500k"),
            duration: 3000,
          });
          return;
        }
        this.upload[key1] = URL.createObjectURL(file.raw);
        this.$refs[key2].uploadFiles = [file];
      }
    },
    on_change_action_id(file) {
      this.on_change(file, "id_document", "upload_action_id");
    },
    on_change_action_id_back(file) {
      this.on_change(file, "id_document_back", "upload_action_id_back");
    },
    on_change_selfie(file) {
      this.on_change(file, "selfie", "upload_selfie");
    },

    submitUpload() {
      let signTimestamp = generateSign();
      this.upload.headers = {
        timestamp: signTimestamp.timestamp,
        token: localStorage.getItem("token")
          ? localStorage.getItem("token")
          : "",
        sign: signTimestamp.sign,
      };
      this.$nextTick(() => {
        if (["id_card", "dl"].includes(this.legendTradingKycInfo.idType)) {
          this.$refs?.upload_action_id_back?.submit();
        }
        this.$refs?.upload_action_id?.submit();
        this.$refs?.upload_selfie?.submit();
      });
    },
    before_action(key1) {
      this.upload[key1] = true;
    },
    before_action_id_upload() {
      this.before_action("id_document_loading");
    },
    before_action_id_back_upload() {
      this.before_action("id_document_back_loading");
    },
    before_action_selfie_upload() {
      this.before_action("selfie_loading");
    },
    handle_action_success(response, key1, key2, key3) {
      this.upload[key1] = false;
      if (response.returnCode === "0000") {
        this.upload[key2] = true;
      } else {
        this.upload[key2] = false;
        this.upload[key3] = "";
        this.$toast({
          message: response.returnMsg,
          duration: 3000,
        });
      }
    },
    handle_action_id_success(response) {
      this.handle_action_success(
        response,
        "id_document_loading",
        "id_document_upload_status",
        "id_document"
      );
    },
    handle_action_id_back_success(response) {
      this.handle_action_success(
        response,
        "id_document_back_loading",
        "id_document_back_upload_status",
        "id_document_back"
      );
    },
    handle_action_selfie_success(response) {
      this.handle_action_success(
        response,
        "selfie_loading",
        "selfie_upload_status",
        "selfie"
      );
    },
    delImg(type) {
      this.upload[type] = "";
    },
    on_upload_success() {
      this.kyc_submit_loading = true;
      this.$axios
        .post(this.$api.post_legend_kycSubmit, {})
        .then((res) => {
          if (res.returnCode === "0000") {
            this.kyc_submit_loading = false;
            this.$router.replace("/id_authentication?status=2");
          }
        })
        .catch((err) => {
          this.kyc_submit_loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.id-proof {
  flex: 1;

  .id-proof-content {
    padding: 0 0.08rem;
    .page-tips {
      color: #5d636d;
      font-family: "SF Pro Display";
      font-size: 0.13rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 0.31rem;
    }
    .id {
      padding: 0 0.18rem;
      ::v-deep .el-upload {
        display: block;
        height: 1.7rem;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        border-radius: 6px;
        border: 1px dashed #d0d2d7;
        background: #fcfcfc;
        .del-img {
          position: absolute;
          width: 0.26rem;
          height: 0.26rem;
          display: block;
          top: 0.08rem;
          right: 0.08rem;
          cursor: pointer;
        }
        .img-loading-box {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          .img-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -0.3rem 0 0 -0.3rem;
            width: 0.6rem;
            animation: spin 1s linear infinite;
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          }
        }
      }
      .preview-img {
        max-width: 100%;
        max-height: 100%;
      }
      .placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        height: 100%;
        .img {
          margin-bottom: 17px;
        }
        .text {
          color: #5d636d;
          font-family: SF Pro Display;
          font-size: 0.13rem;
          font-style: normal;
          font-weight: 400;
          line-height: 0.18rem;
        }
      }
      .id-document,
      .your-selfie,
      .id-document-back {
        margin-bottom: 0.16rem;
      }
    }
  }
  .continueBox {
    position: sticky;
    width: 100%;
    left: 0;
    padding: 0.08rem 0 0rem;
    background: #fff;
    .continue {
      background: #0059da;
      border-radius: 0.06rem;
      width: 100%;
      height: 0.48rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #ffffff;
      border: 0;
      outline: 0;
      cursor: pointer;
      .rightIcon {
        margin-left: 0.08rem;
        width: 0.2rem;
      }
      &:hover {
        background: #0052c9;
      }
      &:active {
        background: #004bb7;
      }
      &[disabled] {
        background: #0059da;
        opacity: 0.2;
        cursor: no-drop;
      }
    }
  }
}
</style>
