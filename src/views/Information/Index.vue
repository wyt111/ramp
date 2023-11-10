<template>
  <div class="fill-information">
    <div class="information-content">
      <div class="page-tips">
        Please confirm the correctness of the information in case of payment
        failure
      </div>
      <div class="information-form">
        <div
          class="formLine"
          :class="{
            formContentError: item.tipsState,
            focus: item.focus,
            readonly: item.readonly,
          }"
          :data-width="item.width"
          v-for="item in formJson"
          :key="item.paramsName"
        >
          <div class="formTitle">
            <span>{{ $t(item.name) }}</span>
          </div>
          <div class="formContent">
            <input
              type="text"
              v-model="item.model"
              :maxlength="item.maxLength"
              @input="inputChange(item, $event)"
              @focus="inputFocus(item)"
              @blur="inputBlur(item)"
              :placeholder="$t(item.placeholder)"
              :readonly="item.readonly"
            />
          </div>
          <el-collapse-transition>
            <p class="errorMessage" v-if="item.tipsState">
              {{ $t(item.tips) }}
            </p>
          </el-collapse-transition>
        </div>
      </div>
    </div>
    <!-- 下一步 -->
    <div class="continueBox" ref="footer_ref">
      <button
        class="continue"
        @click="submitData"
        :disabled="disabled || buttonLoading"
      >
        {{ $t("button_components.proceed") }}
        <button-loading v-if="buttonLoading" class="rightIcon" />
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
import allFormJson from "@/assets/json/fillInformation.json";
import {
  formatNumberWithSeparator,
  filterStringByRegExp,
  ObjectLength,
} from "@/utils";
import { mapState } from "vuex";
import { getUserIp } from "@/utils/publicRequest";
import { AES_Encrypt, AES_Decrypt } from "@/utils/encryp.js";
import { getLegendQueryData } from "@/utils/publicRequest";

