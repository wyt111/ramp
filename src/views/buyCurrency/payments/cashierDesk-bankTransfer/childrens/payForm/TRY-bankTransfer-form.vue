<template>
  <div id="TRY-bankTransfer-form" @click="harderSelectclone">
    <trader-information
      name="firstName"
      idNumber="authCardNo"
      v-if="!formShowStatus.basicItem"
    />
    <!-- nationality -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.nationality }"
        type="text"
        v-model="formData.nationality"
        @input="FormValidation('nationality', 'input')"
        @blur="FormValidation('nationality', 'blur')"
        :disabled="true"
        :maxlength="50"
        :title="$t('TRY_form.nationality_title')"
      />
    </div>
    <!-- 选择id类型 -->
    <div class="select-inputBox form-item" v-if="formShowStatus.basicItem">
      <SelectInput
        v-model="formData.authType_name"
        :selectList="idTypeList"
        :disable="inputDisable.authType_inputDisable"
        @selectItem="selectIdType"
        ref="SelectInput_ref1"
        :placeholder="$t('formInfo.select_id_placeholder')"
      />
    </div>
    <!-- id number -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.authCardNo }"
        :type="this.formItemLength.authCardNo_type"
        type1="nigeria"
        v-model="formData.authCardNo"
        @input="FormValidation('authCardNo', 'input')"
        @blur="FormValidation('authCardNo', 'blur')"
        @focus="FormValidClone('authCardNo')"
        :disabled="inputDisable.authCardNo_inputDisable"
        :maxlength="formItemLength.authCardNo"
        :title="$t('TRY_form.authCardNo_title')"
      />
      <el-collapse-transition>
        <p class="error-p" v-if="formError.authCardNo">
          {{ $t("TRY_form.authCardNo_tips") }}
        </p>
      </el-collapse-transition>
    </div>
    <!-- first name -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.firstName }"
        type="latinName"
        type1="nigeria"
        v-model="formData.firstName"
        @input="FormValidation('firstName', 'input')"
        @blur="FormValidation('firstName', 'blur')"
        @focus="FormValidClone('firstName')"
        :disabled="inputDisable.firstName_inputDisable"
        :maxlength="formItemLength.firstName"
        :title="$t('TRY_form.firstName_title')"
      />
      <el-collapse-transition>
        <p class="error-p" v-if="formError.firstName">
          {{ $t("TRY_form.firstName_Tips") }}
        </p>
      </el-collapse-transition>
    </div>
    <!-- last name -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.lastName }"
        type="latinName"
        type1="nigeria"
        v-model="formData.lastName"
        @input="FormValidation('lastName', 'input')"
        @blur="FormValidation('lastName', 'blur')"
        @focus="FormValidClone('lastName')"
        :disabled="inputDisable.lastName_inputDisable"
        :maxlength="formItemLength.lastName"
        :title="$t('TRY_form.lastName_title')"
      />
      <el-collapse-transition>
        <p class="error-p" v-if="formError.lastName">
          {{ $t("TRY_form.lastName_tips") }}
        </p>
      </el-collapse-transition>
    </div>
    <!-- address -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.address }"
        type="latinAddress"
        type1="nigeria"
        v-model="formData.address"
        @input="FormValidation('address', 'input')"
        @blur="FormValidation('address', 'blur')"
        @focus="FormValidClone('address')"
        :disabled="inputDisable.address_inputDisable"
        :maxlength="formItemLength.address"
        :placeholder="address_Placeholder"
        :title="$t('TRY_form.address_title')"
      />
      <el-collapse-transition>
        <p class="error-p" v-if="formError.address">
          {{ $t("TRY_form.address_tips") }}
        </p>
      </el-collapse-transition>
    </div>
    <!-- birthday -->
    <div class="text-inputBox form-item" v-if="formShowStatus.basicItem">
      <TextInput
        :class="{ 'error-input': formError.birthday }"
        type1="nigeria"
        v-model="formData.birthday"
        @input="FormValidation('birthday', 'input')"
        @blur="FormValidation('birthday', 'blur')"
        @focus="FormValidClone('birthday')"
        :disabled="inputDisable.birthday_inputDisable"
        :maxlength="formItemLength.birthday"
        placeholder="01/01/1995"
        :title="$t('TRY_form.birthday_title')"
      />
      <el-collapse-transition>
        <p class="error-p" v-if="formError.birthday">
          {{ $t("TRY_form.birthday_tips") }}
        </p>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import { AES_Decrypt } from "@/utils/encryp";
