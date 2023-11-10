<template>
  <div
    id="confirmPayment"
    :class="{ heightAuto: waitState }"
    ref="box_ref"
    @scroll="handleScroll"
    @click="vndBankCode = false"
  >
    <div class="buyPayWaitPage" v-if="waitState" key="1">
      <BuyPayWaitPage :url="payUrl" />
    </div>
    <div
      id="confirmPayment-box"
      ref="padding_bottom_box"
      v-else
      @click="harderSelectclone"
      key="2"
    >
      <vndChildren
        class="spacingAdapting-padding"
        v-if="vndData"
        :vndData="vndData"
      />
      <div class="confirmPayment-content" ref="form_ref" v-else>
        <!-- 支付方式信息模块 -->
        <PayMethodInfo class="PayMethodInfo spacingAdapting-padding" />
        <!-- VND选择银行 -->
        <div
          class="select-inputBox spacingAdapting-padding"
          v-if="['210'].includes(payMethodInfo.payWayCode)"
        >
          <SelectInput
            v-model="backTypeText"
            :selectList="bankType"
            :placeholder="$t('formInfo.vnd_bankCode_placeholder')"
            :disable="!buttonData.loading === false"
            @selectItem="selectBankType"
            ref="SelectInput_ref"
          />
        </div>
        <!-- OVO -->
        <div
          class="phone-inputBox spacingAdapting-padding"
          v-if="payMethodInfo.payWayCode === '10006'"
        >
          <trader-information phone="phone" v-if="!formShowStatus.basicItem" />
          <PhoneInput
            v-model="phone"
            :disabled="ovoLoading"
            areaCode="62"
            :title="$t('formInfo.phone_title')"
            placeholder="082197662283"
            maxlength="12"
            v-if="formShowStatus.basicItem"
          />
        </div>

        <!-- QRIS saas pay-->
        <div
          class="QRISView"
          v-show="
            ['10004', '40001', '40004'].includes(payMethodInfo.payWayCode) &&
            qrCodeState
          "
        >
          <QrCode ref="QRcode_ref" />
        </div>
        <IncludedDetails
          class="IncludedDetails spacingAdapting-padding"
          v-if="IncludedDetails"
          ref="includedDetails_ref"
          :class="{ IncludedDetails_top: AuthorizationInfo_state === false }"
          :type="2"
          :payWayCode="payMethodInfo.payWayCode"
        />
        <!-- tips icon -->
        <div style="display: flex; justify-content: center">
          <transition>
            <div class="downTips-icon" v-show="goDown_state" @click="goDown">
              <img
                src="@/assets/images/downIcon.svg"
                ref="downTips_ref"
                alt=""
              />
            </div>
          </transition>
        </div>
      </div>
      <footer class="footer" ref="footer_ref">
        <div class="errorTips" v-if="form_errorTips">
          Please fill in all fields with valid information.
        </div>
        <CustomButton
          :buttonData="buttonData"
          :timeStatus="startPayment ? paymentCountDownMinute : ''"
          class="button_ref"
          ref="button_ref"
          @click.native="submit"
        ></CustomButton>
        <bottom-bar
          @setPaddingBottom="
            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
          "
        />
      </footer>
    </div>
  </div>
</template>

<script>
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import { isElementNotInViewport, timeDown } from "@/utils";
import {
  querySubmitToken,
  checkKyc,
  checkKyc_onfido,
  getKycRule,
} from "@/utils/publicRequest";
import BuyPayWaitPage from "@/components/PaymentWaitingPage/buyPayWaitPage";
import { mapState } from "vuex";
import vndChildren from "@/views/buyCurrency/payments/e-wallet/children/vndChildren";
//支付方式信息
import PayMethodInfo from "@/components/PayMethodInfo/index";
import QrCode from "@/components/QrCode/index";
import SelectInput from "@/components/Input/select";
import PhoneInput from "@/components/Input/phone";
import moment from "moment-timezone";

