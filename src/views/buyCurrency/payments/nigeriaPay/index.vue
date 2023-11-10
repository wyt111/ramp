<template>
  <div
    class="ArgentinaPay-container"
    :class="[{ 'custom-scrollbar': !waitState }]"
    id="confirmPayment"
    ref="box_ref"
    @scroll="handleScroll"
  >
    <!-- 等待组件-->
    <div class="buyPayWaitPage" v-if="waitState">
      <NGN ref="ngnPayRef" />
    </div>

    <!-- 支付信息 -->
    <div class="ArgentinaPay-content" ref="padding_bottom_box" v-else>
      <div style="display: flex; justify-content: center">
        <transition>
          <div class="downTips-icon" v-show="goDown_state" @click="goDown">
            <img src="@/assets/images/downIcon.svg" ref="downTips_ref" alt="" />
          </div>
        </transition>
      </div>
      <!-- 新增支付方式信息模块 -->
      <PayMethodInfo class="PayMethodInfo" />
      <trader-information
        name="name"
        idNumber="idNumber"
        phone="phone"
        v-if="!formShowStatus.basicItem"
      />
      <div class="nigeria_pay_form">
        <!-- full name-->
        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <NoPlaceholderText
            :class="{ 'error-input': formError.fullname }"
            v-model="formData.nigeriaName"
            :maxlength="32"
            :title="$t('configPay_brl.fullName')"
            @input="changeFormValid('fullName')"
            @focus="focusClearError('fullName')"
            @blur="blurFormValidation('fullName')"
          ></NoPlaceholderText>
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
            type="nigeria"
            v-model="formData.nigeriaPhone"
            @input="changeFormValid('phone')"
            @focus="focusClearError('phone')"
            @blur="blurFormValidation('phone')"
            areaCode="234"
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
        <!-- ID type -->
        <div class="id_type_show form-item" v-if="formShowStatus.basicItem">
          <div class="id_type_title">{{ $t("ngnPayment.iDType") }}</div>
          <div class="id_type">{{ formData.idType }}</div>
        </div>
        <!-- id Number -->
        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <TextInput
            :class="{ 'error-input': formError.idNumber }"
            type1="nigeria"
            type="digit"
            v-model="formData.idNumber"
            @input="changeFormValid('idNumber')"
            @focus="focusClearError('idNumber')"
            @blur="blurFormValidation('idNumber')"
            :maxlength="12"
            :placeholder="$t('ngnPayment.idNumberPlaceholder')"
            :title="$t('ngnPayment.idNumberTitle')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.idNumber">
              {{ $t("configPay_brl.id_tips") }}
            </p>
          </el-collapse-transition>
        </div>
        <!--  date of birth --- dob -->
        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <TextInput
            :class="{ 'error-input': formError.dob }"
            type1="nigeria"
            v-model="formData.dob"
            @input="changeFormValid('dob')"
            @focus="focusClearError('dob')"
            @blur="blurFormValidation('dob')"
            maxlength="10"
            placeholder="23/05/1980"
            :title="$t('ngnPayment.dobTitle')"
          />
          <el-collapse-transition>
            <p class="error-p" v-if="formError.dob">
              {{ $t("ngnPayment.dateTip") }}
            </p>
          </el-collapse-transition>
        </div>

        <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
          <NoPlaceholderText
            :class="{ 'error-input': formError.address }"
            v-model="formData.address"
            :maxlength="32"
            :title="$t('ngnPayment.addressTitle')"
            @input="changeFormValid('address')"
            @focus="focusClearError('address')"
            @blur="blurFormValidation('address')"
          ></NoPlaceholderText>
          <el-collapse-transition>
            <p class="error-p" v-if="formError.address">
              {{ $t("ngnPayment.addressTip") }}
            </p>
          </el-collapse-transition>
        </div>
      </div>

      <IncludedDetails
        style="margin-bottom: 0.08rem"
        :type="2"
        :payWayCode="payMethodInfo.payWayCode"
      />

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
import NGN from "./NGN.vue";
import NoPlaceholderText from "@/components/Input/noPlaceholderText.vue";
import TextInput from "@/components/Input/text";
import PhoneInput from "@/components/Input/phone";
import ConfirmPayMy from "@/components/Button/confirm-pay-my";
import IncludedDetails from "@/components/IncludedDetails/IncludedDetails";
import PayMethodInfo from "@/components/PayMethodInfo/index";

