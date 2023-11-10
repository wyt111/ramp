<template>
  <div
    class="brazilPay-container"
    :class="[{ 'custom-scrollbar': !status }]"
    ref="padding_bottom_box"
    @click.stop="clearFormStatus"
  >
    <!-- 新增支付方式信息模块 -->
    <PayMethodInfo class="PayMethodInfo spacingAdapting-padding" />
    <!-- 表单内容 -->
    <div class="form-data spacingAdapting-padding" v-if="!status">
      <trader-information
        name="name"
        idNumber="number"
        phone="phone"
        v-if="!formShowStatus.basicItem"
      />
      <!-- 姓名 -->
      <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
        <TextInput
          :class="{ 'error-input': formError.name }"
          type="spanish"
          v-model="formData.name"
          :disabled="inputDisable.name"
          @input="FormValidation('name', 'input')"
          @blur="FormValidation('name', 'blur')"
          :title="$t('formInfo.fullName_placeholder')"
        />
        <el-collapse-transition>
          <p class="error-p" v-if="formError.name">
            {{ $t("ArgentinaPay.fullNameTips") }}
          </p>
        </el-collapse-transition>
      </div>
      <!-- 选择id类型 -->
      <div
        class="select-inputBox text-inputBox form-item"
        v-if="formShowStatus.basicItem"
      >
        <SelectInput
          v-model="formData.pixType"
          :selectList="pixList"
          :disable="inputDisable.pixType"
          @selectItem="selectPixType"
          ref="SelectInput_ref"
        />
      </div>
      <!-- 填写id -->
      <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
        <TextInput
          :class="{ 'error-input': formError.id }"
          type="number"
          v-model="formData.pixNumber"
          :disabled="inputDisable.pixNumber"
          @input="FormValidation('pixNumber', 'input')"
          @blur="FormValidation('pixNumber', 'blur')"
          :maxlength="form_additionalData.pixNumLength"
          :placeholder="idPlaceholder"
          :title="$t('formInfo.id_title')"
        />
        <el-collapse-transition>
          <p class="error-p" v-if="formError.id">
            {{ $t("ArgentinaPay.correctcode") }}
          </p>
        </el-collapse-transition>
      </div>
      <!-- 手机号 -->
      <div class="phone-inputBox form-item" v-if="formShowStatus.basicItem">
        <PhoneInput
          :class="{ 'error-input': formError.phone }"
          v-model="formData.phone"
          areaCode="55"
          :title="$t('formInfo.phone_title')"
          placeholder="12341234123"
          maxlength="11"
        />
        <el-collapse-transition>
          <p class="error-p" v-if="formError.phone">
            {{ $t("ArgentinaPay.phoneTips") }}
          </p>
        </el-collapse-transition>
      </div>
    </div>

    <!-- 支付费用模块 -->
    <IncludedDetails
      style="margin-bottom: 0.08rem"
      class="spacingAdapting-padding"
      v-if="IncludedDetails"
      :type="2"
      :payWayCode="payMethodInfo.payWayCode"
    />
    <!-- qr code -->
    <div class="QRISView" v-if="status">
      <QrCode ref="QRcode_ref" copy="true" />
    </div>
    <footer class="spacingAdapting-padding footer" ref="footer_ref">
      <div class="errorTips" v-if="form_errorTips">
        Please fill in all fields with valid information.
      </div>
      <ConfirmPayMy
        :buttonData="buttonData"
        :countDown="status ? paymentCountDownMinute : ''"
        @click.native="toPay"
      ></ConfirmPayMy>
      <bottom-bar
        @setPaddingBottom="
          $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
        "
      />
    </footer>
  </div>
</template>

<script>
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import ConfirmPayMy from "../../../../components/Button/confirm-pay-my";
import { timeDown } from "@/utils";
import { checkKyc, checkKyc_onfido, getKycRule } from "@/utils/publicRequest";
import { mapState } from "vuex";
import QrCode from "../../../../components/QrCode/index";
import PayMethodInfo from "../../../../components/PayMethodInfo/index";
import SelectInput from "@/components/Input/select";
import TextInput from "@/components/Input/text";
import PhoneInput from "@/components/Input/phone";
import moment from "moment-timezone";

