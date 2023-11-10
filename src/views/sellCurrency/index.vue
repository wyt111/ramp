<template>
  <div id="pay-box" class="custom-scrollbar">
    <Data-loading v-show="dataLoadingStatus" />
    <div v-show="!dataLoadingStatus">
      <HistoryInfo
        :dataLoadingStatus="dataLoadingStatus"
        :oldCardInfo="oldCardInfo"
        :isOldCardInfo="isOldCardInfo"
        @set_isOldCardInfo="set_isOldCardInfo"
        @assignmentOldCardInfo="assignmentOldCardInfo"
        @openCardInfo="openCardInfo"
        :payoutList="payoutList"
        :payFormType="payFormType"
        @selectPayType="selectPayType"
      />
      <!-- 支付表单 -->
      <bank-transfer-form
        ref="BankTransferForm_ref"
        v-show="payFormType === '19000'"
        @getDisabled="getDisabled"
        @getRequest_loading="getRequest_loading"
        @getButtonIsShow="getButtonIsShow"
      />
      <credit-card-form
        ref="CreditCardForm_ref"
        v-show="payFormType === '10010'"
        @getDisabled="getDisabled"
        @getRequest_loading="getRequest_loading"
      />
    </div>
    <PayFooter
      :payFormType="payFormType"
      :request_loading="request_loading"
      :buttonIsShow="buttonIsShow"
      :disabled="disabled"
      @submitPay="submitPay"
      @getRequest_loading="getRequest_loading"
    />

    <!-- 选择历史支付信息弹框 -->
    <van-action-sheet
      v-model="cardInfoList_actionSheet"
      :close-on-click-overlay="true"
      :close-icon="require('@/assets/images/ShutDown1.svg')"
      :title="$t('sellPayType.payoutList_ActionSheet_title')"
    >
      <div id="HistoricalCardInfo">
        <div
          class="cardView"
          v-for="(item, index) in cardInfoList"
          :key="index"
          :class="{ 'cardView-true': which === index }"
          @click="choiseCardInfo(item, index)"
        >
          <div class="line-left">
            <img class="icon" :src="cardType(item)" alt="" />
            <p class="name" v-if="item.accountType == '1'">
              {{ dataDecrypt(item.bankAccountInfo.name) }}
            </p>
            <p class="name" v-else>
              {{
                item.firstName && item.lastName
                  ? dataDecrypt(item.firstName) +
                    " " +
                    dataDecrypt(item.lastName)
                  : ""
              }}
            </p>
          </div>
          <div class="line-right">
            <span>****</span>{{ dataCardDecrypt(item.accountNumber) }}
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
/**
 * 邮件进入地址栏结构 - /sell-formUserInfo?orderId=订单id&position_alpha2=国家alpha2&position_code=国家code&getAmount=法币金额&emailFromPath=sell-formUserInfo&cardInfoFromPath=sellOrder
 */
import valid from "card-validator";
import moment from "moment";
import { mapState } from "vuex";
import { AES_Decrypt } from "@/utils/encryp";
import allFormJson from "@/assets/json/currencyPurchaseFormRules.json";
import CreditCardForm from "./creditCard/form";
import BankTransferForm from "./bankTransfer/index";
import DataLoading from "@/components/loading";
import HistoryInfo from "./childrens/HistoryInfo";
import PayFooter from "@/views/sellCurrency/childrens/PayFooter.vue";

