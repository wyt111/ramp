<template>
  <div id="box">
    <div id="sell-form" ref="padding_bottom_box">
      <div class="sellForm-content" ref="form_ref">
        <div
          class="formLine"
          v-for="(item, index) in formJson"
          :key="index"
          :class="{
            formContentError:
              item.tipsState ||
              (item.multinomialTipsState &&
                currency !== 'JPY' &&
                currency !== 'NPR' &&
                currency !== 'BRL'),
            mb21: item.itemType === 'form-tips',
            mb0:
              item.alternativeItem && item.alternativeVal !== alternativeRadio,
          }"
          :data-width="item.width"
        >
          <!-- 提示信息 - JPY NPR BRL -->
          <template v-if="item.itemType === 'form-tips'">
            <div class="form-tips">{{ $t(item.name) }}</div>
          </template>

          <template v-else>
            <div
              class="formTitle"
              v-if="
                (item.name && !item.alternativeItem) ||
                (item.alternativeItem &&
                  item.alternativeVal === alternativeRadio)
              "
            >
              {{ $t(item.name) }}
            </div>

            <!-- bank account type -->
            <div
              class="formContent cursor"
              v-if="
                item.type === 'radio' && item.paramsName === 'bankAccountType'
              "
              @click.stop="openSelect(item, index)"
            >
              <div
                class="radioInput"
                :class="{ 'radios-true': selected.index === index }"
              >
                <div class="value">{{ $t(item.model) }}</div>
                <div class="rightIcon">
                  <img
                    :class="
                      selected.index === index
                        ? 'transfromOrigin1'
                        : 'transfromOrigin'
                    "
                    src="@/assets/images/imageTop.png"
                    alt=""
                  />
                </div>
              </div>
              <div
                class="selectView"
                v-if="selectState && selected.paramsName === 'bankAccountType'"
                @click="closeRadio"
              >
                <ul class="selectDate">
                  <li
                    :class="{ selectItem: selectDateTtem.value === item.model }"
                    v-for="(selectDateTtem, selectDateIndex) in selected.item"
                    :key="'selectDate' + selectDateIndex"
                    @click.stop="specialChiseCheck(selectDateTtem)"
                  >
                    {{ $t(selectDateTtem.value) }}
                  </li>
                </ul>
              </div>
            </div>

            <div
              class="formContent cursor"
              v-else-if="item.type === 'radio'"
              @click.stop="openSelect(item, index)"
            >
              <div
                class="radioInput"
                :class="{ 'radios-true': selected.index === index }"
              >
                <div class="value">{{ item.model }}</div>
                <div class="rightIcon">
                  <img
                    :class="
                      selected.index === index
                        ? 'transfromOrigin1'
                        : 'transfromOrigin'
                    "
                    src="@/assets/images/imageTop.png"
                    alt=""
                  />
                </div>
              </div>
              <div
                class="selectView"
                v-if="selectState && selected.paramsName !== 'bankAccountType'"
                @click="closeRadio"
              >
                <ul class="selectDate">
                  <li
                    :class="{ selectItem: item.model === $t(selectDateTtem) }"
                    v-for="(selectDateTtem, selectDateIndex) in selected.item"
                    :key="'selectDate' + selectDateIndex"
                    @click.stop="chiseCheck(selectDateTtem)"
                  >
                    {{ $t(selectDateTtem) }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="formContent" v-else>
              <template v-if="item.itemType === 'alternative'">
                <div class="alternative-radio-box">
                  <el-radio
                    v-model="alternativeRadio"
                    :label="index_1"
                    v-for="(item_1, index_1) in item.list"
                    :key="index_1"
                    >{{ $t(item_1.name) }}</el-radio
                  >
                </div>
              </template>
              <template v-else>
                <input
                  type="text"
                  v-model="item.model"
                  :maxlength="item.maxLength"
                  @input="inputChange(item, index)"
                  @focus="inputFocus"
                  @blur="inputBlur"
                  :placeholder="$t(item.placeholder)"
                  v-if="
                    !item.alternativeItem ||
                    (item.alternativeItem &&
                      item.alternativeVal === alternativeRadio)
                  "
                />
              </template>
            </div>

            <template v-if="item.alternativeItem">
              <el-collapse-transition>
                <p
                  class="errorMessage"
                  v-if="
                    item.tipsState && item.alternativeVal === alternativeRadio
                  "
                >
                  {{ $t(item.tips) }}
                </p>
                <p
                  class="errorMessage"
                  v-else-if="
                    item.alternativeVal === alternativeRadio &&
                    item.multinomialTipsState &&
                    currency !== 'JPY' &&
                    currency !== 'NPR' &&
                    currency !== 'BRL'
                  "
                >
                  {{ $t(item.multinomialTips) }}
                </p>
              </el-collapse-transition>
            </template>
            <template v-else>
              <el-collapse-transition>
                <p class="errorMessage" v-if="item.tipsState">
                  {{ $t(item.tips) }}
                </p>
                <p
                  class="errorMessage"
                  v-else-if="
                    item.multinomialTipsState &&
                    currency !== 'JPY' &&
                    currency !== 'NPR' &&
                    currency !== 'BRL'
                  "
                >
                  {{ $t(item.multinomialTips) }}
                </p>
              </el-collapse-transition>
            </template>
          </template>
        </div>
      </div>
      <!-- 购买提示信息 -->
      <div class="attention">
        {{ $t("sellFormPageTitle.Attention") }}:
        {{ $t("sellFormPageTitle.ReturnediInformation") }}
      </div>
      <!--      <footer class="footer" ref="footer_ref">-->
      <!--        <button-->
      <!--          class="continue"-->
      <!--          :disabled="disabled"-->
      <!--          @click="submit"-->
      <!--          v-show="buttonIsShow"-->
      <!--          ref="button_ref"-->
      <!--        >-->
      <!--          {{ $t("nav.Confirm") }}-->
      <!--          <img-->
      <!--            class="rightIcon"-->
      <!--            src="@/assets/images/button-right-icon.svg"-->
      <!--            v-if="!request_loading"-->
      <!--          />-->
      <!--          <button-loading v-else class="icon rightIcon" />-->
      <!--        </button>-->
      <!--        <powered-by-->
      <!--            @setPaddingBottom="-->
      <!--            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`"-->
      <!--        />-->
      <!--      </footer>-->
    </div>
  </div>
</template>
<script>
/**
 * 邮件进入地址栏结构 - /sell-formUserInfo?orderId=订单id&position_alpha2=国家alpha2&position_code=国家code&getAmount=法币金额&emailFromPath=sell-formUserInfo&cardInfoFromPath=sellOrder
 */
import { mapState } from "vuex";
import allFormJson from "@/assets/json/currencyPurchaseFormRules.json";
import { AES_Decrypt, AES_Encrypt } from "@/utils/encryp";
import { getKycRule } from "@/utils/publicRequest";
import { formatNumberWithSeparator } from "@/utils";

export default {
  name: "sellCardInfo",
  data() {
    return {
      formJson: [],
      formJsonCopy: [],
      currency: "",
      userAccountId: "",
      buttonIsShow: true,
      selectState: false,
      selected: {
        item: {},
        index: 0,
      },
      request_loading: false,
      alternativeRadio: 0,
    };
  },
  computed: {
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),
    ...mapState("sellCryptoMerchantAELF", {
      source: (state) => state.merchantInfo.source,
      merchantFullPathAELF: (state) => state.merchantFullPath,
      appId: (state) => state.merchantInfo.appId,
      merchantInfo_AELF: (state) => state.merchantInfo,
    }),
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
  },
  activated() {},
  watch: {
    buttonIsShow: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit("getButtonIsShow", val);
      },
    },
    formJson: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit("getDisabled", this.disabled());
      },
    },
    request_loading: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit("getDisabled", this.disabled());
        this.$emit("getRequest_loading", val);
      },
    },
    selectState(flag) {
      if (flag) {
        document.addEventListener("click", this.hideRadioSelectDialog);
      } else {
        document.removeEventListener("click", this.hideRadioSelectDialog);
      }
    },
  },
  methods: {
    hideRadioSelectDialog() {
      this.closeRadio();
    },

    // 初始化
    initAllData() {
      //初始化表单
      this.initializeForm();
    },

    // 正则校验 展示提示信息
    inputChange(val, index) {
      //name字段格式化
      if (val.paramsName === "name") {
        this.formJson[index].model = val.model.replace(/[^a-zA-Z ]/g, "");
      }

      //BDT - Swift code不是以DBBLBDDH开头的时候branch name必输
      if (
        this.currency === "BDT" &&
        val.paramsName === "routingCodeValue1" &&
        val.model.substr(0, 8) !== "DBBLBDDH"
      ) {
        this.formJson.filter((item) => {
          return item.paramsName === "routingCodeValue2";
        })[0].required = true;
      } else if (
        this.currency === "BDT" &&
        val.paramsName === "routingCodeValue1" &&
        val.model.substr(0, 8) === "DBBLBDDH"
      ) {
        this.formJson.filter((item) => {
          return item.paramsName === "routingCodeValue2";
        })[0].required = false;
      }
      //所有表单正则验证
      if (!new RegExp(val.regular).test(this.formJson[index].model)) {
        this.formJson[index].tipsState = true;
      } else {
        this.formJson[index].tipsState = false;
      }

      //name字段验证
      if (val.paramsName === "name") {
        //三个连续相同字符
        let patrn = /(.)\1\1/;
        //两个连续空格
        let blankStrPatrn = /(\s)\1/;
        if (
          !new RegExp(val.regular).test(this.formJson[index].model) ||
          blankStrPatrn.exec(this.formJson[index].model) ||
          patrn.exec(this.formJson[index].model) ||
          (this.formJson[index].model.match(new RegExp(/(\w)\1+/g)) &&
            this.formJson[index].model.length === 2)
        ) {
          this.formJson[index].tipsState = true;
        } else {
          this.formJson[index].tipsState = false;
        }
      }
      if (
        val.paramsName === "contactNumber" &&
        val.regular_separator_position
      ) {
        this.formJson[index].model = formatNumberWithSeparator(
          this.formJson[index].model,
          val.regular_separator_position
        );
      }
    },

    //表单 - 单选框
    openSelect(item, index) {
      this.selected = {
        item: item.radioList,
        index: index,
        paramsName: item.paramsName,
      };
      this.selectState = true;
    },
    closeRadio() {
      this.selectState = false;
      this.selected.index = "";
    },
    chiseCheck(item) {
      this.selectState = false;
      this.formJson[this.selected.index].model = this.$t(item);
      this.formJson[this.selected.index].tipsState = false;
      this.closeRadio();
    },
    specialChiseCheck(item) {
      this.selectState = false;
      this.bankAccountType(item, 2);
      this.formJson[this.selected.index].tipsState = false;
      this.closeRadio();
    },
    bankAccountType(value, step) {
      if (step === 1) {
        this.formJson.forEach((item, index) => {
          if (item.paramsName === "bankAccountType") {
            switch (value.model) {
              case "3":
                this.formJson[index].model =
                  "sellForm.bankAccountTypeLi_Saving";
                break;
              case "4":
                this.formJson[index].model =
                  "sellForm.bankAccountTypeLi_Checking";
                break;
              case "5":
                this.formJson[index].model =
                  "sellForm.bankAccountTypeLi_TimeDeposit";
                break;
              case "6":
                this.formJson[index].model =
                  "sellForm.bankAccountTypeLi_Others";
                break;
              case "7":
                this.formJson[index].model = "sellForm.accountTypeLi_Maestra";
                break;
              case "8":
                this.formJson[index].model = "sellFormUserInfo.current";
                break;
            }
          }
        });
        return;
      }
      if (step === 2) {
        switch (value.key) {
          case "3":
            this.formJson[this.selected.index].model =
              "sellForm.bankAccountTypeLi_Saving";
            break;
          case "4":
            this.formJson[this.selected.index].model =
              "sellForm.bankAccountTypeLi_Checking";
            break;
          case "5":
            this.formJson[this.selected.index].model =
              "sellForm.bankAccountTypeLi_TimeDeposit";
            break;
          case "6":
            this.formJson[this.selected.index].model =
              "sellForm.bankAccountTypeLi_Others";
            break;
          case "7":
            this.formJson[this.selected.index].model =
              "sellForm.accountTypeLi_Maestra";
            break;
          case "8":
            this.formJson[this.selected.index].model =
              "sellFormUserInfo.current";
            break;
        }
        return;
      }
      if (step === 3) {
        this.formJsonCopy.forEach((item, index) => {
          if (item.paramsName === "bankAccountType") {
            switch (value.model) {
              case "sellForm.bankAccountTypeLi_Saving":
                this.formJsonCopy[index].model = "3";
                break;
              case "sellForm.bankAccountTypeLi_Checking":
                this.formJsonCopy[index].model = "4";
                break;
              case "sellForm.bankAccountTypeLi_TimeDeposit":
                this.formJsonCopy[index].model = "5";
                break;
              case "sellForm.bankAccountTypeLi_Others":
                this.formJsonCopy[index].model = "6";
                break;
              case "sellForm.accountTypeLi_Maestra":
                this.formJsonCopy[index].model = "7";
                break;
              case "sellFormUserInfo.current":
                this.formJsonCopy[index].model = "8";
                break;
            }
          }
        });
        return;
      }
    },

    //表单数据转换对象 处理表单加密数据 定义表单入参特殊字段
    paramsFormData() {
      let queryForm = {
        countryCode: this.initData.fiatCurrencyInfo.alpha2, // 国家Code
        fiatCode: this.initData.fiatCurrencyInfo.fiat, // 法币Code
      };
      this.formJsonCopy = JSON.parse(JSON.stringify(this.formJson));

      let bankAccountTypeDate = this.formJsonCopy.filter((res) => {
        return res.paramsName === "bankAccountType";
      })[0];
      this.bankAccountType(bankAccountTypeDate, 3);
      this.formJsonCopy.forEach((item) => {
        if (item.model !== "") {
          queryForm[item.paramsName] = item.model;
        }
      });
      let params = JSON.parse(JSON.stringify(queryForm));
      //加密字段
      let contactNumberObj = this.formJsonCopy.find(
        (item) => item.paramsName === "contactNumber"
      );
      if (contactNumberObj && contactNumberObj.regular_separator_position) {
        params.contactNumber = this.encrypt(
          params?.contactNumber?.replace(/-/g, "")
        );
      } else {
        params.contactNumber = this.encrypt(params.contactNumber);
      }

      params.name = this.encrypt(params.name);
      params.email = this.encrypt(params.email);
      params.accountNumber = this.encrypt(params.accountNumber);
      params.idNumber = this.encrypt(params.idNumber);
      this.currency === "BRL" ? (params.idType = "CPF") : "";
      this.currency === "CLP" ? (params.idType = "RUT") : "";
      return params;
    },
    //确认订单 - 处理请求参数
    submit() {
      let params = this.paramsFormData();
      // 修改订单卡信息
      if (this.$route.query.payWayCode || this.$route.query.emailFromPath) {
        this.userAccountId = this.$route.query.userAccountId || "";
        this.savePayInfo(params, "changeOrderInfo");
        return;
      }
      this.isKyc(params);
    },

    // 存储支付方式信息、支付信息
    storePayInfo(params) {
      // 支付信息
      let sellPayInfo = {
        bankAccountInfo: params, // Bank Account表单
        userAccountId: this.userAccountId, // 历史表单id
        // 信用卡表单
        firstName: "",
        lastName: "",
        accountNumber: "",
        phone: "",
        birthDate: "",
      };
      this.$store.commit("sellPayments/set_sellPayInfo", sellPayInfo);
      // 支付方式信息
      let sellPayType = {
        accountType: "1", // 1-Bank Account、2-Credit Card
        payWayCode: "19000", // 19000-Bank Account、10010-Credit Card
      };
      this.$store.commit("sellPayments/set_sellPayType", sellPayType);
    },

    // 保存卡信息
    savePayInfo(val, state) {
      if (this.request_loading) return;
      this.request_loading = true;
      // 表单name字段需要拼接firstName、lastName
      let params = {
        alpha2: this.initData.fiatCurrencyInfo.alpha2,
        userAccountId: this.userAccountId,
        fiat: this.initData.fiatCurrencyInfo.fiat,
        bankAccountInfo: val, // 银行转账信息
        accountType: "1",
        firstName: "",
        lastName: "",
        accountNumber: "",
      };
      this.$axios
        .post(this.$api.post_sellPayInfo, params, "")
        .then((res) => {
          if (res) {
            // 修改订单卡信息
            if (state && state === "changeOrderInfo") {
              this.changeOrderInfo(res.data.userAccountId);
              return;
            }
            // 创建订单
            this.processRequest(res.data.userAccountId);
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },
    // 创建订单 - 请求服务
    processRequest(userAccountId) {
      let params = {
        cryptoCurrency: this.initData.cryptoInfo.crypto,
        sellVolume: this.initData.cryptoAmount,
        network: this.initData.networkInfo.network,
        alpha2: this.initData.fiatCurrencyInfo.alpha2,
        fiat: this.initData.fiatCurrencyInfo.fiat,
        userAccountId: userAccountId, //this.$store.state.cardInfoFromPath === 'configSell' ? '' : this.$store.state.sellOrderId,
        payWayCode: "19000",
      };
      //存在商户信息将信息带入请求地址
      let urlQuery = "";
      if (
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantFullPath
      ) {
        urlQuery = `?${this.merchantInfo.merchantFullPath}`;
      }

      if (this.source === "3") {
        urlQuery = this.merchantFullPathAELF;
      }

      this.$axios
        .post(this.$api.post_sellCreatePayOrder + urlQuery, params, "")
        .then((res) => {
          if (res && res.data) {
            //存储数据 加密字段
            let sellForm = {};
            this.formJson.forEach((item) => {
              sellForm[item.paramsName] = item.model;
            });
            sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
            sellForm.name = this.encrypt(sellForm.name);
            sellForm.email = this.encrypt(sellForm.email);
            sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
            sellForm.idNumber = this.encrypt(sellForm.idNumber);
            this.$store.state.sellForm = sellForm;
            this.$store.state.sellOrderId = res.data.orderId;
            this.$store.state.nextOrderState = 1;
            //跳转状态
            this.request_loading = false;
            if (
              this.source === "3" &&
              this.appId.toLowerCase() !=
                process.env.VUE_APP_AELF_APPID.toLowerCase()
            ) {
              window.location = this.merchantInfo_AELF.withdrawUrl;
            } else {
              this.$router.push(`/sellOrder?sellOrderId=${res.data.orderId}`);
            }
            return;
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    // 修改订单卡信息
    changeOrderInfo(userAccountId) {
      let params = {
        orderId: this.$route.query.orderId,
        userAccountId: userAccountId,
      };
      this.$axios
        .post(this.$api.post_sellUpdateOrderFormInfo, params, "")
        .then((res) => {
          if (res) {
            let sellForm = {};
            this.formJson.forEach((item) => {
              sellForm[item.paramsName] = item.model;
            });
            sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
            sellForm.name = this.encrypt(sellForm.name);
            sellForm.email = this.encrypt(sellForm.email);
            sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
            sellForm.idNumber = this.encrypt(sellForm.idNumber);
            this.$store.state.sellForm = sellForm;
            this.$store.state.sellOrderId = res.data.orderId;
            this.$store.state.nextOrderState = 1;
            this.request_loading = false;
            this.$router.push(`/sellOrder?sellOrderId=${res.data.orderId}`);
          }
        })
        .catch(() => {
          this.request_loading = false;
        });
    },

    async isKyc(val) {
      // 存储支付信息
      this.storePayInfo(val);
      let kycRule = await getKycRule();

      if (kycRule === "1") {
        // onfido 验证方式
        this.isKyc_onfido(val);
      } else if (kycRule === "2") {
        // sumsub 验证方式
        this.isKyc_sumsub(val);
      }
    },
    isKyc_onfido(val) {
      let params = {
        payType: "10001",
        businessType: 2, // 卖币传2, 买币传1
      };
      this.$axios.post(this.$api.post_check, params, "").then((res) => {
        try {
          if (
            (res.data.kycFlag == 1 || res.data.kycFlag == 2) &&
            res.data.userLevel == 2
          ) {
            // 需要做kyc 并且需要做的kyc等级是 2;
            localStorage.setItem("getKycTokenByOnfidoWay", "true");
            localStorage.setItem("kyc_info_onfido", JSON.stringify(res.data));
            this.isKyc_sumsub(val, "kyc_onfido");
            return;
          } else {
            localStorage.removeItem("getKycTokenByOnfidoWay");
          }
        } catch (e) {
          console.log(e);
        }

        if ((res && res.data.kycFlag == 1) || res.data.kycFlag == 2) {
          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          this.formJson.forEach((item) => {
            sellForm[item.paramsName] = item.model;
          });
          sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
          sellForm.name = this.encrypt(sellForm.name);
          // sellForm.name = this.encrypt(sellForm.name);
          sellForm.email = this.encrypt(sellForm.email);
          sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
          sellForm.idNumber = this.encrypt(sellForm.idNumber);
          this.$store.state.sellForm = sellForm;
          this.$store.state.sellOrderId = res.data.orderId;
          this.request_loading = false;
          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          this.request_loading = false;
          if (res.data.kycFlag == 1) {
            this.$router.push("/kycVerify");
          } else if (res.data.kycFlag == 2) {
            this.$router.push("/kycStatus");
          }
        } else if (res.data.kycFlag == 0) {
          this.request_loading = false;
          this.savePayInfo(val);
          this.$store.state.sellRouterParams.historyBack = "back";
        }
      });
    },
    isKyc_sumsub(val, _type) {
      this.request_loading = true;

      if (_type == "kyc_onfido") {
        try {
          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          this.formJson.forEach((item) => {
            sellForm[item.paramsName] = item.model;
          });
          sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
          sellForm.name = this.encrypt(sellForm.name);
          // sellForm.name = this.encrypt(sellForm.name);
          sellForm.email = this.encrypt(sellForm.email);
          sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
          sellForm.idNumber = this.encrypt(sellForm.idNumber);
          this.$store.state.sellForm = sellForm;

          this.request_loading = false;
          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          this.request_loading = false;

          this.$router.push("/kycVerification");
        } catch (e) {
          console.log(e);
        }

        return;
      }

      let params = {
        amount:
          this.initData.cryptoAmount *
          this.initData.cryptoInfo.cryptoToFiatPrice,
      };
      var FormData = require("form-data");
      var data = new FormData();
      data.append("amount", params.amount);

      this.$axios.post(this.$api.post_getKycStatus, data, "").then((res) => {
        if (res && res.data) {
          this.$store.commit("userInfo/set_kycInfo_levelIndex", "1");
          this.$store.commit("userInfo/set_kycInfo_kycTips", 1);

          this.$store.state.sellRouterParams.confirmParams = val;
          //存储数据 加密字段
          let sellForm = {};
          this.formJson.forEach((item) => {
            sellForm[item.paramsName] = item.model;
          });
          sellForm.contactNumber = this.encrypt(sellForm.contactNumber);
          sellForm.name = this.encrypt(sellForm.name);
          // sellForm.name = this.encrypt(sellForm.name);
          sellForm.email = this.encrypt(sellForm.email);
          sellForm.accountNumbe = this.encrypt(sellForm.accountNumber);
          sellForm.idNumber = this.encrypt(sellForm.idNumber);
          this.$store.state.sellForm = sellForm;
          this.$store.state.sellOrderId = res.data.orderId;
          this.request_loading = false;
          this.$store.commit("buyPayments/set_fullName", AES_Encrypt(val.name));
          this.$store.state.sellRouterParams.historyBack = "back";
          this.request_loading = false;

          this.$router.push("/kycVerification");
        } else {
          this.request_loading = false;
          this.savePayInfo(val);
          this.$store.state.sellRouterParams.historyBack = "back";
        }
      });
    },

    inputFocus(event) {
      try {
        event.target.parentElement.parentElement
          .querySelector(".formTitle")
          .classList.add("focus");
      } catch (e) {
        console.log(e);
      }

      if (this.$store.state.isPcAndPhone === "phone") {
        this.buttonIsShow = false;
        this.buttonIsShow = true;
      } else {
        this.buttonIsShow = true;
      }
    },

    inputBlur(event) {
      try {
        event.target.parentElement.parentElement
          .querySelector(".formTitle")
          .classList.remove("focus");
      } catch (e) {
        console.log(e);
      }

      this.buttonIsShow = true;
    },

    //点击tab栏返回首页修改卖币信息再次进入赋值表单信息
    initializeForm() {
      //根据货币类型来过滤不同表单

      this.currency = this.initData.fiatCurrencyInfo.fiat;

      this.formJson = JSON.parse(
        JSON.stringify(
          allFormJson.filter((item) => {
            return item.currency.includes(this.currency);
          })[0].form
        )
      );

      //PHP - 金额大于500000地址必输
      if (
        this.currency === "PHP" &&
        this.initData.fiatCurrencyAmount > 500000
      ) {
        this.formJson.filter((item) => {
          return item.paramsName === "address";
        })[0].required = true;
      } else if (
        this.currency === "PHP" &&
        this.initData.fiatCurrencyAmount <= 500000
      ) {
        this.formJson.filter((item) => {
          return item.paramsName === "address";
        })[0].required = false;
      }

      this.setDefaultBankAccountType();
    },
    setDefaultBankAccountType() {
      // 遍历 this.formJson;
      // 获取到 selected,
      // 调用 specialChiseCheck;
      this.formJson.some((item, index) => {
        if (item.type === "radio" && item.paramsName === "bankAccountType") {
          this.selected = {
            item: item.radioList,
            index: index,
            paramsName: item.paramsName,
          };
          this.selected.item.some((item1) => {
            if (item1.key === "4") {
              this.specialChiseCheck(item1);
              return true;
            }
          });
          return true;
        }
      });
    },

    //解密历史表单信息
    decryptCardInfo(val) {
      this.userAccountId = val.userAccountId;
      let sellForm = [];
      sellForm = val;
      this.formJson.forEach((item, index) => {
        for (let itemKey in sellForm) {
          if (item.paramsName === itemKey) {
            if (
              itemKey === "contactNumber" ||
              itemKey === "name" ||
              itemKey === "email" ||
              itemKey === "accountNumber" ||
              itemKey === "idNumber"
            ) {
              this.formJson[index].model = AES_Decrypt(sellForm[itemKey]);
            } else {
              this.formJson[index].model = sellForm[itemKey];
            }
          }
        }
      });
      let bankAccountTypeDate = this.formJson.filter((res) => {
        return res.paramsName === "bankAccountType";
      })[0];
      this.bankAccountType(bankAccountTypeDate, 1);
    },

    encrypt(val) {
      if (val) {
        return AES_Encrypt(val);
      }
    },

    //动态表单判空、正则校验
    disabled() {
      //表单非必填项数量
      let noRequiredNum = this.formJson.filter((value) => {
        return value.required === false;
      }).length;
      //必填项数据
      let requiredArray = this.formJson.filter((value) => {
        return (
          value.required === true &&
          (value.model === "" ||
            !new RegExp(value.regular).test(value.model) ||
            value.tipsState === true ||
            value.multinomialTipsState === true)
        );
      });
      //非必填项数据
      let noRequiredArray = this.formJson.filter((value) => {
        return (
          value.required === false &&
          (value.model === "" ||
            !new RegExp(value.regular).test(value.model) ||
            value.tipsState === true ||
            value.multinomialTipsState === true)
        );
      });

      //JPY - bank code和swift code不能同时为空、非必填项校验
      //NPR - swift和location不能同时为空、非必填项校验
      //BRL - bank code和swift code不能同时为空、非必填项校验
      if (
        this.formJson.length !== 0 &&
        (this.currency === "JPY" ||
          this.currency === "NPR" ||
          this.currency === "BRL")
      ) {
        if (
          requiredArray.length === 0 &&
          noRequiredArray.length === 1 &&
          noRequiredArray[0].model === ""
        ) {
          this.formJson.filter((item) => {
            return item.paramsName === noRequiredArray[0].paramsName;
          })[0].tipsState = false;
          return this.request_loading === false ? false : true;
        }
        if (
          requiredArray.length !== 0 ||
          noRequiredArray.length === 2 ||
          (noRequiredArray.length === 1 &&
            noRequiredArray[0].tipsState === true)
        ) {
          return true;
        }
        return this.request_loading === false ? false : true;
      }

      //针对PHP
      if (
        requiredArray.length === 0 &&
        noRequiredArray.length > 0 &&
        noRequiredArray[0].model !== "" &&
        noRequiredArray.length === 1 &&
        noRequiredNum === 1
      ) {
        return true;
      }

      requiredArray.length === 0
        ? this.formJson.forEach((item, index) => {
            this.formJson[index].tipsState = false;
          })
        : "";
      return requiredArray.length === 0 && this.request_loading === false
        ? false
        : true;
    },
  },
};
</script>

<style lang="scss" src="../css/index.scss" scoped></style>