import { mapState } from "vuex";
import { isElementNotInViewport } from "@/utils";
import { AES_Decrypt } from "@/utils/encryp.js";
// import { checkKyc, checkKyc_onfido, getKycRule } from "@/utils/publicRequest";

export default {
  name: "nigeriaPay",
  components: {
    ConfirmPayMy,
    IncludedDetails,
    PayMethodInfo,
    NGN,
    TextInput,
    PhoneInput,
    NoPlaceholderText,
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
      //搜索组件的显示隐藏
      search_isShow: false,
      //下滑动显示
      goDown_state: false,
      //动画显示
      waitState: false,
      //按钮数据
      buttonData: {
        loading: false,
        confirmSuccess: false,
        countNum: 0,
      },
      TimeDown: null,
      userIp: "", // 马来西亚 需要传入的ip
      formData: {
        nigeriaName: "", //前端展示
        country: "NG", //前端展示
        address: "", //前端展示
        dob: "", // 证件日期前端展示
        idNumber: "", // idNumber 前端展示
        idType: "NIN", //前端展示
        nigeriaPhone: "", // 手机号
      },
      nigeriaDateStr: "",
      formError: {
        fullname: false,
        phone: false,
        idNumber: false,
        dob: false,
        address: false,
      },
      //倒计时
      scrollTimeDown: null,

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
        sessionStorage.removeItem("nigeriaPayState");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
        vm.$router.replace({ query: newQuery });
      }
      if (
        to.name === "nigeriaPay" &&
        from.name !== "tradeHistory" &&
        from.name !== null
      ) {
        sessionStorage.removeItem("nigeriaPayState");
        vm.$store.commit("set_ovo_va_mex_qrs_Status", false);
      }
    });
  },

  watch: {
    "lastTimePaymentFormInfo.status": {
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
    formData: {
      deep: true,
      immediate: true,
      handler() {
        this.set_disableStatus();
      },
    },
  },

  computed: {
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),
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

    // if (sessionStorage.getItem('showState')) {
    //   let showState = JSON.parse(sessionStorage.getItem('showState'));
    //   this.waitState = showState.waitState;
    //   //   this.$parent.confirmOrderStatus = true;
    //   //   this.paymentCountStatus();
    // }
  },

  destroyed() {
    clearInterval(this.TimeDown);
    window.removeEventListener("scroll", this.handleScroll, true);
    this.$parent.confirmOrderStatus = false;
    this.$store.commit("changeBuyPayProcessTab", true);
    this.$store.dispatch("request/clearAllQuery");
    // this.$store.commit('set_ovo_va_mex_qrs_Status', false);
  },

  methods: {
    set_disableStatus() {
      if (this.lastTimePaymentFormInfo.status) {
        this.disableStatus = false;
        return;
      }

      if (this.formError.dob || !this.isValidNigerianDate(this.formData.dob)) {
        this.disableStatus = true;
        return;
      }

      if (!/^\d{10,12}$/.test(this.formData.idNumber)) {
        this.disableStatus = true;
        return;
      }

      if (
        this.formData.nigeriaName &&
        this.formData.nigeriaPhone &&
        this.formData.idNumber &&
        this.formData.dob &&
        this.formData.address
      ) {
        this.disableStatus = false;
        return;
      }
      if (
        this.formError.fullname &&
        this.formError.phone &&
        this.formError.idNumber &&
        this.formError.dob &&
        this.formError.address
      ) {
        this.disableStatus = true;
        return;
      }

      this.disableStatus = true;
    },

    // 处理证件日期
    handleDob(dateStr) {
      // console.log('dob');
      const parts = dateStr.split("/"); // 将日期字符串按照 '/' 分割成数组
      const year = parseInt(parts[2]); // 取得年份部分并转换为数字
      const month = parseInt(parts[1]); // 取得月份部分并转换为数字
      const day = parseInt(parts[0]); // 取得日份部分并转换为数字
      const newDateStr = `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
      return newDateStr; // 拼接成新的日期字符串，注意月份和日份需要补零
    },

    // 将日期按照 "DD-MM-YYYY" 格式拼接起来
    formatNigeriaDate(date) {
      let newStr = date.replace(/\//g, "");
      if (date.length === 10) {
        let isEffectiveDate = this.isValidNigerianDate(date);
        // console.log('isEffectiveDate', isEffectiveDate);
        if (!isEffectiveDate) {
          this.formError.dob = true;
        }
      }
      // console.log('newStr==>', newStr);
      if (newStr.length === 1) {
        if (newStr > 3) {
          let dayStr = `0${date}/`;
          return dayStr;
        } else {
          return newStr;
        }
      }
      if (newStr.length === 2) {
        return `${newStr}/`;
      }
      if (newStr.length === 3) {
        if (newStr[2] > 2) {
          const day = date.slice(0, 2);
          // console.log('month', month);
          return `${day}/0${newStr[2]}`;
        } else {
          const day1 = date.slice(0, 2);
          return `${day1}/${newStr[2]}`;
        }
      }
      if (newStr.length === 4) {
        let day = newStr.substring(0, 2);
        let month = newStr.substring(2, 4);
        return `${day}/${month}/`;
      }
      if (newStr.length > 4) {
        let day = newStr.substring(0, 2);
        let month = newStr.substring(2, 4);
        let year = newStr.substring(4, newStr.length);
        return `${day}/${month}/${year}`;
      }
    },

    isValidNigerianDate(dateString) {
      let regex = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/([12]\d{3})$/;
      if (!regex.test(dateString)) {
        // 如果不符合日期格式，则直接返回 false
        return false;
      }
      const [_, day, month, year] = dateString.match(regex); // 解构赋值获取日、月、年
      console.log(_);
      // console.log(' dateString.match(regex)', dateString.match(regex));
      const date = new Date(`${year}-${month}-${day}`); // 构造日期对象
      const now = new Date(); // 获取当前日期
      return (
        date.getFullYear() <= now.getFullYear() &&
        date.getMonth() + 1 <= 12 &&
        date.getMonth() + 1 == month &&
        date.getDate() <= new Date(year, month, 0).getDate() &&
        date.getDate() > 0
      ); // 校验日期是否有效
    },
    handlePhone(nigeriaPhone) {
      if (nigeriaPhone && nigeriaPhone > 4 && nigeriaPhone.includes(" ")) {
        let arrPhone = nigeriaPhone.split(" ");
        // console.log(arrPhone);
        return `+234${arrPhone[0]}${arrPhone[1]}`;
      } else {
        return `+234${nigeriaPhone}`;
      }
    },

    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (!info.status || sessionStorage.getItem("nigeriaPayState")) return;
      this.formShowStatus.basicItem = false;
      this.formData.nigeriaName = info.name;
      this.formData.idNumber = info.idNumber;
      this.formData.nigeriaPhone = info.phone;
      this.formData.dob = info.dob;
      this.formData.address = info.address;
    },

    //下单接口
    async goPay() {
      if (this.disableStatus && !this.waitState) {
        this.form_errorTips = true;
        this.buttonData = {
          loading: false,
          confirmSuccess: false,
          countNum: 0,
        };
        return;
      }
      this.form_errorTips = false;
      if (
        this.buttonData.countNum === 1 &&
        this.waitState === false &&
        !sessionStorage.getItem("nigeriaPayState")
      ) {
        //验证是否通过kyc 二次支付不验证kyc
        // if (!this.$route.query.pathHistry) {
        //   let kycRule = await getKycRule(this.orderNo);
        //   let isKyc;
        //   if (kycRule === '1') {
        //     // onfido 验证方式
        //     isKyc = await checkKyc_onfido();
        //   } else if (kycRule === '2') {
        //     // sumsub 验证方式
        //     isKyc = await checkKyc();
        //   }
        //   if ([1, 3].includes(isKyc)) {
        //     this.buttonData.countNum = 0;
        //     return;
        //   }
        // }

        let email = AES_Decrypt(localStorage.getItem("login_email"));
        let params = {
          payWayCode: this.payMethodInfo.payWayCode,
          orderNo: this.orderNo,
          customParam: {
            name: this.formData.nigeriaName, //前端展示
            country: "NG", //前端展示
            address: this.formData.address, //前端展示
            dob: this.lastTimePaymentFormInfo.status
              ? this.formData.dob
              : this.handleDob(this.formData.dob), //前端展示
            // email: 'someemail@gmail.com', //前端展示
            email: email, //前端展示
            idNumber: this.formData.idNumber, //前端展示
            idType: "nin", //前端展示
            phone: this.lastTimePaymentFormInfo.status
              ? this.formData.nigeriaPhone
              : this.handlePhone(this.formData.nigeriaPhone), // 用户输入
          },
        };
        // console.log('params', JSON.stringify(params));
        //因为只有一个支付所以不封装接口
        this.$axios
          .post(this.$api.post_alchemyPayPay, params)
          .then((res) => {
            // console.log('res', JSON.stringify(res));
            if (res && res.data && res.returnCode === "0000") {
              this.checkoutSuccess(res.data);
            }
          })
          .catch((err) => {
            this.$store.commit("set_ovo_va_mex_qrs_Status", false);
            console.log("err", err);
            this.buttonData = {
              loading: false,
              confirmSuccess: false,
              countNum: 0,
            };
          });
      }
    },

    // 下单成功后改变页面
    checkoutSuccess(data) {
      this.$store.commit("set_ovo_va_mex_qrs_Status", true);
      // 存储数据
      this.$store.commit("buyPayments/set_nigeriaOrderData", data);
      // 隐藏买币步骤图片
      this.$store.commit("changeBuyPayProcessTab", false);
      this.$store.state.toastStatus = true;
      //改变导航文案
      // console.log('this.$parent343', this.$parent);
      this.$parent.$refs.viewTab.routerName = "navTabTitle.Completepayment";
      // 按钮文案
      this.buttonName = "nav.queryOderState";
      // 展示代付款页面
      this.waitState = true;
      // let showState = {
      //   waitState: this.waitState
      // };
      // sessionStorage.setItem('showState', JSON.stringify(showState));
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

    // 输入时 处理 清除错误样式
    changeFormValid(type) {
      // console.log('type', type);
      if (type === "fullName") {
        this.formData.nigeriaName = this.formData.nigeriaName?.replace(
          /[^a-zA-Z ]/g,
          ""
        );
        this.formError.fullname = false;
      } else if (type === "phone") {
        this.formError.phone = false;
      } else if (type === "idNumber") {
        this.formError.idNumber = false;
      } else if (type === "address") {
        this.formData.address = this.formData.address?.replace(
          /[^a-zA-Z ]/g,
          ""
        );
        // console.log('this.formData.address', this.formData.address);
        this.formError.address = false;
      } else if (type === "dob") {
        // this.formData.dob = this.formData.dob.replace(/\D/g, '');
        // console.log('date', this.formData.dob);
        this.formError.dob = false;
        this.formData.dob = this.formatNigeriaDate(this.formData.dob);
      }
    },

    // 聚焦时 处理
    focusClearError(type) {
      if (type === "fullName") {
        this.formError.fullname = false;
      } else if (type === "phone") {
        this.formError.phone = false;
      } else if (type === "idNumber") {
        this.formError.idNumber = false;
      } else if (type === "address") {
        this.formError.address = false;
      } else if (type === "dob") {
        this.formError.dob = false;
      }
    },

    // 失去焦点时校验
    blurFormValidation(type) {
      // console.log('type', type);
      if (type === "dob" && this.formData.dob) {
        let isEffectiveDate = this.isValidNigerianDate(this.formData.dob);
        if (!isEffectiveDate) {
          this.formError.dob = true;
        } else {
          this.formError.dob = false;
        }
      } else if (type === "idNumber") {
        let reg = /^\d{10,12}$/;
        if (reg.test(this.formData.idNumber)) {
          // 匹配通过
          this.formError.idNumber = false;
        } else {
          this.formError.idNumber = true;
        }
      }

      // if (type === 'fullName') {
      //   if (!this.formData.nigeriaName) {
      //     this.formError.fullname = true;
      //   } else {
      //     this.formError.fullname = false;
      //   }
      // } else if (type === 'phone') {
      //   if (!this.formData.nigeriaPhone) {
      //     this.formError.phone = true;
      //   } else {
      //     this.formError.phone = false;
      //   }
      // } else if (type === 'idNumber') {
      //   if (!this.formData.idNumber) {
      //     this.formError.idNumber = true;
      //   } else {
      //     this.formError.idNumber = false;
      //   }
      // } else if (type === 'address') {
      //   if (!this.formData.address) {
      //     this.formError.address = true;
      //   } else {
      //     this.formError.address = false;
      //   }
      // } else if (type === 'dob') {
      //   let isEffectiveDate = this.isValidNigerianDate(this.formData.dob);
      //   if (!isEffectiveDate) {
      //     this.formError.dob = true;
      //   } else {
      //     this.formError.dob = false;
      //   }
      // }
    },

    //按钮进入可视区域，隐藏滚动到底部按钮
    handleScroll() {
      if (!this.waitState && this.search_isShow === false) {
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
  .id-type {
    font-family: Medium;
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.19rem;
    color: #252830;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border: 1px solid #ebebeb;
    border-radius: 0.16rem;
    padding: 0.12rem 0.16rem;
    box-sizing: border-box;
    .type-title {
      margin-bottom: 0.09rem;
      font-family: Regular;
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #6e7687;
    }
  }
}
.text-inputBox,
.phone-inputBox {
  p {
    margin-top: 0.02rem;
    color: #ff2f2f;
    font-size: 0.12rem;
    padding: 0 0 0 0.04rem;
    font-family: Regular;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }
}

.nigeria_pay_form {
  .id_type_show {
    background: #ffffff;
    border: 1px solid #ebebeb;
    border-radius: 0.16rem;
    padding: 0.12rem 0.16rem;
    box-sizing: border-box;
    margin-top: 0.12rem;
    .id_type_title {
      font-family: "San Francisco Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.12rem;
      line-height: 0.14rem;
      color: #6e7687;
      margin-bottom: 0.08rem;
    }
    .id_type {
      font-family: "San Francisco Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.2rem;
      color: #252830;
    }
  }
}
.ArgentinaPay-container {
  flex: 1;
  .ArgentinaPay-content {
    height: 100%;
    .nigeria_pay_form {
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
      .id_type_show {
        width: 100%;
        border: 1px solid #dbdee3;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
        border-radius: 0.06rem;
        height: 0.48rem;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 0.12rem;
        .id_type_title {
          position: absolute;
          left: 0.07rem;
          top: -0.09rem;
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.13rem;
          line-height: 0.18rem;
          color: #5d636d;
          z-index: 1;
          padding: 0 0.04rem;
          background: #fff;
        }
        .id_type {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 500;
          font-size: 0.16rem;
          line-height: 0.24rem;
          color: #252830;
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
  }
}
</style>