export default {
  name: "BrazilPay",
  components: {
    IncludedDetails,
    ConfirmPayMy,
    QrCode,
    PayMethodInfo,
    SelectInput,
    TextInput,
    PhoneInput,
  },
  data() {
    return {
      formShowStatus: {
        // 基本项表单信息
        basicItem: true,
        // 其他项表单信息
        otherItem: true,
      },

      //展示费率状态
      IncludedDetails: true,
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      status: false,
      qrUrl: "",
      pixList: [
        { id: 1, name: "CPF", idLength: "11" },
        { id: 2, name: "CNPJ", idLength: "14" },
      ],

      //表单绑定数据
      formData: {
        orderNo: "",
        pixType: "CPF",
        pixNumber: "",
        phone: "",
        name: "",
      },
      //接口入参外表单参数
      form_additionalData: {
        pixNumLength: "11",
      },
      //表单错误信息提示
      formError: {
        id: false,
        phone: false,
        name: false,
      },
      inputDisable: {
        name: false,
        pixType: false,
        pixNumber: false,
      },

      paymentCountDown: null,
      paymentCountDownNum: 7200,
      paymentCountDownMinute: "00:00",

      //公司地址展示状态
      companyAddress: true,

      // 表单错误信息
      form_errorTips: false,

      disableStatus: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
      placeOrderQuery: (state) => state.placeOrderQuery,
    }),
    ...mapState("kycInfo", {
      kycCheck: (state) => state.kycCheck,
      kycResultInfo: (state) => state.kycResultInfo,
    }),
    idPlaceholder() {
      return `${this.$t("formInfo.id_placeholder1")} ${
        this.form_additionalData.pixNumLength
      } ${this.$t("formInfo.id_placeholder2")}`;
    },
  },
  watch: {
    "buttonData.loading": {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
    formData: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
    form_additionalData: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
    formError: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
  },
  mounted() {
    //参数为空跳转到首页
    if (
      this.orderNo === "" ||
      this.orderNo === undefined ||
      this.orderNo === null
    ) {
      this.$router.replace("/");
      return;
    }

    // 查询用户kyc成功后信息
    this.finUserDetails();

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    this.backFillTraderInformation();

    this.getpageData();
  },
  destroyed() {
    clearInterval(this.TimeDown);
    this.$store.dispatch("request/clearAllQuery");
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("brazilPay");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      if (
        to.name === "BrazilPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("brazilPay");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },
  methods: {
    set_disableStatus() {
      let formData = this.formData;
      if (this.buttonData.loading) {
        this.disableStatus = true;
        return;
      }

      try {
        let reg = new RegExp(
          `^[0-9]{4,${this.form_additionalData.pixNumLength}}$`
        );
        if (
          !reg.test(this.formData.pixNumber) ||
          this.formData.pixNumber.length !==
            Number(this.form_additionalData.pixNumLength)
        ) {
          this.disableStatus = true;
          return;
        }

        let patrn = /(.)\1\1/;
        let whether =
          this.formData.name.length < 3 ||
          patrn.exec(this.formData.name) ||
          (this.formData.name.length === 2 &&
            this.formData.name.match(new RegExp(/(\w)\1+/g)));
        if (whether) {
          this.disableStatus = true;
          return;
        }
      } catch (e) {
        console.log(e);
      }

      if (
        (formData.pixType &&
          formData.pixNumber &&
          formData.phone &&
          formData.name &&
          !this.formError.id &&
          !this.formError.phone &&
          !this.formError.name) ||
        this.status
      ) {
        this.disableStatus = false;
        return;
      }
      this.disableStatus = true;
    },
    //读取数据
    getpageData() {
      if (sessionStorage.getItem("brazilPay")) {
        let data = JSON.parse(sessionStorage.getItem("brazilPay"));
        this.paymentCountDownNum = data.paymentCountDownNum;
        this.status = data.status;
        this.paymentCountDownMinute = data.paymentCountDownMinute;
        this.qrUrl = data.qrUrl;
        clearTimeout(this.timeoutDown);
        this.timeoutDown = setTimeout(() => {
          this.buttonData = {
            loading: false,
            confirmSuccess: true,
            countNum: 1,
          };
          this.IncludedDetails = false;
          this.$parent.$refs.viewTab.routerName = "navTabTitle.Completepayment";
          this.$store.commit("changeBuyPayProcessTab", false);
          this.$refs.QRcode_ref.generateQRcode(this.qrUrl);
        });
        this.paymentCountStatus();
      }
    },

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (!info.status || sessionStorage.getItem("brazilPay")) return;
      this.formShowStatus.basicItem = false;
      this.formData.name = info.name;
      this.formData.phone = info.phone;
      this.formData.pixType = info.identify.type;
      this.formData.pixNumber = info.identify.number;
    },

    // 查询用户kyc成功后信息
    finUserDetails() {
      let params = {
        payWayCode: this.payMethodInfo.payWayCode,
      };
      this.$axios.get(this.$api.get_findUserDetail, params).then((res) => {
        if ((!res && res.returnCode !== "0000") || !res.data) return;
        // 成功状态
        if (res.data.isPassByPwcWorld) {
          // 存储kyc信息
          let kycCheck = res.data.country === this.placeOrderQuery.alpha2;
          this.$store.commit("kycInfo/set_kycCheck", kycCheck);
          this.$store.commit("kycInfo/set_kycResultInfo", res.data);
          // 赋值表单信息
          this.insertFormInfo();
        }
      });
    },

    // kyc信息带入表单,表单修改为禁选状态
    insertFormInfo() {
      // kyc返回id类型与通道标识不符,需要手动匹配
      if (!this.kycCheck) return;
      if (this.kycResultInfo.firstName) {
        let fullName =
          this.kycResultInfo.firstName + " " + this.kycResultInfo.lastName;
        let patrn = /(.)\1\1/;
        let whether =
          fullName.length &&
          fullName.length > 2 &&
          !patrn.exec(fullName) &&
          !(fullName.length === 2 && fullName.match(new RegExp(/(\w)\1+/g))) &&
          fullName.match(/\p{sc=Latin}/gu) !== null;
        if (whether) {
          this.formData.name = fullName;
          this.inputDisable.name = true;
        }
      }
    },

    selectPixType(item) {
      this.formData.pixType = item.name;
      this.form_additionalData.pixNumLength = item.idLength;
      this.FormValidation("pixNumber", "blur");
    },

    clearFormStatus() {
      if (this.$refs.SelectInput_ref) {
        setTimeout(() => {
          this.$refs.SelectInput_ref.listStatus = false;
        });
      }
    },

    //form表单校验
    FormValidation(val, type) {
      if (val === "pixNumber") {
        let reg = new RegExp(
          `^[0-9]{4,${this.form_additionalData.pixNumLength}}$`
        );

        if (
          !reg.test(this.formData.pixNumber) ||
          this.formData.pixNumber.length !==
            Number(this.form_additionalData.pixNumLength)
        ) {
          if (type == "blur") {
            this.formError.id = true;
          }
        } else {
          this.formError.id = false;
        }

        if (this.formData.pixNumber.length == 0) {
          this.formError.id = false;
        }

        return;
      }
      if (val === "name") {
        let patrn = /(.)\1\1/;
        let whether =
          this.formData.name.length < 3 ||
          patrn.exec(this.formData.name) ||
          (this.formData.name.length === 2 &&
            this.formData.name.match(new RegExp(/(\w)\1+/g)));

        if (whether) {
          if (type == "blur") {
            this.formError.name = true;
          }
        } else {
          this.formError.name = false;
        }

        if (this.formData.name.length == 0) {
          this.formError.name = false;
        }
      }
    },
    //页面15分钟倒计时
    paymentCountStatus() {
      clearInterval(this.TimeDown);
      this.TimeDown = setInterval(() => {
        if (this.paymentCountDownNum > 0 && this.status !== false) {
          // this.paymentCountDownNum--
          this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
          let data = {
            status: this.status,
            paymentCountDownNum: this.paymentCountDownNum,
            paymentCountDownMinute: timeDown(this.paymentCountDownNum),
            qrUrl: this.qrUrl,
          };
          if (this.paymentCountDownNum <= 0) {
            clearInterval(this.TimeDown);
            this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
            return;
          }
          sessionStorage.setItem("brazilPay", JSON.stringify(data));
        } else {
          this.paymentCountDownMinute = "00:00";
          clearInterval(this.TimeDown);
        }
        this.requestStatus();
      }, 1000);
    },
    //发起支付
    async toPay() {
      if (this.disableStatus && this.buttonData.countNum !== 1) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;
      //验证是否通过kyc 二次支付不验证kyc
      if (!this.$route.query.pathHistry) {
        let kycRule = await getKycRule(this.orderNo);
        let isKyc;
        if (kycRule === "1") {
          // onfido 验证方式
          isKyc = await checkKyc_onfido();
        } else if (kycRule === "2") {
          // sumsub 验证方式
          isKyc = await checkKyc();
        }
        if ([1, 3].includes(isKyc)) {
          this.buttonData.countNum = 0;
          return;
        }
      }

      if (this.buttonData.countNum === 1 && this.status === false) {
        let _this = this;
        let params = JSON.parse(JSON.stringify(this.formData));
        let data1 = {
          payWayCode: this.payMethodInfo.payWayCode,
          orderNo: this.orderNo,
          phone: params.phone,
          number: params.pixNumber,
          type: params.pixType,
          name: params.name,
        };
        this.$axios
          .post(this.$api.post_alchemyPayPay, data1, "")
          .then((res) => {
            if (res) {
              //隐藏公司地址
              this.companyAddress = false;

              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
              this.buttonData = {
                loading: false,
                confirmSuccess: true,
                countNum: 1,
              };
              this.$store.commit("changeBuyPayProcessTab", false);
              //隐藏费率展示
              this.IncludedDetails = false;
              setTimeout(() => {
                this.$parent.$refs.viewTab.routerName =
                  "navTabTitle.Completepayment";
              });
              _this.status = true;
              _this.qrUrl = res.data.barcode;
              _this.paymentCountStatus();
              this.$nextTick(() => {
                _this.$refs.QRcode_ref.generateQRcode(_this.qrUrl);
              });
            }
          })
          .catch((error) => {
            if (["91003", "60007"].includes(error.returnCode)) {
              this.$router.push(
                `/paymentResult?customParam=${this.orderNo}&payCode=${error.returnCode}`
              );
            }
            this.buttonData = {
              loading: false,
              confirmSuccess: false,
              countNum: 0,
            };
          });
      }
    },

    //刷新订单状态
    requestStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
        if (res && res.data) {
          //订单创建时间 单位转换时间为毫秒
          const createdTime = moment(res.data.payOrderCreateTime).valueOf();
          //订单超时时间
          const timeOut = Number(res.data.expire * (60 * 1000));
          //现在时间
          const newDate = new Date().getTime();
          this.paymentCountDownNum = Math.floor(
            (createdTime + timeOut - newDate) / 1000
          );
        }
        if (
          res &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.brazilPay-container {
  flex: 1;
  height: 100%;
  .form-data {
    .form-item {
      padding: 0.09rem 0 0;
      &:not(:last-child) {
        margin: 0 0 0.16rem 0;
      }
      .error-p {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.18rem;
        color: #f53f3f;
        margin-top: 0.02rem;
      }
    }
  }
  .footer {
    width: 100%;
    position: sticky;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0 0rem;
    z-index: 999;
    .errorTips {
      margin-bottom: 0.05rem;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      line-height: 0.18rem;
      color: #f53f3f;
    }
  }

  .form-data .text-inputBox,
  .phone-inputBox {
    p {
      margin-top: 0.02rem;
      color: #ff2f2f;
      font-size: 0.14rem;
      padding: 0 0 0 0.04rem;
      font-family: Regular;
    }
  }
}

//新增样式
.QRISView {
  width: 100%;
  margin-top: 0.24rem;
}
</style>