export default {
  name: "sellCardInfo",
  components: {
    PayFooter,
    CreditCardForm,
    BankTransferForm,
    DataLoading,
    HistoryInfo,
  },
  data() {
    return {
      // 历史卡信息
      isOldCardInfo: false,
      oldCardInfo: [],
      cardInfoList: [],
      cardInfoList_actionSheet: false,
      which: 0,

      // 支付表单类型
      payFormType: "",
      // 支付方式列表
      payoutList: [],

      // 数据加载状态
      payTypeList_status: false,
      cardInfoList_status: false,

      disabled: false,
      request_loading: false,
      buttonIsShow: true,
    };
  },
  computed: {
    //卖币信息
    ...mapState("cryptoSellPage", {
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
    }),
    //历史卖币信息
    ...mapState("sellPayments", {
      history_cryptoInfo: (state) => state.cryptoInfo,
      history_cryptoAmount: (state) => state.cryptoAmount,
      history_fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      history_networkInfo: (state) => state.networkInfo,
    }),
    // 页面基本数据
    initData() {
      let data = {};
      if (this.$route.query.payWayCode || this.$route.query.emailFromPath) {
        data = {
          cryptoInfo: this.history_cryptoInfo,
          cryptoAmount: this.history_cryptoAmount,
          fiatCurrencyInfo: this.history_fiatCurrencyInfo,
          networkInfo: this.history_networkInfo,
        };
        return data;
      }
      data = {
        cryptoInfo: this.cryptoInfo,
        cryptoAmount: this.cryptoAmount,
        fiatCurrencyInfo: this.fiatCurrencyInfo,
        networkInfo: this.networkInfo,
      };
      return data;
    },

    dataLoadingStatus() {
      if (this.$route.query.orderId) {
        return false;
      }
      if (!this.payTypeList_status || !this.cardInfoList_status) {
        return true;
      }
      return false;
    },
    formTips() {
      if (this.payFormType === "10010") {
        return "sellPayType.form_tips";
      }
      return "sellPayType.form_bankAccount_tips";
    },
  },
  //首页进入卖币卡表单页面清空缓存
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //初始化选中最近一次历史卡信息状态
      vm.isOldCardInfo = false;
      if (
        to.path === "/sell-formUserInfo" &&
        ["/index", "/tradeHistory", "/tradeHistory-details"].includes(from.path)
      ) {
        // && vm.$store.state.cardInfoFromPath !== 'sellOrder'
        vm.oldCardInfo = [];
        vm.cardInfoList = [];
        vm.which = 0;
        vm.payFormType = "";
        vm.payoutList = [];
        vm.payTypeList_status = false;
        vm.cardInfoList_status = false;
        setTimeout(() => {
          try {
            this.$refs.BankTransferForm_ref.currency =
              this.initData.fiatCurrencyInfo.fiat;
            this.$refs.BankTransferForm_ref.formJson = JSON.parse(
              JSON.stringify(
                allFormJson.filter((item) => {
                  return item.currency.includes(
                    this.$refs.BankTransferForm_ref.currency
                  );
                })[0].form
              )
            );
          } catch (e) {
            console.log(e);
          }
          try {
            vm.$refs.CreditCardForm_ref.clearData();
          } catch (e) {
            console.log(e);
          }
        });
      }
      // 交易历史进入不获取接口 - 功能: 修改卡信息
      if (vm.$route.query.payWayCode || vm.$route.query.emailFromPath) {
        // 修改标题
        vm.payFormType = vm.$route.query.payWayCode;
        if (vm.$route.query.payWayCode == "19000") {
          to.meta.title = "sellPayType.bankAccount_tab_name";
          try {
            vm.$refs.BankTransferForm_ref.initAllData();
          } catch (e) {
            console.log(e);
          }
          return;
        }
        to.meta.title = "sellPayType.creditcard_tab_name";
        try {
          vm.$refs.CreditCardForm_ref.clearData();
          vm.$refs.CreditCardForm_ref.params.userAccountId =
            this.$route.query.userAccountId || "";
        } catch (e) {
          console.log(e);
        }
        return;
      }
      // 修改标题
      to.meta.title = "nav.routerName_sellForm";
    });
  },
  beforeRouteLeave(to, from, next) {
    //离开页面保存表单信息
    // if (this.payFormType === '2') {
    //   let paramsFormData = this..paramsFormData();
    //   window.sessionStorage.setItem('sellForm', JSON.stringify(paramsFormData));
    // }
    this.$refs.BankTransferForm_ref.userAccountId = "";
    this.$refs.CreditCardForm_ref.params.userAccountId = "";
    next();
  },
  activated() {
    // 邮件进入处理参数
    if (this.$route.query.payWayCode || this.$route.query.emailFromPath) {
      this.emailPathIn();
      this.payFormType = this.$route.query.payWayCode;
      setTimeout(() => {
        if (this.$route.query.payWayCode == "19000") {
          this.$refs.BankTransferForm_ref.initAllData();
          return;
        }
        this.$refs.CreditCardForm_ref.clearData();
        this.$refs.CreditCardForm_ref.params.userAccountId =
          this.$route.query.userAccountId || "";
      }, 10);
      return;
    }
    // 请求支付方式列表
    this.requestPayList();
    // 加载历史交易信息
    this.queryCardInfoList();
  },
  methods: {
    dataDecrypt(val) {
      if (!val) return "";
      return AES_Decrypt(val);
    },
    dataCardDecrypt(val) {
      if (!val) return "";
      let cardNum = AES_Decrypt(val);
      return cardNum.substring(cardNum.length - 4, cardNum.length);
    },

    // 请求支付方式列表
    requestPayList() {
      this.payoutList = [];
      let params = {
        alpha2: this.initData.fiatCurrencyInfo.alpha2, // 法币code
        fiat: this.initData.fiatCurrencyInfo.fiat, // 国家code
      };
      this.$axios
        .get(this.$api.get_sellPayList, params)
        .then((res) => {
          if (
            res &&
            res.data &&
            res.data.payoutList &&
            res.data.payoutList.length > 0
          ) {
            // 信用卡支付
            if (
              res.data.payoutList.filter((val) => {
                return val.payWayCode === "10010";
              }) &&
              res.data.payoutList.filter((val) => {
                return val.payWayCode === "10010";
              }).length > 0
            ) {
              this.payoutList.push(
                res.data.payoutList.filter((val) => {
                  return val.payWayCode === "10010";
                })[0]
              );
            }
            // 银行转账
            if (
              res.data.payoutList.filter((val) => {
                return val.payWayCode === "19000";
              }) &&
              res.data.payoutList.filter((val) => {
                return val.payWayCode === "19000";
              }).length > 0
            ) {
              this.payoutList.push(
                res.data.payoutList.filter((val) => {
                  return val.payWayCode === "19000";
                })[0]
              );
            }
            this.payFormType = this.payoutList[0].payWayCode;
            if (this.payFormType == "19000") {
              setTimeout(() => {
                this.$refs.BankTransferForm_ref.initAllData();
                this.payTypeList_status = true;
              });
            } else if (this.payFormType == "10010") {
              setTimeout(() => {
                this.$refs.CreditCardForm_ref.clearData();
                this.payTypeList_status = true;
              });
            }
            return;
          }

          this.payFormType = "19000";
          setTimeout(() => {
            this.$refs.BankTransferForm_ref.initAllData();
            this.payTypeList_status = true;
          });
        })
        .catch(() => {
          /* try {
            console.log(`%c${'todo delete'}`, 'font-size:30px;color:#aa5ff0');
            this.payoutList = [
              {
                channelCode: 'NIUM19000',
                feeRate: '0.01000000',
                fiat: 'USD',
                fixedFee: '1.000000',
                limitMax: '5000.000000',
                limitMin: '0.000000',
                payWayCode: '19000',
                payWayName: 'Bank Account'
              },
              {
                channelCode: 'NIUM19000',
                feeRate: '0.01000000',
                fiat: 'USD',
                fixedFee: '1.000000',
                limitMax: '5000.000000',
                limitMin: '0.000000',
                payWayCode: '10010',
                payWayName: 'Bank Account'
              }
            ];
          } catch (e) {
            console.log(`%c${'e'}`, 'font-size:30px;color:#aa5ff0');
            console.log(e);
          }*/

          this.payFormType = "19000";
          setTimeout(() => {
            this.$refs.BankTransferForm_ref.initAllData();
            this.payTypeList_status = true;
          });
        });
    },

    // 加载历史交易信息
    queryCardInfoList() {
      let _this = this;
      this.oldCardInfo = [];
      let params = {
        pageSize: "3", // 页码
        pageIndex: "1", // 页数
        alpha2: this.initData.fiatCurrencyInfo.alpha2, // 国家code
        fiat: this.initData.fiatCurrencyInfo.fiat, // 法币code
      };
      this.$axios.get(this.$api.get_sellCardList, params).then((res) => {
        if (res && res.data && res.data.result && res.data.result.length > 0) {
          if (res && res.data.result.length > 0) {
            // 处理空数据
            res.data.result.forEach((item, index) => {
              if (res.data.result[index] == null) {
                res.data.result[index] = "";
              }
              for (let itemKey in item.bankAccountInfo) {
                if (item.bankAccountInfo[itemKey] == null) {
                  item.bankAccountInfo[itemKey] = "";
                }
              }
            });
            _this.cardInfoList = res.data.result;
            _this.$store.state.sellForm = res.data.result[0];
            //默认展示最近一条数据
            let oldCardInfo = {};
            oldCardInfo = JSON.parse(JSON.stringify(res.data.result));
            _this.oldCardInfo = oldCardInfo;
          } else {
            _this.oldCardInfo = [];
          }
        }

        /*try {
            console.log(`%c${'todo delete'}`, 'font-size:30px;color:#aa5ff0');
            this.oldCardInfo = [
              {
                accountType: 1,
                bankAccountInfo: {
                  name: '12331'
                },
                accountNumber: '5450 8114 5987 9338'
              },
              { accountType: 2, lastName: 'asdf', firstName: '1231', accountNumber: '5450 8114 5987 9338' }
            ];
          } catch (e) {
            console.log(`%c${'e'}`, 'font-size:30px;color:#aa5ff0');
          }*/

        this.cardInfoList_status = true;
      });
      /* .catch(e => {
          console.log(`%c${'e'}`, 'font-size:30px;color:#aa5ff0');
          console.log(e);
        });*/
    },

    // 卡类型logo
    cardType(val) {
      if (val.accountType == "2") {
        var validObject = valid.number(AES_Decrypt(val.accountNumber));
      }
      if (
        val.accountType == "2" &&
        validObject.isValid &&
        ["mastercard"].includes(validObject.card.type)
      ) {
        return require("@/assets/images/paymentMethod/master-saved-icon.svg");
      }
      if (val.accountType == "2" && ["visa"].includes(validObject.card.type)) {
        return require("@/assets/images/paymentMethod/visa-saved-icon.svg");
      }
      return require("@/assets/images/paymentMethod/bank-logo.svg");
    },

    // 展示历史交易信息
    openCardInfo() {
      this.cardInfoList_actionSheet = true;
    },

    // 选择历史交易信息
    choiseCardInfo(item, index) {
      // Bank Account
      if (item.accountType == "1") {
        this.payFormType = "19000";
        let cardInfo = JSON.parse(JSON.stringify(item.bankAccountInfo));
        cardInfo.userAccountId = item.userAccountId;
        this.which = index;
        //赋值卡信息 关闭卡信息组件
        this.$store.state.sellForm = cardInfo;
        this.$nextTick(() => {
          this.$refs.BankTransferForm_ref.initializeForm();
          this.$refs.BankTransferForm_ref.decryptCardInfo(cardInfo);
        });
        this.isOldCardInfo = false;
        this.cardInfoList_actionSheet = false;
        return;
      }
      // Credit Card
      this.payFormType = "10010";
      this.$nextTick(() => {
        this.$refs.CreditCardForm_ref.clearData();
        this.$refs.CreditCardForm_ref.params = {
          firstname: item.firstName ? AES_Decrypt(item.firstName) : "",
          lastname: item.lastName ? AES_Decrypt(item.lastName) : "",
          birthDate: item.birthDate
            ? moment(AES_Decrypt(item.birthDate), "YYYYMMDD").format(
                "YYYY-MM-DD"
              )
            : "",
          phone: item.phone ? AES_Decrypt(item.phone) : "",
          email: localStorage.getItem("email")
            ? localStorage.getItem("email")
            : "",
          cardNumber: item.accountNumber
            ? AES_Decrypt(item.accountNumber)
                .replace(/\s/g, "")
                .replace(/....(?!$)/g, "$& ")
            : "",
          userAccountId: item.userAccountId ? item.userAccountId : "",
        };
      });
      this.isOldCardInfo = false;
      this.cardInfoList_actionSheet = false;
      this.which = index;
    },

    set_isOldCardInfo(val) {
      this.isOldCardInfo = val;
    },
    // 处理选择历史表单和赋值最近一次卡信息
    assignmentOldCardInfo() {
      // Bank Account
      if (this.oldCardInfo[0].accountType == "1") {
        this.payFormType = "19000";
        this.$nextTick(() => {
          this.$refs.BankTransferForm_ref.initializeForm();
        });
        if (this.isOldCardInfo === false) {
          this.$nextTick(() => {
            this.$refs.BankTransferForm_ref.userAccountId = "";
          });
        } else {
          this.which = 0;
          this.$nextTick(() => {
            this.oldCardInfo[0].bankAccountInfo.userAccountId =
              this.oldCardInfo[0].userAccountId;
            this.$refs.BankTransferForm_ref.decryptCardInfo(
              JSON.parse(JSON.stringify(this.oldCardInfo[0].bankAccountInfo))
            ); //选择历史卡信息
          });
        }
        return;
      }
      // Credit Card
      this.payFormType = "10010";
      if (this.isOldCardInfo === false) {
        this.$refs.CreditCardForm_ref.clearData();
      } else {
        this.which = 0;
        this.$nextTick(() => {
          this.$refs.CreditCardForm_ref.clearData();
          this.$refs.CreditCardForm_ref.params = {
            firstname: this.oldCardInfo[0].firstName
              ? AES_Decrypt(this.oldCardInfo[0].firstName)
              : "",
            lastname: this.oldCardInfo[0].lastName
              ? AES_Decrypt(this.oldCardInfo[0].lastName)
              : "",
            birthDate: this.oldCardInfo[0].birthDate
              ? moment(
                  AES_Decrypt(this.oldCardInfo[0].birthDate),
                  "YYYYMMDD"
                ).format("YYYY-MM-DD")
              : "",
            phone: this.oldCardInfo[0].phone
              ? AES_Decrypt(this.oldCardInfo[0].phone)
              : "",
            email: localStorage.getItem("email")
              ? localStorage.getItem("email")
              : "",
            cardNumber: this.oldCardInfo[0].accountNumber
              ? AES_Decrypt(this.oldCardInfo[0].accountNumber)
                  .replace(/\s/g, "")
                  .replace(/....(?!$)/g, "$& ")
              : "",
            userAccountId: this.oldCardInfo[0].userAccountId
              ? this.oldCardInfo[0].userAccountId
              : "",
          };
        });
      }
    },

    // 选择支付类型
    selectPayType(item) {
      console.log(item);
      if (this.payFormType === item.payWayCode) return;
      this.isOldCardInfo = false;
      this.payFormType = item.payWayCode;
      // 切换支付类型初始化数据
      this.$nextTick(() => {
        // 清空信用卡
        this.$refs.BankTransferForm_ref.currency =
          this.initData.fiatCurrencyInfo.fiat;
        this.$refs.BankTransferForm_ref.formJson = JSON.parse(
          JSON.stringify(
            allFormJson.filter((item) => {
              return item.currency.includes(
                this.$refs.BankTransferForm_ref.currency
              );
            })[0].form
          )
        );
        this.$refs.BankTransferForm_ref.userAccountId = "";
        // 清空bank accoount
        this.$refs.CreditCardForm_ref.clearData();
      });
    },

    // 邮件进入处理参数
    emailPathIn() {
      // email跳转接入- 存储邮件单页面跳传递的数据
      if (
        this.$route.query.emailFromPath !== undefined &&
        this.$route.query.emailFromPath
      ) {
        this.$store.state.emailFromPath = this.$route.query.emailFromPath;
        this.$store.state.cardInfoFromPath = this.$route.query.cardInfoFromPath;
        this.$store.commit("sellPayments/set_fiatCurrencyInfo", {
          fiat: this.$route.query.position_code,
          alpha2: this.$route.query.position_alpha2,
        });
        this.$store.commit(
          "sellPayments/set_orderNo",
          this.$route.query.orderId
        );
        this.$store.commit(
          "sellPayments/set_fiatCurrencyAmount",
          this.$route.query.getAmount
        );
        // this.$store.state.emailFromquery_refund_view.orderId = this.$route.query.orderId;
        // this.$store.state.emailFromquery_refund_view.position_alpha2 = this.$route.query.position_alpha2;
        // this.$store.state.emailFromquery_refund_view.position_code = this.$route.query.position_code;
        // this.$store.state.emailFromquery_refund_view.getAmount = this.$route.query.getAmount;
      }
      // email跳转接入 - 使用邮件单页面跳传递的数据
      if (this.$store.state.emailFromPath === "Refund") {
        this.$store.state.sellOrderId =
          this.$store.state.emailFromquery_refund_view.orderId;
        this.$store.commit("cryptoSellPage/set_fiatCurrencyInfo", {
          alpha2: this.$store.state.emailFromquery_refund_view.position_alpha2,
          fiatSymbol: this.initData.fiatCurrencyInfo.fiatSymbol,
          fiat: this.$store.state.emailFromquery_refund_view.position_code,
          flag: this.initData.fiatCurrencyInfo.flag,
        });
        this.$store.commit(
          "cryptoSellPage/set_fiatCurrencyAmount",
          this.$store.state.emailFromquery_refund_view.getAmount
        );
      }
    },
    submitPay() {
      if (this.disabled) return;
      this.$nextTick(() => {
        if (this.payFormType === "19000") {
          this.$refs.BankTransferForm_ref.submit();
          return;
        }
        this.$refs.CreditCardForm_ref.submitPay();
      });
    },
    getDisabled(val) {
      this.disabled = val;
    },
    getRequest_loading(val) {
      this.request_loading = val;
    },
    getButtonIsShow(val) {
      this.buttonIsShow = val;
    },
  },
};
</script>