export default {
  name: "otherWayPay",
  components: {
    BuyPayWaitPage,
    IncludedDetails,
    vndChildren,
    PayMethodInfo,
    QrCode,
    SelectInput,
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
      //vnd新增配置
      vndBankCode: false,
      backTypeText: "",
      bankType: [
        { id: 1, name: "VCB" },
        { id: 2, name: "TCB" },
        { id: 3, name: "ACB" },
        { id: 4, name: "MB" },
      ],
      vndData: "",
      //
      waitState: false,
      //展示费率状态
      IncludedDetails: true,
      parameter: {},

      phone: "08",
      ovoLoading: false,

      qrCodeState: false,
      qrUrl: "",
      startPayment: false,

      paystateTimeOut: null,

      paymentCountDown: null,
      paymentCountDownNum: 900,
      paymentCountDownMinute: "00:00",

      vnd_paymentCountDown: null,
      vnd_paymentCountDownNum: 900,
      vnd_paymentCountDownMinute: "00:00",

      AuthorizationInfo_state: true,

      //按钮状态
      buttonData: {
        loading: false,
        triggerNum: 0,
        customName: false,
      },

      goDown_state: false,
      oldOffsetTop: 0,
      scrollTimeDown: null,

      fixedRampFee: true,
      isLoading: false,

      //公司地址展示状态
      companyAddress: true,

      // 支付链接
      payUrl: "",

      // 表单错误信息
      form_errorTips: false,
    };
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),

    disabled() {
      if (
        [
          "10004",
          "10005",
          "201",
          "202",
          "203",
          "90001",
          "90002",
          "22000",
          "23000",
        ].includes(this.payMethodInfo.payWayCode)
      ) {
        return false;
      } else if (
        this.phone !== "" &&
        this.phone !== "08" &&
        this.payMethodInfo.payWayCode === "10006"
      ) {
        return false;
      } else if (
        ["40001", "40002", "40003", "40004"].includes(
          this.payMethodInfo.payWayCode
        ) ||
        this.qrUrl
      ) {
        return false;
      } else if (
        (["210"].includes(this.payMethodInfo.payWayCode) &&
          this.backTypeText) ||
        this.vndData
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  // beforeRouteLeave(to,from,next){
  //   console.log(to,from)
  //   // if(to.path !== '/tradeHistory' && to.path !== '/paymentResult'){
  //     window.sessionStorage.removeItem("indonesiaPayment");
  //   // }
  //   next()
  // },
  //清除页面数据
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("indonesiaPayment");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      if (
        to.name === "otherWayPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        window.sessionStorage.removeItem("indonesiaPayment");
        //返回弹出框
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
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

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    this.backFillTraderInformation();

    //初始化根据可视高度控制向下提示按钮状态
    if (this.waitState === false) {
      setTimeout(() => {
        if (this.$refs.box_ref) {
          setTimeout(() => {
            if (
              isElementNotInViewport("confirmPayment", this.$refs.footer_ref)
            ) {
              this.goDown_state = true;
            } else {
              this.goDown_state = false;
            }
          }, 100);
        }
        window.addEventListener("scroll", this.handleScroll, true);
      });
    }

    this.buttonData.type = ["10005", "10006", "40002"].includes(
      this.payMethodInfo.payWayCode
    )
      ? "baht"
      : "";

    this.receiveInfo();
  },
  destroyed() {
    this.$store.dispatch("request/clearAllQuery");
    window.removeEventListener("scroll", this.handleScroll, true);
    window.clearInterval(this.paystateTimeOut);
    window.clearInterval(this.paymentCountDown);
    this.paystateTimeOut = null;
    this.paymentCountDown = null;
    //步骤条
    this.$store.commit("changeBuyPayProcessTab", true);
    this.waitState = false;
    this.$parent.confirmOrderStatus = false;
  },
  methods: {
    //清除显示
    harderSelectclone() {
      setTimeout(() => {
        if (this.$refs.SelectInput_ref) {
          this.$refs.SelectInput_ref.listStatus = false;
        }
      });
    },

    //修改银行卡类型
    selectBankType(val) {
      this.backTypeText = val.name;
      this.vndBankCode = false;
    },
    receiveInfo() {
      //订单商户
      if (
        this.$route.query.orderNo &&
        this.$route.query.orderNo !== "undefined"
      ) {
        this.fixedRampFee = false;
        this.isLoading = true;
      }
      // this.parameter = this.$store.state.buyRouterParams;
      //Restore the data before refreshing the page
      if (sessionStorage.getItem("indonesiaPayment")) {
        //隐藏公司地址
        this.companyAddress = false;

        let data = JSON.parse(sessionStorage.getItem("indonesiaPayment"));
        this.payUrl = data.payUrl;
        this.startPayment = true;
        this.paymentCountDownNum = data.paymentCountDownNum;
        this.paymentCountDownMinute = data.paymentCountDownMinute;
        this.refreshPaystate();
        this.buttonData = {
          loading: false,
          triggerNum: 1,
          customName: false,
        };
        //QRIS
        if (
          ["10004", "40001", "40004"].includes(this.payMethodInfo.payWayCode)
        ) {
          this.payMethodInfo.payWayCode === "10004"
            ? (this.paymentCountDownMinute = "120:00")
            : this.payMethodInfo.payWayCode === "10004"
            ? (this.paymentCountDownMinute = "10:00")
            : (this.paymentCountDownMinute = "15:00");

          this.$store.commit("changeBuyPayProcessTab", false);
          this.qrCodeState = true;
          setTimeout(() => {
            this.IncludedDetails = false;
            this.$parent.$refs.viewTab.routerName =
              "navTabTitle.Completepayment";
          });
          this.qrUrl = data.webUrl;
          this.$refs.QRcode_ref.generateQRcode(this.qrUrl);
        }
        if (
          [
            "10006",
            "10005",
            "40002",
            "201",
            "202",
            "203",
            "90001",
            "90002",
            "22000",
            "23000",
            "40003",
          ].includes(this.payMethodInfo.payWayCode)
        ) {
          //不展示返回模块
          this.$parent.confirmOrderStatus = true;
          //步骤条隐藏
          this.waitState = true;
          this.$store.commit("changeBuyPayProcessTab", false);
          this.buttonData = {
            loading: false,
            triggerNum: 0,
            customName: false,
            type: "baht",
          };
        }
        //OVO
        if (this.payMethodInfo.payWayCode === "10006") {
          //步骤条隐藏
          this.$store.commit("changeBuyPayProcessTab", false);
          this.phone = data.phone;
          this.ovoLoading = true;
        }
        //越南bank transfer
        if (this.payMethodInfo.payWayCode === "210") {
          this.paymentCountDownMinute = "120:00";
          setTimeout(() => {
            this.$parent.$refs.viewTab.routerName =
              "navTabTitle.Completepayment";
            //步骤条隐藏
            this.$store.commit("changeBuyPayProcessTab", false);
          });
          this.vndData = data.vndData;
          this.buttonData = {
            loading: false,
            triggerNum: 1,
            customName: false,
          };
        }
        this.AuthorizationInfo_state = data.AuthorizationInfo_state;
      }
    },

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (!info.status || sessionStorage.getItem("indonesiaPayment")) return;
      this.formShowStatus.basicItem = false;
      this.phone = info.phone;
    },

    async submit() {
      if (this.disabled && this.buttonData.triggerNum !== 1) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          triggerNum: 0,
          customName: false,
        };
        return;
      }
      this.form_errorTips = false;

      this.AuthorizationInfo_state = false;
      this.buttonData.type = ["10005", "10006"].includes(
        this.payMethodInfo.payWayCode
      )
        ? "baht"
        : "";

      //验证kyc是否通过 二次支付不验证kyc
      if (
        ["40001", "40002"].includes(this.payMethodInfo.payWayCode) &&
        !this.$route.query.pathHistry
      ) {
        //验证是否通过kyc
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
          this.buttonData.triggerNum = 0;
          return;
        }
      }

      await this.pay();
    },
    async pay() {
      let submitToken = await querySubmitToken();
      if (
        submitToken === true &&
        !this.$store.state.ovo_va_mex_qrs_Status &&
        this.vndData === ""
      ) {
        this.buttonData.loading = true;
        //DANA、QRIS
        var params = {
          orderNo: this.orderNo,
          lastname: "11111",
        };

        //OVO
        if (this.payMethodInfo.payWayCode === "10006") {
          params.phone = this.phone;
          this.ovoLoading = true;
        }
        //201,202,203 越南支付
        let queryPath = "";
        if (["201", "202", "203"].includes(this.payMethodInfo.payWayCode)) {
          queryPath = this.$api.post_internationalCard;
          params = {
            orderNo: this.orderNo,
            lastname: "11111",
            token: "token",
          };
          // queryPath = this.$api.post_alchemyPayPay;
          // params = {
          //   orderNo: this.orderNo,
          //   subType:this.backTypeText,
          //   payWayCode:this.payMethodInfo.payWayCode
          // }
        } else {
          //印尼支付
          queryPath = this.$api.post_indonesiaBuy;
          //印尼DANA支付 本地接口迁移
          // if(this.payMethodInfo.payWayCode === '10005'){
          //   queryPath = this.$api.post_alchemyPayPay;
          //   params = {
          //     orderNo: this.orderNo,
          //     payWayCode:this.payMethodInfo.payWayCode
          //   }
          //   //印尼支付bank tranfer
          // }else
          if (this.payMethodInfo.payWayCode === "210") {
            queryPath = this.$api.post_alchemyPayPay;
            params = {
              payWayCode: this.payMethodInfo.payWayCode,
              orderNo: this.orderNo,
              subType: this.backTypeText,
            };
          }
        }
        //新加坡、印度INR-UPI90001 90002-IMPS、澳大利亚AUD-22000、澳大利亚AUD-23000
        if (
          [
            "40001",
            "40002",
            "40003",
            "40004",
            "90001",
            "90002",
            "22000",
            "23000",
          ].includes(this.payMethodInfo.payWayCode)
        ) {
          queryPath = this.$api.post_alchemyPayPay;
          params = {
            orderNo: this.orderNo,
            payWayCode: this.payMethodInfo.payWayCode,
          };
          if (["40004"].includes(this.payMethodInfo.payWayCode)) {
            params = Object.assign(params, {
              customParam: {},
              businessParams: {},
            });
          }
        }
        //二次支付的时候携带是哪个支付方式
        if (this.$route.query.pathHistry === "tradeHistory") {
          params.payWayCode = this.payMethodInfo.payWayCode;
        }
        // 打开新窗口的支付方式
        if (
          [
            "10006",
            "10005",
            "40002",
            "201",
            "202",
            "203",
            "90001",
            "90002",
            "40003",
          ].includes(this.payMethodInfo.payWayCode)
        ) {
          var newWindow;
          new Promise(() => {
            newWindow = window.open();
          });
        }
        this.$axios
          .post(queryPath, params, "submitToken")
          .then((res) => {
            if (res && res.data) {
              //隐藏公司地址
              this.companyAddress = false;

              this.payUrl = res.data.webUrl;

              this.$store.commit("set_ovo_va_mex_qrs_Status", true);

              this.buttonData.loading = false;
              this.storeData(res);
              //Happy countdown refresh order status
              this.startPayment = true;
              this.refreshPaystate();

              if (
                ["10004", "40001", "40004"].includes(
                  this.payMethodInfo.payWayCode
                )
              ) {
                if (["10004"].includes(this.payMethodInfo.payWayCode)) {
                  this.qrUrl = res.data.webUrl;
                } else if (
                  ["40001", "40004"].includes(this.payMethodInfo.payWayCode)
                ) {
                  this.qrUrl = res.data.barcode;
                }
                this.$store.commit("changeBuyPayProcessTab", false);
                this.IncludedDetails = false;
                setTimeout(() => {
                  this.$parent.$refs.viewTab.routerName =
                    "navTabTitle.Completepayment";
                });
                this.qrCodeState = true;
                this.$refs.QRcode_ref.generateQRcode(this.qrUrl);
                return;
              }

              // 当前页访问
              if (["22000", "23000"].includes(this.payMethodInfo.payWayCode)) {
                //不展示返回模块
                this.$parent.confirmOrderStatus = true;
                window.location = res.data.webUrl;
              }

              //OVO //DANA
              if (
                [
                  "10006",
                  "10005",
                  "40002",
                  "201",
                  "202",
                  "203",
                  "90001",
                  "90002",
                  "22000",
                  "23000",
                  "40003",
                ].includes(this.payMethodInfo.payWayCode)
              ) {
                //不展示返回模块
                this.$parent.confirmOrderStatus = true;
                //步骤条隐藏
                this.$store.commit("changeBuyPayProcessTab", false);
                //跳转外链接展示等待页面
                this.waitState = true;
              }
              //vnd支付展示
              if (["210"].includes(this.payMethodInfo.payWayCode)) {
                //不展示返回模块
                // this.$parent.confirmOrderStatus = true;
                setTimeout(() => {
                  this.$parent.$refs.viewTab.routerName =
                    "navTabTitle.Completepayment";
                  this.$parent.$refs.routerView_box.scrollTop = 0;
                  //步骤条隐藏
                  this.$store.commit("changeBuyPayProcessTab", false);
                });
                this.vndData = res.data;
                this.vndData.backTypeText = this.backTypeText;
                this.buttonData = {
                  loading: false,
                  triggerNum: 1,
                  customName: false,
                };
                return;
              }
              //ovo loading
              this.payMethodInfo.payWayCode === "10006"
                ? (this.ovoLoading = true)
                : "";
              this.buttonData = {
                loading: false,
                triggerNum: 0,
                customName: false,
                type: [
                  "10005",
                  "10006",
                  "40002",
                  "201",
                  "202",
                  "203",
                  "90001",
                  "90002",
                  "22000",
                  "23000",
                  "40003",
                ].includes(this.payMethodInfo.payWayCode)
                  ? "baht"
                  : "",
              };
              [
                "10006",
                "10005",
                "40002",
                "201",
                "202",
                "203",
                "90001",
                "90002",
                "40003",
              ].includes(this.payMethodInfo.payWayCode)
                ? (newWindow.location = res.data.webUrl)
                : "";
            } else {
              this.startPayment = false;
              this.buttonData = {
                loading: false,
                triggerNum: 0,
                customName: false,
                type: [
                  "10005",
                  "10006",
                  "40002",
                  "201",
                  "202",
                  "203",
                  "90001",
                  "90002",
                  "22000",
                  "23000",
                  "40003",
                ].includes(this.payMethodInfo.payWayCode)
                  ? "baht"
                  : "",
              };
              [
                "10006",
                "10005",
                "40002",
                "201",
                "202",
                "203",
                "90001",
                "90002",
                "40003",
              ].includes(this.payMethodInfo.payWayCode)
                ? newWindow.close()
                : "";
            }
          })
          .catch(() => {
            this.buttonData = {
              loading: false,
              triggerNum: 0,
              customName: false,
              type: [
                "10005",
                "10006",
                "40002",
                "201",
                "202",
                "203",
                "90001",
                "90002",
                "22000",
                "23000",
                "40003",
              ].includes(this.payMethodInfo.payWayCode)
                ? "baht"
                : "",
            };
            this.$store.commit("set_ovo_va_mex_qrs_Status", false);
            [
              "10006",
              "10005",
              "40002",
              "201",
              "202",
              "203",
              "90001",
              "90002",
              "40003",
            ].includes(this.payMethodInfo.payWayCode)
              ? newWindow.close()
              : "";
            this.$store.commit("set_ovo_va_mex_qrs_Status", false);
          });
      }
    },

    //Store data to prevent page refresh
    storeData() {
      let newData = {};
      newData.webUrl = this.qrUrl;
      newData.phone = this.phone;
      newData.vndData = this.vndData;
      newData.paymentCountDownMinute = this.paymentCountDownMinute;
      newData.paymentCountDownNum = this.paymentCountDownNum;
      newData.AuthorizationInfo_state = this.AuthorizationInfo_state;
      newData.payUrl = this.payUrl;
      sessionStorage.setItem("indonesiaPayment", JSON.stringify(newData));
    },

    refreshPaystate() {
      this.startPayment = true;
      //15 minutes order countdown
      this.paymentCountDown = setInterval(() => {
        //order overtime
        // this.paymentCountDownNum = 10;
        //  ["10004"].includes(this.payMethodInfo.payWayCode)?this.$parent.BuyTimeOut = '':'';
        if (this.paymentCountDownNum <= 0) {
          clearInterval(this.paystateTimeOut);
          clearInterval(this.paymentCountDown);
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
          return;
        }
        this.paymentCountDownMinute = timeDown(this.paymentCountDownNum);
        // this.paymentCountDownNum -= 1;
        this.storeData();
      }, 1000);
      //Refresh payment status
      this.requestStatus();
      this.paystateTimeOut = setInterval(() => {
        this.requestStatus();
      }, 1000);
    },
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
          res.data &&
          (res.data.orderStatus === 0 ||
            (res.data.orderStatus >= 2 && res.data.orderStatus <= 6))
        ) {
          this.$parent.$parent.tipsState = false;
          this.$router.replace(`/paymentResult?customParam=${this.orderNo}`);
        }
      });
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      if (!this.waitState) {
        window.clearTimeout(this.scrollTimeDown);
        this.scrollTimeDown = null;
        // let offset = this.$refs.button_ref.$refs.buttonChild_ref.getBoundingClientRect();
        //附加滚动
        let offset = document.querySelector(".button_ref");
        if (
          this.$parent.$refs.routerView_box.scrollTop +
            this.$parent.$refs.routerView_box.offsetHeight >=
          offset.offsetTop - 40
        ) {
          this.goDown_state = false;
        } else {
          this.scrollTimeDown = setTimeout(() => {
            this.goDown_state = true;
          }, 1000);
        }
      }
    },
    goDown() {
      setTimeout(() => {
        let offset = document.querySelector(".button_ref");
        offset.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
        this.goDown_state = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.buyPayWaitPage,
.heightAuto {
  height: 100%;
}
#confirmPayment-box {
  height: 100%;
  overflow-y: auto;
}

.select-inputBox {
  margin-top: 0.16rem;
}

.IncludedDetails {
  margin-top: 0.1rem;
}

.number_input {
  background: #ffffff;
  font-family: Medium !important;
  font-size: 0.16rem !important;
  font-weight: 500 !important;
  color: #252830 !important;
  padding: 0 0 0 0.08rem !important;
}
.number_input ::v-deep .van-field__control:disabled {
  cursor: no-drop;
}

.downTips-icon {
  position: absolute;
  bottom: 0.5rem;
  width: 0.5rem;
  height: 0.36rem;
  background: rgba(0, 128, 247, 0.24);
  box-shadow: 0 0 0.15rem rgba(65, 184, 253, 0.25);
  border-radius: 0.18rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  img {
    width: 0.2rem;
  }
}
.downTips-icon img {
  animation: jumpBoxHandler 1.8s infinite; /* 1.8s 事件完成时间周期 infinite无限循环 */
}
.v-enter-active,
.v-leave-active {
  transition: all 1s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
.v-enter-to,
.v-leave {
  opacity: 1;
}
@keyframes jumpBoxHandler {
  /* css事件 */
  0% {
    transform: translate(0px, 0);
  }
  50% {
    transform: translate(0px, 0.06rem); /* 可配置跳动方向 */
  }
  100% {
    transform: translate(0px, 0px);
  }
}

#confirmPayment {
  padding: 0 !important;
  flex: 1;
  .buyPayWaitPage {
    padding: 0 0.16rem;
  }
  #confirmPayment-box {
    padding: 0 0.16rem 0;
    .confirmPayment-content {
      .phone-inputBox {
        padding-top: 0.09rem;
        margin-bottom: 0.24rem;
      }
      .PayMethodInfo {
      }
      .QRISView {
      }
    }
    .footer {
      width: 100%;
      position: sticky;
      left: 0;
      background: #ffffff;
      padding: 0.08rem 0 0;
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
  }
}
</style>