import TextInput from "@/components/Input/text";
import SelectInput from "@/components/Input/select";

export default {
  name: "TRY-bankTransfer-form",
  components: {
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
      formData: {
        nationality: "TR",
        authType_name: "TRY_form.ID_CARD",
        authType: "ID_CARD",
        authCardNo: "",
        firstName: "",
        lastName: "",
        address: "",
        birthday: "",
        email: AES_Decrypt(localStorage.getItem("email")),
        userId: localStorage.getItem("userId"),
      },
      // formData: {
      //   nationality: 'TR',
      //   authType_name: '',
      //   authType: '',
      //   authCardNo: '18065767426',
      //   firstName: 'Samet Eray',
      //   lastName: 'Gündoğan',
      //   address: 'AYAZAĞA MAH. 163. SK. E NO: 8 İÇ KAPI NO',
      //   birthday: '01/01/1993',
      //   email: AES_Decrypt(localStorage.getItem("email")),
      //   userId: 1056
      // },
      // 表单数据每项长度
      formItemLength: {
        authCardNo_regular: /^[0-9]*$/,
        authCardNo_type: "digit",
        authCardNo: 11,
        firstName: 50,
        lastName: 50,
        address: 50,
        birthday: 10,
      },
      // 失败展示
      formError: {
        authCardNo: false,
        firstName: false,
        lastName: false,
        address: false,
        birthday: false,
      },
      // 输入框禁用
      inputDisable: {
        authType_inputDisable: true,
        authCardNo_inputDisable: false,
        firstName_inputDisable: false,
        lastName_inputDisable: false,
        address_inputDisable: false,
        birthday_inputDisable: false,
      },
      // id类型列表
      idTypeList: [
        {
          id: 1,
          inputType: "digit",
          name: "TRY_form.ID_CARD",
          key: "ID_CARD",
          idLength: 11,
          regular: /^[0-9]*$/,
        }, // 身份证
        {
          id: 2,
          inputType: "",
          name: "TRY_form.DRIVER_LICENSE",
          key: "DRIVER_LICENSE",
          idLength: 12,
          regular: /^[0-9]*$/,
        }, // 驾驶证
        {
          id: 3,
          inputType: "walletAddress",
          name: "TRY_form.PASSPORT",
          key: "PASSPORT",
          idLength: 10,
          regular: /^[a-zA-Z0-9]*$/,
        }, // 护照
      ],
    };
  },
  computed: {
    address_Placeholder() {
      return `${this.$t("TRY_form.address_Placeholder")}`;
    },
    ...mapState("buyPayments", {
      orderNo: (state) => state.orderNo,
      payMethodInfo: (state) => state.payMethodInfo,
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),
    ...mapState("kycInfo", {
      kycCheck: (state) => state.kycCheck,
      kycResultInfo: (state) => state.kycResultInfo,
    }),
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
          this.backFillTraderInformation();
          let errorNum = this.formErrorCheck() || 0;
          let nullInfo =
            Object.values(newVal).filter((val) => val === "") || [];
          if (nullInfo.length > 0 || errorNum > 0) {
            this.$parent.payBtnEnabled = false;
            return;
          }
          this.$parent.payBtnEnabled = true;
        }
      },
    },
  },
  methods: {
    // 支付
    onPay() {
      this.$parent.buttonData = {
        loading: true,
        confirmSuccess: false,
        countNum: 1,
      };
      let params = {
        payWayCode: this.payMethodInfo.payWayCode,
        orderNo: this.orderNo,
        customParam: JSON.parse(JSON.stringify(this.formData)),
      };
      params.customParam.birthday = moment(
        params.customParam.birthday,
        "DD/MM/YYYY"
      ).format("YYYY-MM-DD");
      delete params.customParam.authType_name;
      this.$axios
        .post(this.$api.post_alchemyPayPay, params, "")
        .then((res) => {
          if (!res) return;
          // 支付结果信息
          res.data.bankList.note = res.data.note;
          this.$parent.payOrderInfo = res.data.bankList;
          // 父组件支付成功后状态
          this.$parent.IncludedDetails = false;
          this.$parent.buttonData = {
            loading: false,
            confirmSuccess: true,
            countNum: 2,
          };
          this.$parent.startPayment = true;
          //请求成功设置返回状态
          this.$store.commit("set_ovo_va_mex_qrs_Status", true);
          setTimeout(() => {
            this.$store.commit("changeBuyPayProcessTab", false);
            //改变导航文案
            this.$parent.$parent.$refs.viewTab.routerName =
              "navTabTitle.Completepayment";
          });
        })
        .catch(() => {
          this.$parent.buttonData = {
            loading: false,
            confirmSuccess: false,
            countNum: 0,
          };
          this.$store.commit("set_ovo_va_mex_qrs_Status", false);
        });
    },

    // 输入框输入时清空错误显示
    FormValidClone(type) {
      this.formError[type] = false;
    },
    // 表单验证
    FormValidation(val, type) {
      if (this.formData[val].length === 0) {
        this.formError[val] = false;
      }
      if (val === "authCardNo") {
        if (
          this.formData.authCardNo.length === 0 ||
          this.formData.authCardNo.length < this.formItemLength.authCardNo ||
          this.formData.authCardNo.length > this.formItemLength.authCardNo ||
          !new RegExp(this.formItemLength.authCardNo_regular).test(
            this.formData.authCardNo
          )
        ) {
          if (type === "blur") {
            this.formError[val] = true;
          }
        } else {
          this.formError[val] = false;
        }
        return;
      }
      if (val === "firstName") {
        let patrn = /(.)\1\1/;
        if (
          !this.formData.firstName.length ||
          this.formData.firstName.length < 2 ||
          patrn.exec(this.formData.firstName) ||
          (this.formData.firstName.length === 2 &&
            this.formData.firstName.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.formError[val] = true;
          }
        } else {
          this.formError[val] = false;
        }
        return;
      }
      if (val === "lastName") {
        let patrn = /(.)\1\1/;
        if (
          !this.formData.lastName.length ||
          this.formData.lastName.length < 2 ||
          patrn.exec(this.formData.lastName) ||
          (this.formData.lastName.length === 2 &&
            this.formData.lastName.match(new RegExp(/(\w)\1+/g)))
        ) {
          if (type === "blur") {
            this.formError[val] = true;
          }
        } else {
          this.formError[val] = false;
        }
        return;
      }
      if (val === "address") {
        if (!this.formData.address.length || this.formData.address.length < 2) {
          if (type === "blur") {
            this.formError[val] = true;
          }
        } else {
          this.formError[val] = false;
        }
        return;
      }
      if (val === "birthday" && this.formData.birthday) {
        if (type === "input") {
          this.formData.birthday = this.formatNigeriaDate(this.formData[val]);
        }
        let isEffectiveDate = this.isValidNigerianDate(this.formData[val]);
        if (!isEffectiveDate && type === "blur") {
          this.formError[val] = true;
        } else {
          this.formError[val] = false;
        }
      }
    },

    formErrorCheck() {
      let errorNum = 0;
      for (const [key, value] of Object.entries(this.formData)) {
        if (key === "authCardNo") {
          if (
            value.length === 0 ||
            value.length < this.formItemLength.authCardNo ||
            value.length > this.formItemLength.authCardNo ||
            !new RegExp(this.formItemLength.authCardNo_regular).test(value)
          ) {
            errorNum += 1;
          }
        }
        if (key === "firstName" || key === "lastName") {
          let patrn = /(.)\1\1/;
          if (
            !value.length ||
            value.length < 2 ||
            patrn.exec(value) ||
            (value.length === 2 && value.match(new RegExp(/(\w)\1+/g)))
          ) {
            errorNum += 1;
          }
        }
        if (key === "address") {
          if (!value.length || value.length < 2) {
            errorNum += 1;
          }
        }
        if (key === "birthday") {
          let isEffectiveDate = this.isValidNigerianDate(value);
          if (!isEffectiveDate) {
            errorNum += 1;
          }
        }
      }
      return errorNum;
    },

    // 将日期按照 "DD-MM-YYYY" 格式拼接起来
    formatNigeriaDate(date) {
      let newStr = date.replace(/\//g, "");
      if (date.length === 10) {
        let isEffectiveDate = this.isValidNigerianDate(date);
        if (!isEffectiveDate) {
          this.formError.birthday = true;
        }
      }
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

    // id类型选择
    selectIdType(item) {
      this.formData.authType_name = item.name;
      this.formData.authType = item.key;
      this.formItemLength.authCardNo = item.idLength;
      this.formItemLength.authCardNo_regular = item.regular;
      this.formItemLength.authCardNo_type = item.inputType;
      // id参数校验
      if (this.formData.authCardNo.length > 0) {
        this.FormValidation("authCardNo", "blur");
      }
      let errorNum = this.formErrorCheck() || 0;
      if (errorNum > 0) {
        this.$parent.payBtnEnabled = false;
      } else {
        this.$parent.payBtnEnabled = true;
      }
    },
    // 点击表单 隐藏 展开的选择框 清除显示
    harderSelectclone() {
      setTimeout(() => {
        if (this.$refs.SelectInput_ref1) {
          this.$refs.SelectInput_ref1.listStatus = false;
        }
      });
    },

    // kyc信息带入表单,表单修改为禁选状态
    insertFormInfo() {
      // kyc返回id类型与通道标识不符,需要手动匹配
      if (!this.kycCheck) return;
      if (this.kycResultInfo.firstName) {
        let patrn = /(.)\1\1/;
        if (
          this.kycResultInfo.firstName.length &&
          this.kycResultInfo.firstName.length > 2 &&
          !patrn.exec(this.kycResultInfo.firstName) &&
          !(
            this.kycResultInfo.firstName.length === 2 &&
            this.kycResultInfo.firstName.match(new RegExp(/(\w)\1+/g))
          )
        ) {
          this.formData.firstName = this.kycResultInfo.firstName;
          this.inputDisable.firstName_inputDisable = true;
        }
      }
      if (this.kycResultInfo.lastName) {
        let patrn = /(.)\1\1/;
        if (
          this.kycResultInfo.lastName.length &&
          this.kycResultInfo.lastName.length > 2 &&
          !patrn.exec(this.kycResultInfo.lastName) &&
          !(
            this.kycResultInfo.lastName.length === 2 &&
            this.kycResultInfo.lastName.match(new RegExp(/(\w)\1+/g))
          )
        ) {
          this.formData.lastName = this.kycResultInfo.lastName;
          this.inputDisable.lastName_inputDisable = true;
        }
      }
      if (this.kycResultInfo.dob) {
        this.formData.birthday = moment(
          this.kycResultInfo.dob,
          "YYYY-MM-DD"
        ).format("DD/MM/YYYY");
        this.inputDisable.birthday_inputDisable = true;
      }
      if (this.kycResultInfo.idDocType) {
        let authType, authType_name, authCardNo_length, authType_type;
        switch (this.kycResultInfo.idDocType) {
          case "1":
            authType = "ID_CARD";
            authType_name = "TRY_form.ID_CARD";
            authCardNo_length = 11;
            authType_type = "digit";
            break;
          case "2":
            authType = "PASSPORT";
            authType_name = "TRY_form.PASSPORT";
            authCardNo_length = 10;
            authType_type = "walletAddress";
            break;
          case "4":
            authType = "DRIVER_LICENSE";
            authType_name = "TRY_form.DRIVER_LICENSE";
            authCardNo_length = 12;
            authType_type = "";
            break;
        }
        this.formData.authType = authType;
        this.formData.authType_name = authType_name;
        this.formItemLength.authCardNo = authCardNo_length;
        this.formItemLength.authCardNo_type = authType_type;
        this.inputDisable.authType_inputDisable = true;
      }
      if (this.kycResultInfo.number) {
        if (
          !this.kycResultInfo.number !== 0 &&
          this.kycResultInfo.number.length === this.formItemLength.authCardNo &&
          new RegExp(this.formItemLength.authCardNo_regular).test(
            this.kycResultInfo.number
          )
        ) {
          this.formData.authCardNo = this.kycResultInfo.number;
          this.inputDisable.authCardNo_inputDisable = true;
        }
      }
    },
    // 处理支付成功后的表单信息(支付成功过需要带入上次填写的信息)
    backFillTraderInformation() {
      // 表单项状态、表单项信息
      const info = this.lastTimePaymentFormInfo;
      if (
        !info.status ||
        sessionStorage.getItem("cashierDesk_bankTransfer_payResult")
      )
        return;
      this.formShowStatus.basicItem = false;
      this.formData.firstName = info.firstName;
      this.formData.lastName = info.lastName;
      this.formData.authType_name = info.authType;
      this.formData.authType = info.authType;
      this.formData.authCardNo = info.authCardNo;
      this.formData.address = info.address;
      this.formData.birthday = info.birthday
        ? moment(info.birthday, "YYYY-MM-DD").format("DD/MM/YYYY")
        : "";
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