const IdTypeMapping1 = {
  1: "ID card",
  2: "Passport",
  3: "Residence Permit",
  4: "Driver License",
};
const IdTypeMapping2 = {
  "ID card": "id_card",
  Passport: "passport",
  "Residence Permit": "residence_permit",
  "Driver License": "dl",
};
export default {
  name: "FillInformation",
  data() {
    return {
      buttonLoading: false,
      channel: "LegendTrading",
      formJson: [],
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
    }),
    ...mapState("secondaryBuyPayments", {
      buyPayment_secondPay: (state) => state.buyPayment_secondPay,
      fiatCurrencyAmount_secondPay: (state) =>
        state.fiatCurrencyAmount_secondPay,
    }),
    ...mapState("kycInfo", {
      legendTradingKycInfo: (state) => state.legendTradingKycInfo,
    }),
    disabled() {
      // 判断 表单内容 是否全部  填写 并且格式正确;
      let isDisabled = false;
      this.formJson.some((item) => {
        const val = item.model?.trim();
        if (
          !val ||
          (item.regular && !new RegExp(`^${item.regular}$`).test(val))
        ) {
          isDisabled = true;
          return true;
        }
      });
      return isDisabled;
    },
  },
  beforeRouteEnter(to, from, next) {
    if (from.name == "IdProof") {
      getLegendQueryData()
        .then(() => {
          next();
        })
        .catch(() => {
          next();
        });
    } else {
      next();
    }
  },
  created() {
    this.initializeForm();
  },

  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {
    setUserDefaultInfo(responseData) {
      const mapping = {
        firstName: "firstName",
        lastName: "lastName",
        country: "country",
        idType: "idDocType",
        idNo: "number",
        birthdate: "dob",
      };
      if (!["us", "usa"].includes(responseData?.country?.toLowerCase())) {
        this.formJson = this.formJson.filter(
          (item) => item.paramsName !== "ssn"
        );
      }
      const ReadonlyName = Boolean(
        responseData?.firstName && responseData?.lastName
      );
      this.formJson.forEach((item) => {
        const paramName = item.paramsName;
        if (mapping[paramName]) {
          if (mapping[paramName] === "idDocType") {
            item.model =
              IdTypeMapping1[responseData?.[mapping[paramName]]] || "";
            item.readonly = Boolean(item.model);
          } else if (["firstName", "lastName"].includes(mapping[paramName])) {
            item.model = responseData?.[mapping[paramName]] || "";
            item.readonly = ReadonlyName;
          } else {
            item.model = responseData?.[mapping[paramName]] || "";
            item.readonly = Boolean(item.model);
          }
        }
      });
      if (
        ObjectLength(this.legendTradingKycInfo) &&
        String(this.legendTradingKycInfo?.status) !== "null"
      ) {
        const mapping1 = {
          address: "address",
          city: "city",
          state: "state",
          ssn: "ssn",
          zipcode: "zipcode",
          firstName: "firstName",
          lastName: "lastName",
          birthdate: "birthdate",
          idNo: "idNo",
        };
        this.formJson.forEach((item) => {
          const paramName = item.paramsName;
          if (mapping1[paramName]) {
            if (
              ["address", "idNo", "birthdate"].includes(mapping1[paramName])
            ) {
              item.model = AES_Decrypt(
                this.legendTradingKycInfo?.[mapping1[paramName]] || ""
              );
            } else {
              item.model =
                this.legendTradingKycInfo?.[mapping1[paramName]] || "";
            }
            this.inputBlur(item);
          }
        });
      }
    },
    // 查询用户kyc成功后信息
    findUserDetails() {
      this.$axios.get(this.$api.get_findUserDetail, "").then((res) => {
        if ((!res && res.returnCode !== "0000") || !res.data) return;
        // 成功状态
        this.setUserDefaultInfo(res.data);
      });
    },
    initializeForm() {
      this.formJson = JSON.parse(
        JSON.stringify(
          allFormJson.find((item) => item.channel === this.channel).form
        )
      );

      this.findUserDetails();
    },
    inputFocus(item) {
      if (!item.readonly) {
        item.focus = true;
      }
    },
    inputBlur(item) {
      item.focus = false;
      if (
        item.model &&
        item.regular &&
        !new RegExp(`^${item.regular}$`).test(item.model)
      ) {
        item.tipsState = true;
      } else {
        item.tipsState = false;
      }
    },

    inputChange(item, $event) {
      item.model = filterStringByRegExp(
        $event.target.value,
        item.input_regular
      );
      if (item.regular_separator_position) {
        item.model = formatNumberWithSeparator(
          item.model,
          item.regular_separator_position,
          item.regular_separator
        );
      }

      if (item.tipsState) {
        if (!item.model || new RegExp(`^${item.regular}$`).test(item.model)) {
          item.tipsState = false;
        }
      }
    },
    /**
     * [post_legend_submitData 提交表单信息]
     * @return {[type]} [description]
     */
    async submitData() {
      let status = await getLegendQueryData();
      status = String(this.legendTradingKycInfo?.status);
      if (["2", "3", "4"].includes(status)) {
        this.$router.replace(`/id_authentication?status=${status}`);
        return;
      }
      this.buttonLoading = true;
      let ipAddress;
      try {
        ipAddress = await getUserIp();
      } catch (e) {
        this.buttonLoading = false;
        console.log(e);
      }

      let email = AES_Decrypt(localStorage.getItem("login_email"));

      let params = {
        ipAddress: ipAddress,
        email: email,
      };
      this.formJson.forEach((item) => {
        if (item.paramsName === "idType") {
          params[item.paramsName] = IdTypeMapping2[item.model];
        } else if (["address", "birthdate", "idNo"].includes(item.paramsName)) {
          params[item.paramsName] = AES_Encrypt(item.model);
        } else {
          params[item.paramsName] = item.model;
        }
      });
      this.$axios
        .post(this.$api.post_legend_submitData, params)
        .then((res) => {
          if (res.returnCode === "0000") {
            getLegendQueryData()
              .then((res) => {
                this.buttonLoading = false;
                this.$router.replace(`/id_authentication?status=${res}`);
              })
              .catch((err) => {
                this.buttonLoading = false;
                this.$router.replace(`/id_authentication`);
              });
          }
        })
        .catch((err) => {
          this.buttonLoading = false;
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.fill-information {
  flex: 1;

  .information-content {
    .page-tips {
      color: #5d636d;
      font-family: "SF Pro Display";
      font-size: 0.13rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 0.29rem;
    }
    .information-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .formLine {
        margin-bottom: 0.24rem;
        position: relative;
        width: 100%;
        &[data-width="164"] {
          width: 1.64rem;
        }
        .formTitle {
          position: absolute;
          left: 0.07rem;
          transform: translateY(-50%);
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.13rem;
          line-height: 0.18rem;
          color: #5d636d;
          z-index: 1;
          padding: 0 0.04rem;
          display: flex;
          align-items: center;
          &:before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            border-top: 1px solid #fff;
            top: 0.09rem;
          }
          span {
            position: relative;
          }
        }
        .formContent {
          width: 100%;
          position: relative;
          input {
            display: block;
            height: 0.48rem;
            width: 100%;
            border: 1px solid #dbdee3;
            box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
            border-radius: 0.06rem;
            padding: 0 0.12rem;
            font-style: normal;
            color: #252830;
            font-family: HarmonyOS Sans;
            font-size: 0.16rem;
            font-weight: 500;
            line-height: 0.24rem;
            &:hover {
              border-color: #babfc8;
            }

            &::placeholder {
              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 400;
              font-size: 0.14rem;
              line-height: 0.16rem;
              color: #b7bcc5;
            }
          }
          &.cursor {
            cursor: pointer;
          }
        }
        .errorMessage {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.13rem;
          line-height: 0.18rem;
          color: #f53f3f;
          margin-top: 0.02rem;
        }
        &.focus {
          .formTitle {
            color: #0059da;
          }
          .formContent {
            input {
              border-color: #0059da;
            }
          }
        }

        &.formContentError {
          .formTitle {
            color: #f53f3f;
          }
          .formContent {
            input {
              border-color: #f53f3f;
              box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
            }
          }
        }
        &.readonly {
          .formTitle {
            &:before {
              border-color: #f4f8fb;
            }
          }
          .formContent {
            input {
              color: #5d636d;
              border: 1px solid #e6e8eb;
              background: #f4f8fb;
            }
          }
        }
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