<style lang="scss" scoped>
#pay-box {
  width: 100%;
  height: 100%;
  flex: 1;

  .pay-tips {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.2rem;
    color: #5d636d;
    margin-bottom: 0.21rem;
  }

  ::v-deep .van-overlay {
    background: rgba(0, 0, 0, 0.6);
    position: absolute !important;
  }
  ::v-deep .van-popup {
    width: 100%;
    background: #ffffff;
    padding: 0.24rem 0.16rem 0.56rem;
    border-radius: 0.24rem 0.24rem 0 0;
    position: absolute !important;
    .van-action-sheet__header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.18rem;
      line-height: 0.21rem;
      text-align: center;
      color: #252830;
      margin-bottom: 0.24rem;
      .van-action-sheet__close {
        img {
          position: absolute;
          display: block;
          top: 0.25rem;
          right: 0.16rem;
          width: 0.2rem;
          cursor: pointer;
        }
      }
    }
    .van-action-sheet__content {
      max-height: 3.36rem;
      overflow: auto;
      #HistoricalCardInfo {
        .cardView {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 0.64rem;
          background: #ffffff;
          border: 1px solid #e6e8eb;
          border-radius: 0.06rem;
          padding: 0 0.12rem 0 0.16rem;
          cursor: pointer;
          &:not(:last-child) {
            margin-bottom: 0.12rem;
          }

          .line-left {
            display: flex;
            align-items: center;
            .icon {
              margin-right: 0.16rem;
              width: 0.4rem;
            }
            .name {
              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 400;
              font-size: 0.13rem;
              line-height: 0.16rem;
              color: #5d636d;
            }
          }
          .line-right {
            display: flex;
            align-items: center;
            font-family: "HarmonyOS Sans";
            font-style: normal;
            font-weight: 700;
            font-size: 0.16rem;
            line-height: 0.19rem;
            text-align: center;
            color: #252830;

            span {
              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 700;
              font-size: 0.12rem;
              line-height: 0.14rem;
              text-align: center;
              color: #252830;
              margin-right: 0.04rem;
            }
          }
          &:hover {
            border-color: #cbcfd6;
          }
          &.cardView-true {
            border: 2px solid #0059da;
          }
        }
      }
    }
  }
}
</style>
