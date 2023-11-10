<template>
  <div
    class="ArgentinaPay-container"
    :class="[{ 'custom-scrollbar': !waitState }]"
    id="confirmPayment"
    ref="box_ref"
    @scroll="handleScroll"
  >
    <!--    等待组件-->
    <div class="buyPayWaitPage" v-if="waitState" key="1">
      <BuyPayWaitPage :url="payUrl" />
    </div>
    <!--    表单-->
    <div
      class="ArgentinaPay-content"
      ref="padding_bottom_box"
      v-else
      @click="harderSelectclone"
      key="2"
    >
      <!-- 新增支付方式信息模块 -->
      <PayMethodInfo class="PayMethodInfo" />
      <trader-information
        name="name"
        idNumber="identify.number"
        phone="phone"
        v-if="!formShowStatus.basicItem"
      />
      <div class="ArgentinaPay-from">
        <!-- full name-->
        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <TextInput
            :class="{ 'error-input': formError.fullname }"
            type="MultilingualInput"
            v-model="formData.khipuName"
            @input="inputChange('name', 'input')"
            @blur="inputChange('name', 'blur')"
            :disabled="inputDisable"
            maxlength="50"
            :placeholder="$t('formInfo.fullName_placeholder')"
            :title="$t('configPay_brl.fullName')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.fullname">
              {{ $t("configPay_brl.name_tips") }}
            </p>
          </el-collapse-transition>
        </div>

        <!-- 填写手机 -->
        <div class="phone-inputBox form-item" v-if="formShowStatus.basicItem">
          <PhoneInput
            :class="{ 'error-input': formError.phone }"
            v-model="formData.khipuPhone"
            :disabled="inputDisable"
            @input="inputChange('phone', 'input')"
            @blur="inputChange('phone', 'blur')"
            areaCode="54"
            :title="$t('formInfo.phone_title')"
            placeholder="2324 7525821"
            maxlength="12"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.phone">
              {{ $t("ArgentinaPay.phoneTips") }}
            </p>
          </el-collapse-transition>
        </div>

        <!-- 选择id类型 -->
        <div class="select-inputBox form-item" v-if="formShowStatus.basicItem">
          <SelectInput
            v-model="formData.khipuType"
            :selectList="khiTypeList"
            :disable="inputDisable"
            @selectItem="selectPixType"
            ref="SelectInput_ref1"
          />
        </div>

        <!-- id -->
        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <TextInput
            :class="{ 'error-input': formError.id }"
            type="number"
            v-model="formData.khipuNumber"
            @input="inputChange('id', 'input')"
            @blur="inputChange('id', 'blur')"
            :disabled="inputDisable"
            :maxlength="khiTypeDetails"
            :placeholder="idPlaceholder"
            :title="$t('formInfo.id_title')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.id">
              {{ $t("configPay_brl.id_tips") }}
            </p>
          </el-collapse-transition>
        </div>

        <!-- 选择Bank Account类型 -->
        <div class="select-inputBox form-item" v-if="formShowStatus.otherItem">
          <SelectInput
            v-model="backTypeText"
            :selectList="bankType"
            :placeholder="$t('formInfo.bankAccount_placeholder')"
            :disable="inputDisable"
            @selectItem="selectBankType"
            ref="SelectInput_ref2"
          />
        </div>

        <!-- Account Number -->
        <div class="text-inputBox form-item" v-if="formShowStatus.otherItem">
          <TextInput
            :class="{ 'error-input': formError.khipuAccountNumber }"
            type="number"
            v-model="formData.khipuAccountNumber"
            @input="inputChange('bank', 'input')"
            @blur="inputChange('bank', 'blur')"
            :disabled="backTypeText === '' || inputDisable"
            maxlength="22"
            :placeholder="$t('formInfo.accountNumber_placeholder')"
            :title="$t('ArgentinaPay.AccountNumber')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.khipuAccountNumber">
              {{ $t("ArgentinaPay.cardnumber") }}
            </p>
          </el-collapse-transition>
        </div>

        <!-- 银行code-->
        <div class="text-inputBox form-item" v-if="formShowStatus.otherItem">
          <TextInput
            :class="{ 'error-input': formError.khipuBank }"
            type="number"
            v-model="formData.khipuBank"
            @input="inputChange('bankcode', 'input')"
            @blur="inputChange('bankcode', 'blur')"
            :disabled="inputDisable"
            maxlength="3"
            :placeholder="$t('formInfo.bankCode_placeholder')"
            :title="$t('ArgentinaPay.Bankcode')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.khipuBank">
              {{ $t("ArgentinaPay.correctcode") }}
            </p>
          </el-collapse-transition>
        </div>
      </div>
      <IncludedDetails
        style="margin-bottom: 0.08rem"
        :type="2"
        :payWayCode="payMethodInfo.payWayCode"
      />
      <div style="display: flex; justify-content: center">
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
      <footer class="footer" ref="footer_ref">
        <div class="errorTips" v-if="form_errorTips">
          Please fill in all fields with valid information.
        </div>
        <ConfirmPayMy
          class="button_ref"
          :buttonData="buttonData"
          @click.native="goPay"
        ></ConfirmPayMy>
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
import ConfirmPayMy from "../../../../components/Button/confirm-pay-my";
import BuyPayWaitPage from "@/components/PaymentWaitingPage/buyPayWaitPage";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import PayMethodInfo from "../../../../components/PayMethodInfo/index";
import { mapState } from "vuex";
import { isElementNotInViewport } from "@/utils";
import PhoneInput from "@/components/Input/phone";
import TextInput from "@/components/Input/text";
import SelectInput from "@/components/Input/select";
import { AES_Decrypt } from "@/utils/encryp";

