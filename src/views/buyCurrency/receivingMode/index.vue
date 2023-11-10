<template>
  <div id="receiveCoins">
    <div class="receiveCoins-view">
      <div class="receiveCoins-content" ref="padding_bottom_box">
        <div class="methods_myAddress">
          <div class="methods_title">
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->
            <!--            <p>name</p>-->

            <div class="title-top">
              {{ $t("buyReceivingMethod.networkTitle1") }}
              {{ $t("buyReceivingMethod.networkTitle2") }}
            </div>
            <!-- 连接LEDGER获取钱包信息  -->
            <div class="LEDGER-btn" v-if="LEDGER_status">
              <button @click="requestAccount">
                {{ $t("buyReceivingMethod.ledgerBtn") }}
              </button>
            </div>
            <div class="icon">
              <div class="left" @click="openSelect">
                {{ networkInfo.networkName
                }}<img
                  src="@/assets/images/Frametransformation-icon.svg"
                  v-if="networkDefault"
                />
              </div>
              <div class="right">
                <span>
                  {{ $t("buyReceivingMethod.supported") }}
                </span>
                <el-popover
                  :close-delay="1"
                  :trigger="triggerType"
                  placement="top-end"
                  :offset="-10"
                  popper-class="el-popover-address"
                >
                  <p>{{ $t("buyReceivingMethod.Unstoppable") }}</p>
                  <div slot="reference">
                    <img
                      class="tipsIcon"
                      src="@/assets/images/adderssIcon.svg"
                    />
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
          <div class="methods_input">
            <input
              type="text"
              v-model="buyParams.address"
              :placeholder="`${$t('buyReceivingMethod.networkTitle1')} ${
                cryptoInfo.crypto
              } ${$t('buyReceivingMethod.networkTitle2')}`"
              @input="networkAddressChange"
              @blur.prevent="networkAddressBlur"
              @focus="networkAddressFocus"
              :disabled="addressDefault"
              :class="{
                error: walletAddress_state,
                'ens-input': EnsAddress && buyParams.address,
              }"
            />
            <div
              class="rightIcon"
              :class="{ noDrop: addressDefault }"
              @click="openScanCode"
            >
              <img src="@/assets/images/scanCode_icon.svg" />
            </div>

            <div class="history-address-list-box" v-show="EnsAddress_state">
              <div
                class="address-item ensAddress"
                :title="EnsAddress"
                v-show="EnsAddress && buyParams.address"
              >
                {{ EnsAddress }}
              </div>
              <div class="history-address-list" v-show="showRecentAddressList">
                <!-- todo 现实逻辑 -->
                <!-- ENS查询address -->
                <div
                  class="address-item"
                  :title="item"
                  v-for="(item, index) in recentAddressList"
                  :key="index"
                  @mousedown="setBuyParamsAddress(item)"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
          <el-collapse-transition>
            <div
              class="methods_errorText"
              v-if="walletAddress_state"
              v-text="walletAddress_tips"
            ></div>
          </el-collapse-transition>
        </div>
        <div class="methods_myAddress memo" v-if="networkNameState">
          <div class="methods_title">{{ $t("buyReceivingMethod.memo") }}</div>
          <div class="methods_input">
            <input
              type="text"
              v-model="buyParams.memo"
              :disabled="memoDefault"
              @input="networkMemoChange"
            />
          </div>
          <div class="methods_errorText" v-if="walletMemo_state">
            {{ $t("buyReceivingMethod.memoTips") }}
          </div>
        </div>
        <div class="tips">{{ $t("buyReceivingMethod.tips") }}</div>
      </div>
      <!-- 下一步 -->
      <div class="continueBox" ref="footer_ref">
        <button class="continue" @click="transaction" :disabled="disabled">
          {{ $t("button_components.proceed") }}
          <img
            class="rightIcon"
            src="../../../assets/images/button-right-icon.svg"
            alt=""
          />
        </button>
        <bottom-bar
          @setPaddingBottom="
            $refs.footer_ref.style.top = `calc(100% - ${$refs.footer_ref.clientHeight}px)`
          "
        />
      </div>

      <!-- 选择网络 -->
      <div
        class="networkView"
        v-if="searchViewState"
        @click="searchViewState = false"
      ></div>
      <div
        :class="
          !searchViewState
            ? 'sendCrypto_bottomContent'
            : 'sendCrypto_bottomContent sendCrypto_bottomContentActive'
        "
      >
        <!-- @click="networkSelect(item)" -->
        <div class="Network-title">
          <span>{{ $t("network_components.network") }}</span>
          <img
            src="@/assets/images/ShutDown1.svg"
            @click="searchViewState = false"
            alt=""
          />
        </div>
        <div class="Network-content">
          <div
            class="item"
            :class="{ ac: item.networkName === networkInfo.networkName }"
            v-for="(item, index) in networkList"
            :key="item.id"
            @click="selectNetwork(item)"
          >
            <img :src="item.networkIcon" alt="" />
            <span> {{ item.networkName }} </span>
          </div>
        </div>
      </div>

      <!-- 卖币 - 扫码识别网络 -->
      <ScanCode :queryName="scanCode_queryName" v-if="scanCode_state" />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import LedgerLiveApi, { WindowMessageTransport } from "@ledgerhq/live-app-sdk";
import { debounce } from "@/utils";
import common from "@/utils/common";
import { isAddress as isTRC20AddressValid } from "tronweb";

export default {
  name: "",
  components: {
    ScanCode: () => import("@/components/ScanCode/ScanCode"),
  },
  data() {
    return {
      triggerType: "hover",

      //页面所需参数
      buyParams: {
        address: "",
        memo: "",
      },

      //ENS查询地址
      EnsAddress: "",
      EnsAddress_state: false,
      searchEns_result: true,

      //网络列表
      networkList: [],
      //商户状态下 - 网络、地址、memo禁选状态
      networkDefault: true,
      addressDefault: false,
      memoDefault: false,

      //网络错误信息状态
      walletAddress_state: false,
      walletMemo_state: false,

      //网络组件信息
      searchViewState: false,

      //扫码后需要赋值的参数名
      scanCode_queryName: "",
      scanCode_state: false,
      recentAddressList: [],
      showRecentAddressList: false,

      // LEDGER钱包信息
      LEDGER_info: null,
      // buyParams.address 来源是否为 ledger;
      isAddressFromLedger: false,
    };
  },
  computed: {
    ...mapState("cryptoBuyPage", {
      checkMerchant: (state) => state.checkMerchant,
      cryptoInfo: (state) => state.cryptoInfo,
      networkInfo: (state) => state.networkInfo,
      fiatCurrencyInfo: (state) => state.fiatCurrencyInfo,
      fiatCurrencyAmount: (state) => state.fiatCurrencyAmount,
      cryptoAmount: (state) => state.cryptoAmount,
    }),
    // 商户信息
    ...mapState("buyCryptoMerchant", {
      merchantInfo: (state) => state.merchantInfo,
    }),

    //网络memo展示状态
    networkNameState() {
      if (
        this.networkInfo.memoRegex === undefined ||
        this.networkInfo.memoRegex === null ||
        !this.networkInfo.memoRegex ||
        this.networkInfo.memoRegex === ""
      ) {
        return false;
      }
      return true;
    },

    //下一步按钮状态
    disabled() {
      if (this.walletAddress_state) {
        return true;
      }
      if (this.networkNameState === true) {
        if (this.isMatchAddress) {
          if (
            this.networkInfo.network !== "" &&
            this.buyParams.address !== "" &&
            this.buyParams.memo !== "" &&
            this.isMatchMemo &&
            this.searchEns_result
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          if (
            this.networkInfo.network !== "" &&
            this.buyParams.address !== "" &&
            this.isMatchAddress &&
            this.buyParams.memo !== "" &&
            this.isMatchMemo
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        if (
          this.networkInfo.network !== "" &&
          this.buyParams.address !== "" &&
          this.isMatchAddress &&
          !this.searchEns_result
        ) {
          return false;
        }
        if (this.isMatchAddress) {
          //只有地址校验通过就直接为true
          if (
            this.networkInfo.network !== "" &&
            this.buyParams.address !== "" &&
            this.searchEns_result
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          if (
            this.networkInfo.network !== "" &&
            this.buyParams.address !== "" &&
            this.isMatchAddress
          ) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    isMatchAddress() {
      return new RegExp(this.networkInfo.addressRegex).test(
        this.buyParams.address
      );
    },
    isMatchMemo() {
      return new RegExp(this.networkInfo.memoRegex).test(this.buyParams.memo);
    },
    isInvalidTRC20Address() {
      const { network, networkName } = this.networkInfo;
      const buyParamsAddress = this.buyParams.address;
      const isTRC20NetWork =
        network === "TRX" || networkName === "Tron (TRC20)";
      return isTRC20NetWork && !isTRC20AddressValid(buyParamsAddress);
    },
    //钱包地址、ENS地址查询提示
    walletAddress_tips() {
      const buyParamsAddress = this.buyParams.address;
      //ENS地址校验
      if (
        this.isMatchAddress &&
        this.EnsAddress === "" &&
        !this.searchEns_result
      ) {
        return this.$t("buyReceivingMethod.ENSTips");
      }
      //address校验提示
      if (
        buyParamsAddress !== "" &&
        (!this.isMatchAddress || this.isInvalidTRC20Address)
      ) {
        return (
          this.$t("buyReceivingMethod.addressTips1") +
          " " +
          this.cryptoInfo.crypto +
          " " +
          this.$t("buyReceivingMethod.addressTips2")
        );
      }
    },

    // LEDGER按钮状态
    LEDGER_status() {
      if (
        this.merchantInfo.merchantStatus &&
        this.merchantInfo.merchantType === "page" &&
        this.merchantInfo.merchantQueryInfo.appId === "ahzxh0klegv1fzol"
      )
        return true;
      return false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (
        from.path === "/index" &&
        (to.path === "/receivingMode" || to.path === "/verifyCode")
      ) {
        vm.buyParams = {
          address: "",
          memo: "",
        };
        vm.walletAddress_state = false;
        vm.walletMemo_state = false;
      }
    });
  },
  activated() {
    //参数为空跳转到首页
    if (
      this.fiatCurrencyInfo.fiat === "" ||
      this.fiatCurrencyInfo.fiat === undefined ||
      this.fiatCurrencyInfo.fiat === null ||
      this.cryptoInfo.crypto === "" ||
      this.cryptoInfo.crypto === undefined ||
      this.cryptoInfo.crypto === null
    ) {
      this.$router.replace("/");
      return;
    }

    // 初始化LEDGER
    this.init_LEDGER();

    this.verifyMerchantInfo();

    if (!(this.buyParams.address && this.isAddressFromLedger)) {
      this.isAddressFromLedger = false;
      this.addressDefault = false;
    } else {
      this.addressDefault = true;
    }

    if (this.buyParams.address) {
      this.networkAddressChange();
    }
  },
  deactivated() {
    this.EnsAddress = "";
    this.EnsAddress_state = false;
  },
  mounted() {
    this.triggerType = common.equipmentEnd === "pc" ? "hover" : "click";
  },
  methods: {
    containsCryptoExtension(string) {
      const extensions = [".eth", ".bnb", ".arb"];
      for (let i = 0; i < extensions.length; i++) {
        if (string.includes(extensions[i])) {
          return true;
        }
      }
      return false;
    },
    //校验网络地址
    networkAddressChange() {
      const isEnsAddress = this.containsCryptoExtension(
        this.buyParams?.address?.toLowerCase()
      );
      if (this.isMatchAddress && isEnsAddress) {
        this.nowQueryENS();
        return;
      }
      this.searchEns_result = true;

      this.EnsAddress_state = false;
      this.EnsAddress = "";
      if (
        this.buyParams.address !== "" &&
        (!this.isMatchAddress || this.isInvalidTRC20Address)
      ) {
        this.walletAddress_state = true;
      } else {
        this.walletAddress_state = false;
        this.EnsAddress_state = false;
      }

      if (this.isAddressFromLedger && this.EnsAddress_state == false) {
        this.addressDefault = true;
      }
    },
    networkAddressFocus() {
      if (this.buyParams.address !== "" && this.isMatchAddress) {
        // this.nowQueryENS();
      } else {
        this.EnsAddress_state = false;
        this.EnsAddress = "";
      }

      if (this.recentAddressList?.length) {
        this.EnsAddress_state = true;
        this.showRecentAddressList = true;
      }
    },

    //网络memo校验
    networkAddressBlur() {
      this.$nextTick(() => {
        if (this.EnsAddress) {
          // 只隐藏 历史记录;
          this.showRecentAddressList = false;
        } else {
          this.EnsAddress_state = false;
        }
      });
    },
    nowQueryENS() {
      let _this = this;
      this.EnsAddress_state = false;
      this.EnsAddress = "";
      if (this.buyParams.address !== "") {
        let params = {
          name: this.buyParams.address,
        };
        this.$axios
          .get(this.$api.get_ENS, params)
          .then((res) => {
            if (res?.data?.address) {
              _this.EnsAddress = res.data.address;
              _this.showRecentAddressList = false;
              _this.EnsAddress_state = true;
              _this.searchEns_result = true;
              _this.walletAddress_state = false;
              return;
            }
            _this.EnsAddress = "";
            _this.EnsAddress_state = false;
            _this.searchEns_result = false;
            _this.walletAddress_state = true;
          })
          .catch(() => {
            _this.EnsAddress = "";
            _this.EnsAddress_state = false;
            _this.searchEns_result = false;
            _this.walletAddress_state = true;
          });
      }
    },
    setBuyParamsAddress(walletAddress) {
      this.EnsAddress_state = false;
      this.buyParams.address = walletAddress;
      if (!this.isMatchAddress || this.isInvalidTRC20Address) {
        this.walletAddress_state = true;
      } else {
        this.walletAddress_state = false;
      }
    },
    //memo校验
    networkMemoChange() {
      if (!this.isMatchMemo) {
        this.walletMemo_state = true;
      } else {
        this.walletMemo_state = false;
      }
    },

    verifyMerchantInfo() {
      let merchantInfo = this.merchantInfo.merchantQueryInfo;
      //商户网络、memo、地址商户
      if (this.merchantInfo.merchantStatus) {
        if (merchantInfo.network) {
          this.networkDefault = false;
        }
        if (merchantInfo.address) {
          this.addressDefault = true;
          this.buyParams.address = merchantInfo.address;
        }

        if (!merchantInfo.network || !merchantInfo.address) {
          this.queryNetwork();
        }

        if (
          merchantInfo.memo !== undefined &&
          merchantInfo.memo !== null &&
          merchantInfo.memo !== ""
        ) {
          this.memoDefault = true;
          this.buyParams.memo = merchantInfo.memo;
        }
      } else {
        this.networkDefault = true;
        this.addressDefault = false;
        this.memoDefault = false;
        this.queryNetwork();
      }
    },

    //Get network list
    queryNetwork() {
      let params = {
        crypto: this.cryptoInfo.crypto,
        fiat: this.fiatCurrencyInfo.fiat,
        side: "buy",
      };
      this.$axios.get(this.$api.get_network, params).then((res) => {
        if (res && res.data) {
          this.networkList = res.data;
          this.networkList.some((item) => {
            if (item.networkName === this.networkInfo.networkName) {
              this.recentAddressList = item.recentAddressList;
              return true;
            }
          });
        }
      });
    },

    //Displays the selected network view
    openSelect() {
      if (this.networkDefault === true) {
        this.searchViewState = true;
      }
    },

    //选择网络
    selectNetwork(item) {
      this.recentAddressList = item.recentAddressList || [];

      //存储修改网络信息
      let networkInfo = {
        network: item.network,
        networkName: item.networkName,
        addressRegex: item.addressRegex,
        memoRegex: item.memoRegex,
        networkIcon: item.networkIcon,
      };
      this.$store.commit("cryptoBuyPage/set_networkInfo", networkInfo);
      //存储法币最大值最小值
      let fiatmaxMin = {
        minAmount: item.minAmount,
        maxAmount: item.maxAmount,
      };
      this.$store.commit("cryptoBuyPage/set_fiatmaxMin", fiatmaxMin);
      //隐藏选择网络组件
      this.searchViewState = false;
      //地址校验
      this.networkAddressChange();
      //不满足网络最大最小值返回首页
      if (
        this.fiatCurrencyAmount < item.minAmount ||
        this.fiatCurrencyAmount > item.maxAmount
      ) {
        this.$router.push("/");
      }
    },

    //打开扫码
    openScanCode() {
      if (!this.addressDefault) {
        this.scanCode_queryName = "buyParams.address";
        this.scanCode_state = true;
      }
    },

    // 初始化LEDGER
    init_LEDGER() {
      if (!this.LEDGER_status) return;
      const llapi = new LedgerLiveApi(new WindowMessageTransport());
      llapi.connect();
      this.LEDGER_info = llapi;
    },

    // LEDGER选择钱包地址
    async requestAccount() {
      if (!this.LEDGER_info) return;
      const result_listCurrencies =
        await this.LEDGER_info.listCurrencies().catch((error) =>
          console.error({ error })
        );
      const cryptoList = await result_listCurrencies.filter((res) => {
        return res.ticker === this.networkInfo.network;
      })[0];
      let network = cryptoList?.id ? cryptoList?.id : "";
      let params = {
        allowAddAccount: true, //允许用户创建账号
        currencies: [network],
        // currencies: [this.networkInfo?.network.toLowerCase()]
      };
      const result = await this.LEDGER_info.requestAccount(params).catch(
        (error) => console.error({ error })
      );
      if (result?.address) {
        this.buyParams.address = result?.address;
        this.isAddressFromLedger = true;
      } else {
        if (!this.isAddressFromLedger) {
          this.addressDefault = false;
          this.isAddressFromLedger = false;
        }
      }
      // 地址校验
      this.networkAddressChange();
    },

    //跳转选择支付方式页 存存储创建订单参数
    transaction() {
      let params = {
        cryptoCurrency: this.cryptoInfo.crypto,
        address: this.buyParams.address,
        network: this.networkInfo.network,
        fiatCurrency: this.fiatCurrencyInfo.fiat,
        amount: this.fiatCurrencyAmount,
        depositType: 2,
        payWayCode: "",
        cryptoCurrencyVolume: this.cryptoAmount,
        alpha2: this.fiatCurrencyInfo.alpha2,
        memo: this.buyParams.memo,
        //商户信息有效携带商户参数
        merchantParam: this.merchantInfo.merchantStatus
          ? this.merchantInfo.merchantFullPath
          : "",
      };
      this.$store.commit("buyPayments/set_placeOrderQuery", params);
      this.$router.push("/paymentMethod");
    },

    //扫码组件
    scanCode(val) {
      this.scanCode_queryName = val;
      this.scanCode_state = true;
    },
  },
};
</script>
<style lang="scss" scoped>
#receiveCoins {
  flex: 1;
  .receiveCoins-view {
    height: 100%;
    .receiveCoins-content {
      .methods_myAddress {
        .methods_title {
          .title-top {
            font-family: "SF Pro Display";
            font-style: normal;
            font-weight: 600;
            font-size: 0.18rem;
            line-height: 0.21rem;
            color: #252830;
            margin-bottom: 0.22rem;
          }

          .LEDGER-btn {
            width: 100%;
            height: 100%;
            margin-bottom: 0.16rem;
            button {
              width: 100%;
              height: 0.37rem;
              cursor: pointer;
              background: rgba(0, 89, 218, 0.05);
              border: 1px solid #0059da;
              border-radius: 0.06rem;
              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 500;
              font-size: 0.16rem;
              line-height: 0.37rem;
              text-align: center;
              color: #0059da;
              &:hover {
                background: rgba(0, 89, 218, 0.2);
              }
            }
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.12rem;
            .left {
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              height: 0.32rem;
              background: #f5f5f5;
              border-radius: 1rem;
              padding: 0 0.16rem;
              font-family: "SF Pro Display";
              font-style: normal;
              font-weight: 600;
              font-size: 0.12rem;
              line-height: 0.18rem;
              color: #252830;
              img {
                margin-left: 0.04rem;
                width: 0.12rem;
              }
            }
            .right {
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              padding: 0 0.08rem;
              height: 0.2rem;
              background: #f5f5f5;
              border-radius: 1rem;

              span {
                font-family: "SF Pro Display";
                font-style: normal;
                font-weight: 400;
                font-size: 0.12rem;
                line-height: 0.16rem;
                color: #252830;
              }
              .tipsIcon {
                display: block;
                margin-left: 0.05rem;
                width: 0.1rem;
                cursor: pointer;
              }
            }
          }
        }
        .methods_input {
          background: #ffffff;
          position: relative;
          input {
            height: 0.48rem;
            width: 100%;
            outline: none;
            border-radius: 0.06rem;
            border: 1px solid #e6e8eb;
            padding: 0 0.48rem 0 0.16rem;
            font-family: "HarmonyOS Sans";
            font-style: normal;
            font-weight: 500;
            font-size: 0.14rem;
            line-height: 0.16rem;
            color: #252830;
            &.error {
              border-color: #f53f3f;
            }

            &:hover {
              border-color: #cbcfd6;
            }
            &:focus {
              border: 1px solid #0059da;
              // box-shadow: 0 0 0px 0.02rem rgba(0, 89, 218, 0.3);
            }
            &:disabled {
              cursor: no-drop;
            }

            &.ens-input {
              border-color: #0059da;
              border-radius: 0.06rem 0.06rem 0 0;
            }
          }
          input::placeholder {
            font-family: "SF Pro Display";
            font-style: normal;
            font-weight: 400;
            font-size: 0.14rem;
            line-height: 0.16rem;
            color: #b7bcc5;
          }
          .rightIcon {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0.14rem;
            right: 0.16rem;
            cursor: pointer;
            img {
              width: 0.2rem;
              height: 0.2rem;
            }
            &.noDrop {
              cursor: no-drop !important;
            }
          }
          .history-address-list-box {
            .ensAddress {
              cursor: default;
              color: #0059da;
              font-family: "HarmonyOS Sans";
              font-size: 0.12rem;
              font-style: normal;
              font-weight: 400;
              line-height: 0.16rem;
              height: 0.24rem;
              background: #ebf2fc;
              padding: 0.04rem 0.16rem;
              display: block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              border: 1px solid #0059da;
              border-top: 0;
              border-radius: 0 0 0.06rem 0.06rem;
              overflow: hidden;
            }
            .history-address-list {
              position: absolute;
              top: 100%;
              margin-top: 0.04rem;
              left: 0;
              right: 0;
              background: #ffffff;
              box-shadow: 0px 0px 0.32rem rgba(0, 0, 0, 0.14);
              border-radius: 0.06rem;
              padding: 0.04rem;
              max-height: 1.68rem;
              overflow: auto;

              .address-item {
                height: 0.4rem;
                line-height: 0.4rem;
                padding: 0 0.12rem;
                border-radius: 0.04rem;
                font-family: "HarmonyOS Sans";
                font-style: normal;
                font-weight: 500;
                font-size: 0.14rem;
                color: #252830;
                cursor: pointer;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:hover {
                  background: #f5f5f5;
                }
                &:active {
                  background: #ededed;
                }
              }
            }
          }
        }
        .methods_errorText {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.12rem;
          line-height: 0.18rem;
          color: #f53f3f;
        }

        &.memo {
          position: relative;
          margin-top: 0.24rem;
          .methods_title {
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
          .methods_input {
          }
        }
      }
      .tips {
        border: 1px solid rgba(255, 125, 0, 0.15);
        background: rgba(255, 125, 0, 0.05);
        border-radius: 0.06rem;
        padding: 0.08rem;
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.11rem;
        line-height: 0.15rem;
        color: #252830;
        margin-top: 0.12rem;
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
        img.rightIcon {
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
    .networkView {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      top: 0;
      left: 0;
      z-index: 1;
    }
    .sendCrypto_bottomContent {
      width: 100%;
      background: #ffffff;
      padding: 0.24rem 0.08rem 0.32rem;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: translate(0, 100%);
      border-radius: 0.24rem 0.24rem 0 0;
      z-index: 2;
      transition: 0.3s;
      .Network-title {
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
        img {
          position: absolute;
          display: block;
          top: 0.25rem;
          right: 0.16rem;
          width: 0.2rem;
          cursor: pointer;
        }
      }
      .Network-content {
        max-height: 3.36rem;
        overflow: auto;

        .item {
          height: 0.56rem;
          padding: 0 0.08rem;
          border-radius: 0.06rem;
          display: flex;
          align-items: center;
          cursor: pointer;

          img {
            width: 0.32rem;
            height: 0.32rem;
            border-radius: 50%;
            margin-right: 0.16rem;
          }
          span {
            font-family: "SF Pro Display";
            font-style: normal;
            font-weight: 400;
            font-size: 0.16rem;
            line-height: 0.2rem;
            color: #252830;
          }
          &.ac {
            cursor: default;
            span {
              color: #0059da;
            }
          }
          &:hover {
            background: #f5f5f5;
          }
          &:active {
            background: #ededed;
          }
        }
      }
      &.sendCrypto_bottomContentActive {
        transform: translate(0, 0rem) !important;
        transition: 0.3s;
      }
    }
  }
}
</style>
