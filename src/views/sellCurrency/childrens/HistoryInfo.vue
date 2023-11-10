<template>
  <!-- 历史支付卡信息 -->
  <div class="history-view" v-if="!dataLoadingStatus">
    <div class="cardInfo-history" v-if="oldCardInfo.length > 0">
      <div class="line1">
        <div class="line1-1">
          <el-checkbox
            class="checkbox"
            size="medium"
            v-model="get_isOldCardInfo"
            @change="assignmentOldCardInfo"
          ></el-checkbox>
        </div>
        <div class="line1-2">{{ $t("sellFormPageTitle.Information") }}</div>
        <div class="more" @click="openCardInfo" v-if="oldCardInfo.length > 1">
          {{ $t("sellFormPageTitle.More") }}
        </div>
      </div>
      <div class="info">
        <div class="info-left">
          <p class="info-left-icon">
            <img :src="cardType(oldCardInfo[0])" alt="" />
          </p>
          <p class="info-left-name" v-if="oldCardInfo[0].accountType == '1'">
            {{ dataDecrypt(oldCardInfo[0].bankAccountInfo.name) }}
          </p>
          <p class="info-left-name" v-else>
            {{
              dataDecrypt(oldCardInfo[0].firstName) +
              " " +
              dataDecrypt(oldCardInfo[0].lastName)
            }}
          </p>
        </div>
        <div class="info-right">
          <span>****</span>{{ dataCardDecrypt(oldCardInfo[0].accountNumber) }}
        </div>
      </div>
    </div>

    <!-- 支付方式信息-->
    <div class="payType" v-if="payoutList && payoutList.length > 1">
      <div class="payType-title">{{ $t("sellPayType.title") }}</div>
      <div class="payType-ul">
        <div
          class="payType-li"
          v-for="(item, index) in payoutList"
          :key="index"
          @click="selectPayType(item)"
          :class="{ 'payType-li-check': item.payWayCode === payFormType }"
        >
          <!-- payoutList -->
          <div class="payType-li-content" v-if="item.payWayCode === '10010'">
            <div class="payType-line1">
              <div class="payType-icon">
                <img
                  src="@/assets/images/sellPayForm/creditCard-icon.png"
                  alt=""
                />
              </div>
              <div class="payType-name">
                {{ $t("sellPayType.type_card") }}
              </div>
            </div>
            <div class="payType-introduce">
              {{ $t("sellPayType.type_card_tips") }}
            </div>
          </div>
          <div class="payType-li-content" v-if="item.payWayCode === '19000'">
            <div class="payType-line1">
              <div class="payType-icon">
                <img
                  src="@/assets/images/sellPayForm/bankAccount-icon.png"
                  alt=""
                />
              </div>
              <div class="payType-name">
                {{ $t("sellFormUserInfo.bank_transfer") }}
              </div>
            </div>
            <div class="payType-introduce">
              {{ $t("sellPayType.type_type_bankAccount_tips") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import valid from "card-validator";
import { AES_Decrypt } from "@/utils/encryp";

export default {
  props: [
    "dataLoadingStatus",
    "oldCardInfo",
    "isOldCardInfo",
    "payoutList",
    "payFormType",
  ],
  data() {
    return {
      get_isOldCardInfo: false,
    };
  },
  watch: {
    isOldCardInfo: {
      immediate: true,
      handler(val) {
        this.get_isOldCardInfo = val;
      },
    },
  },
  methods: {
    dataCardDecrypt(val) {
      if (!val) return "";
      let cardNum = AES_Decrypt(val);
      return cardNum.substring(cardNum.length - 4, cardNum.length);
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
    dataDecrypt(val) {
      if (!val) return "";
      return AES_Decrypt(val);
    },
    assignmentOldCardInfo(val) {
      this.get_isOldCardInfo = val;
      this.$emit("set_isOldCardInfo", val);
      this.$emit("assignmentOldCardInfo");
    },
    openCardInfo() {
      this.$emit("openCardInfo");
    },
    selectPayType(item) {
      this.$emit("selectPayType", item);
    },
  },
};
</script>

<style scoped lang="scss">
.cardInfo-history {
  margin-bottom: 0.24rem;
  .line1 {
    display: flex;
    align-items: center;
    margin-bottom: 0.12rem;
    .line1-1 {
      display: flex;
      align-items: center;
      justify-content: center;
      ::v-deep .el-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-checkbox__inner {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 0.16rem;
          height: 0.16rem;
          border-color: #dbdee3;
        }

        &.is-checked {
          .el-checkbox__inner {
            background-color: #0059da;
            border-color: #0059da;
            &:after {
              top: 0.02rem;
              left: 0.05rem;
            }
          }
        }
      }
    }
    .line1-2 {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      line-height: 0.16rem;
      color: #5d636d;
      margin-left: 0.08rem;
    }
    .more {
      margin-left: auto;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 400;
      font-size: 0.13rem;
      line-height: 0.16rem;
      color: #0059da;
      cursor: pointer;
    }
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 0.64rem;
    background: rgba(0, 104, 255, 0.2);
    border: 1px solid rgba(0, 104, 255, 0.3);
    border-radius: 0.06rem;
    overflow: hidden;
    padding: 0 0.12rem 0 0.16rem;
    .info-left {
      display: flex;
      align-items: center;
      .info-left-icon {
        margin-right: 0.16rem;
        display: flex;
        align-items: center;
        img {
          width: 0.4rem;
        }
      }
      .info-left-name {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 400;
        font-size: 0.13rem;
        line-height: 0.16rem;
        color: #5d636d;
      }
    }
    .info-right {
      font-family: "HarmonyOS Sans";
      font-style: normal;
      font-weight: 700;
      font-size: 0.16rem;
      line-height: 0.19rem;
      color: #252830;
      display: flex;
      align-items: center;
      span {
        font-family: "SF Pro Display";
        font-style: normal;
        font-weight: 700;
        font-size: 0.12rem;
        line-height: 0.14rem;
        text-align: center;
        color: #252830;
      }
    }
  }
}

.payType {
  margin-bottom: 0.24rem;
  .payType-title {
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 500;
    font-size: 0.16rem;
    line-height: 0.2rem;
    color: #5d636d;
    margin-bottom: 0.12rem;
  }
  .payType-ul {
    display: flex;
    justify-content: space-between;

    .payType-li {
      width: 1.64rem;
      min-height: 0.98rem;
      background: #ffffff;
      border: 1px solid #e6e8eb;
      border-radius: 0.06rem;
      padding: 0.16rem 0.1rem 0.14rem 0.12rem;
      .payType-li-content {
        .payType-line1 {
          display: flex;
          align-items: center;
          margin-bottom: 0.08rem;
          .payType-icon {
            margin-right: 0.12rem;
            img {
              width: 0.32rem;
            }
          }
          .payType-name {
            font-family: "SF Pro Display";
            font-style: normal;
            font-weight: 700;
            font-size: 0.15rem;
            line-height: 0.2rem;
            color: #252830;
            word-break: break-all;
          }
        }
        .payType-introduce {
          font-family: "SF Pro Display";
          font-style: normal;
          font-weight: 400;
          font-size: 0.11rem;
          line-height: 0.14rem;
          color: #848b96;
        }
      }
      &.payType-li-check {
        border-color: transparent;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          left: -1px;
          top: -1px;
          border: 2px solid #0059da;
          border-radius: 0.06rem;
        }
      }
    }
  }
}
</style>