export default {
  name: "ArgentinaPay",
  components: {
    ConfirmPayMy,
    BuyPayWaitPage,
    IncludedDetails,
    PayMethodInfo,
    PhoneInput,
    TextInput,
    SelectInput,
  },
  data() {
    return {
      formShowStatus: {
        // 基本项表单信息
        basicItem: true,
        // 其他项表单信息
        otherItem: true,
      },
      //银行卡类型动画以及类型展示
      backTypeText: "",
      //下滑动显示
      goDown_state: false,
      //动画显示
      waitState: false,
      //输入框禁用
      inputDisable: false,
      //公司地址展示状态
      companyAddress: true,
      //按钮数据
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      //表单数据
      formData: {
        orderNo: "",
        khipuType: "DNI",
        khipuNumber: "",
        khipuPhone: "",
        khipuName: "",
        khipuAccountNumber: "",
        khipuAccountType: "C",
        khipuBank: "",
      },
      //选择类型数据
      khiTypeList: [
        { id: 1, name: "DNI", idLength: "8" },
        { id: 2, name: "CUIT", idLength: "11" },
        { id: 3, name: "CUIL", idLength: "11" },
        { id: 4, name: "CD", idLength: "11" },
      ],
      //数据类型长度
      khiTypeDetails: "8",
      TimeDown: null,
      //失败展示
      formError: {
        fullname: false,
        phone: false,
        id: false,
        khipuAccountNumber: false,
        khipuBank: false,
      },
      //选择卡类型
      bankType: [
        { id: 1, name: "ArgentinaPay.chequing", type: "C" },
        { id: 2, name: "ArgentinaPay.Saving", type: "S" },
      ],
      //倒计时
      scrollTimeDown: null,
      // 支付链接
      payUrl: "",
      // 表单错误信息
      form_errorTips: false,
      disableStatus: true,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      //清空二次支付状态
      if (to.query.isTwice === "1") {
        let newQuery = { pathHistry: "tradeHistory" };
        sessionStorage.removeItem("ArgentinaPay");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      if (
        to.name === "ArgentinaPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("ArgentinaPay");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },
  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),

    //id输入框placeholder
    idPlaceholder() {
      return `${this.$t("formInfo.id_placeholder1")} ${
        this.khiTypeDetails
      } ${this.$t("formInfo.id_placeholder2")}`;
    },
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
    khiTypeDetails: {
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
    waitState: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
  },
  mounted() {
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
    if (sessionStorage.getItem("ArgentinaPay")) {
      let ArgentinaPay = JSON.parse(sessionStorage.getItem("ArgentinaPay"));
      this.waitState = ArgentinaPay.waitState;
      this.payUrl = ArgentinaPay.payUrl;
      this.$parent.confirmOrderStatus = true;
      this.paymentCountStatus();
    }
  },
  destroyed() {
    clearInterval(this.TimeDown);
    window.removeEventListener("scroll", this.handleScroll, true);
    this.$parent.confirmOrderStatus = false;
    this.$store.commit("changeBuyPayProcessTab", true);
    this.inputDisable = false;
    this.$store.dispatch("request/clearAllQuery");
  },
  methods: {
    set_disableStatus() {
      try {
        let patrn = /(.)\1\1/;
        //两个连续空格
        let blankStrPatrn = /(\s)\1/;
        let reg = new RegExp(`^[A-Za-z ]{4,255}$`);
        if (
          this.formData.khipuName.length < 2 ||
          patrn.exec(this.formData.khipuName) ||
          blankStrPatrn.exec(this.formData.khipuName) ||
          (this.formData.khipuName.length === 2 &&
            this.formData.khipuName.match(new RegExp(/(\w)\1+/g))) ||
          !reg.test(this.formData.khipuName)
        ) {
          this.disableStatus = true;
          return;
        }
        let reg1 = /^[0-9]*$/;
        if (
          !reg1.test(this.formData.khipuPhone) ||
          this.formData.khipuPhone.length !== Number(12)
        ) {
          this.disableStatus = true;
          return;
        }

        if (
          !/^[0-9]*$/.test(this.formData.khipuNumber) ||
          this.formData.khipuNumber.length !== Number(this.khiTypeDetails)
        ) {
          this.disableStatus = true;
          return;
        }

        if (
          !/^[0-9]*$/.test(this.formData.khipuAccountNumber) ||
          this.formData.khipuAccountNumber.length !== 22
        ) {
          this.disableStatus = true;
          return;
        }

        if (
          !/^[0-9]*$/.test(this.formData.khipuBank) ||
          this.formData.khipuBank.length !== 3
        ) {
          this.disableStatus = true;
          return;
        }
      } catch (e) {
        console.log(e);
      }

      let formData = this.formData;
      if (
        (formData.khipuName &&
          formData.khipuPhone &&
          formData.khipuNumber &&
          formData.khipuType &&
          formData.khipuAccountNumber &&
          formData.khipuBank &&
          !this.formError.id &&
          !this.formError.fullname &&
          !this.formError.phone &&
          !this.formError.khipuAccountNumber &&
          !this.formError.khipuBank) ||
        this.waitState
      ) {
        this.disableStatus = false;
        return;
      }
      this.disableStatus = true;
    },

    inputChange(formtype, eventType) {
      if (formtype === "name") {
        //三个连续相同字符
        let patrn = /(.)\1\1/;
        //两个连续空格
        let blankStrPatrn = /(\s)\1/;
        let reg = new RegExp(`^[A-Za-z ]{4,255}$`);
        if (
          this.formData.khipuName.length < 2 ||
          patrn.exec(this.formData.khipuName) ||
          blankStrPatrn.exec(this.formData.khipuName) ||
          (this.formData.khipuName.length === 2 &&
            this.formData.khipuName.match(new RegExp(/(\w)\1+/g))) ||
          !reg.test(this.formData.khipuName)
        ) {
          if (eventType == "blur") {
            this.formError.fullname = true;
          }
        } else {
          this.formError.fullname = false;
        }

        if (this.formData.khipuName.length == 0) {
          this.formError.fullname = false;
        }
      } else if (formtype === "phone") {
        let reg = /^[0-9]*$/;
        if (
          !reg.test(this.formData.khipuPhone) ||
          this.formData.khipuPhone.length !== Number(12)
        ) {
          if (eventType == "blur") {
            this.formError.phone = true;
          }
        } else {
          this.formError.phone = false;
        }

        if (this.formData.khipuPhone.length == 0) {
          this.formError.phone = false;
        }
      } else if (formtype === "id") {
        let reg = /^[0-9]*$/;
        if (
          reg.test(this.formData.khipuNumber) &&
          this.formData.khipuNumber.length === Number(this.khiTypeDetails)
        ) {
          this.formError.id = false;
        } else {
          if (eventType === "blur") {
            this.formError.id = true;
          }
        }
        if (this.formData.khipuNumber.length == 0) {
          this.formError.id = false;
        }
      } else if (formtype === "bankcode") {
        let reg = /^[0-9]*$/;

        if (
          reg.test(this.formData.khipuBank) &&
          this.formData.khipuBank.length === 3
        ) {
          this.formError.khipuBank = false;
        } else {
          if (eventType == "blur") {
            this.formError.khipuBank = true;
          }
        }

        if (this.formData.khipuBank.length === 0) {
          this.formError.khipuBank = false;
        }
      } else if (formtype === "bank") {
        let reg = /^[0-9]*$/;
        this.formData.khipuBank =
          this.formData.khipuAccountNumber.length === 22
            ? Number(this.formData.khipuAccountNumber.substring(0, 3))
            : "";
        if (
          reg.test(this.formData.khipuAccountNumber) &&
          this.formData.khipuAccountNumber.length === 22
        ) {
          this.formError.khipuAccountNumber = false;
        } else {
          if (eventType === "blur") {
            this.formError.khipuAccountNumber = true;
          }
        }
        if (this.formData.khipuAccountNumber.length === 0) {
          this.formError.khipuAccountNumber = false;
        }
      }
    },
    //清除显示
    harderSelectclone() {
      setTimeout(() => {
        if (this.$refs.SelectInput_ref1 && this.$refs.SelectInput_ref2) {
          this.$refs.SelectInput_ref1.listStatus = false;
          this.$refs.SelectInput_ref2.listStatus = false;
        }
      });
    },
    //修改银行卡类型
    selectBankType(val) {
      this.formData.khipuAccountType = val.type;
      this.backTypeText = val.name;
    },
    //只能输入英文
    formatter(value) {
      return value.replace(/[^a-zA-Z ]/g, "");
    },
    //选择类型
    selectPixType(item) {
      this.formData.khipuType = item.name;
      this.khiTypeDetails = item.idLength;
      this.inputChange("id", "blur");
    },
    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (!info.status || sessionStorage.getItem("ArgentinaPay")) return;
      this.formShowStatus.basicItem = false;
      this.formData.khipuName = info.name;
      this.formData.khipuPhone = info.phone;
      this.formData.khipuType = info.identify.type;
      this.formData.khipuNumber = info.identify.number;
    },
    //下单接口
    goPay() {
      if (this.disableStatus) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;
      if (this.buttonData.countNum === 1 && this.waitState === false) {
        //隐藏公司地址
        this.companyAddress = false;
        //输入框禁用
        this.inputDisable = true;
        let windowOpen = window.open();
        let params = {
          payWayCode: this.payMethodInfo.payWayCode,
          orderNo: this.orderNo,
          customParam: {
            email: AES_Decrypt(localStorage.getItem("email")),
            phone: "54" + this.formData.khipuPhone,
            name: this.formData.khipuName,
            accountNumber: this.formData.khipuAccountNumber, // 银行卡号
            accountType: this.formData.khipuAccountType, // C=chequing,S=Saving 可选C or S
            bankCode: this.formData.khipuBank, // 银行code
            identify: {
              number: this.formData.khipuNumber, // 身份号码
              type: this.formData.khipuType, // 身份类型 可选 CUIT/CUIL/CDI
            },
          },
        };
        this.$axios
          .post(this.$api.post_alchemyPayPay, params, "")
          .then((res) => {
            if (res && res.data) {
              windowOpen.location = res.data.webUrl;
              this.payUrl = res.data.webUrl;
              //展示等待页面
              this.waitState = true;
              this.$store.commit("set_ovo_va_mex_qrs_Status", true);
              let data = {
                waitState: this.waitState,
                payUrl: this.payUrl,
              };
              sessionStorage.setItem("ArgentinaPay", JSON.stringify(data));
              this.paymentCountStatus();
            }
          })
          .catch((err) => {
            //失败跳转页面
            if (err && ["91003", "60007"].includes(err.returnCode)) {
              this.$parent.$parent.tipsState = false;
              this.$router.replace(
                `/paymentResult?customParam=${this.orderNo}&errTip=true`
              );
            }
            this.inputDisable = false;
            this.buttonData = {
              loading: false,
              confirmSuccess: false,
              countNum: 0,
            };
            windowOpen.close();
          });
      }
    },
    //页面15分钟倒计时
    paymentCountStatus() {
      //因为正常写不触发 所以放到最后执行
      setTimeout(() => {
        this.$parent.confirmOrderStatus = true;
        this.$store.commit("changeBuyPayProcessTab", false);
      });
      clearInterval(this.TimeDown);
      this.TimeDown = setInterval(() => {
        this.requestStatus();
      }, 1000);
    },
    //刷新订单状态
    requestStatus() {
      let params = {
        orderNo: this.orderNo,
      };
      this.$axios.get(this.$api.get_payResult, params).then((res) => {
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
  },
};
</script>

<style lang="scss" scoped>
.buyPayWaitPage,
.heightAuto {
  height: 100%;
}
.downTips-icon {
  //display: flex;
  //justify-content: center;
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
  z-index: 2000;
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
::v-deep .number_input:nth-of-type(5) .van-field__control {
  letter-spacing: 1px;
}
::v-deep .number_input .van-field__control {
  color: #6e7687 !important;
}

//修改样式
.text-inputBox,
.select-inputBox,
.phone-inputBox {
  margin-top: 0.12rem;
}

.ArgentinaPay-container {
  padding: 0 !important;
  flex: 1;
  .buyPayWaitPage {
    padding: 0 0.16rem;
  }
  .ArgentinaPay-content {
    padding: 0 0.16rem 0;
    height: 100%;
    .PayMethodInfo {
    }
    .ArgentinaPay-from {
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
      padding: 0.08rem 0rem 0rem;
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

<script setup></script>
