<template>
  <div class="sellState-container" ref="padding_bottom_box">
    <div class="sellState_nav">
      <p>{{ $t("sellOrderFonts.Sellorder_StatusNav") }}</p>
      <img @click="goSellOrder" src="@/assets/images/ShutDown.svg" alt="" />
    </div>
    <div class="sellState_content">
      <div class="sellState">
        <img
          v-if="currentStep <= 0"
          src="@/assets/images/stateSell/icon1_no.svg"
          alt=""
        />
        <img
          v-else-if="currentStep == 1"
          src="@/assets/images/stateSell/icon1_In.svg"
          alt=""
        />
        <img
          v-else-if="currentStep > 1"
          src="@/assets/images/stateSell/icon1_finish.svg"
          alt=""
        />
        <div
          class="sellState_right"
          :class="{
            'not-stated': currentStep <= 0,
            'in-progress': currentStep == 1,
            completed: currentStep > 1,
          }"
        >
          <p class="step-title">
            {{ $t("sellOrderFonts.Sellorder_StatusCryptoSent") }}
          </p>
          <p v-if="currentStep >= 1" class="step-tips">
            {{ $t("sellOrderFonts.Sellorder_StatusBlockConfirmed") }} (
            {{ orderStateData.confirmBlock }} /
            {{ orderStateData.totalBlock }} )
          </p>
        </div>
      </div>
      <img v-if="currentStep <= 0" class="line" :src="line.notStated" alt="" />
      <img
        v-else-if="currentStep == 1"
        class="line"
        :src="line.inProgress"
        alt=""
      />
      <img
        v-else-if="currentStep > 1"
        class="line"
        :src="line.completed"
        alt=""
      />
    </div>

    <!--    <div class="sellState_content">-->
    <!--      <div class="sellState">-->
    <!--        <img-->
    <!--          v-if="currentStep <= 1"-->
    <!--          src="@/assets/images/stateSell/icon2_no.svg"-->
    <!--          alt=""-->
    <!--        />-->
    <!--        <img-->
    <!--          v-else-if="currentStep == 2"-->
    <!--          src="@/assets/images/stateSell/icon2_In.svg"-->
    <!--          alt=""-->
    <!--        />-->
    <!--        <img-->
    <!--          v-else-if="currentStep > 2"-->
    <!--          src="@/assets/images/stateSell/icon2_fil.svg"-->
    <!--          alt=""-->
    <!--        />-->
    <!--        <div-->
    <!--          class="sellState_right"-->
    <!--          :class="{-->
    <!--            'not-stated': currentStep <= 1,-->
    <!--            'in-progress': currentStep == 2,-->
    <!--            completed: currentStep > 2,-->
    <!--          }"-->
    <!--        >-->
    <!--          <p class="step-title">-->
    <!--            {{ $t("sellOrderFonts.Sellorder_StatusConfirmOrder") }}-->
    <!--          </p>-->
    <!--          <p v-if="currentStep >= 2" class="step-tips">-->
    <!--            {{ $t("sellOrderFonts.Sellorder_StatusOrderconfirmed") }}-->
    <!--          </p>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <img v-if="currentStep <= 1" class="line" :src="line.notStated" alt="" />-->
    <!--      <img-->
    <!--        v-else-if="currentStep == 2"-->
    <!--        class="line"-->
    <!--        :src="line.inProgress"-->
    <!--        alt=""-->
    <!--      />-->
    <!--      <img-->
    <!--        v-else-if="currentStep > 2"-->
    <!--        class="line"-->
    <!--        :src="line.completed"-->
    <!--        alt=""-->
    <!--      />-->
    <!--    </div>-->
    <div class="sellState_content">
      <div class="sellState">
        <img
          v-if="currentStep <= 2 || currentStep <= 1"
          src="@/assets/images/stateSell/icon3_no.svg"
          alt=""
        />
        <img
          v-else-if="currentStep == 3 || currentStep == 2"
          src="@/assets/images/stateSell/icon3_In.svg"
          alt=""
        />
        <img
          v-else-if="currentStep > 3"
          src="@/assets/images/stateSell/icon3_fil.svg"
          alt=""
        />
        <div
          class="sellState_right"
          :class="{
            'not-stated': currentStep <= 2 && currentStep <= 1,
            'in-progress': currentStep == 3,
            completed: currentStep > 3,
          }"
        >
          <p class="step-title">
            {{ $t("sellOrderFonts.Sellorder_StatusInTransfer") }}
          </p>
          <p v-if="currentStep >= 3" class="step-tips">
            {{ $t("sellOrderFonts.Sellorder_StatusInTransferfiat") }}
          </p>
        </div>
      </div>
      <img
        v-if="currentStep <= 1 || currentStep <= 2"
        class="line"
        :src="line.notStated"
        alt=""
      />
      <img
        v-else-if="currentStep == 3"
        class="line"
        :src="line.inProgress"
        alt=""
      />
      <img
        v-else-if="currentStep > 3"
        class="line"
        :src="line.completed"
        alt=""
      />
    </div>

    <div class="sellState_content">
      <div class="sellState">
        <img
          v-if="currentStep <= 3"
          src="@/assets/images/stateSell/icon4_no.svg"
          alt=""
        />
        <img
          v-else-if="currentStep == 4"
          src="@/assets/images/stateSell/icon4_In.svg"
          alt=""
        />
        <img
          v-else-if="currentStep == 5"
          src="@/assets/images/stateSell/icon4_fil.svg"
          alt=""
        />
        <img
          v-else-if="currentStep == 6"
          src="@/assets/images/stateSell/icon4_error.svg"
          alt=""
        />

        <div
          class="sellState_right"
          :class="{
            'not-stated': currentStep <= 3,
            'in-progress': currentStep == 4,
            completed: currentStep == 5,
            failed: currentStep == 6,
          }"
        >
          <p class="step-title">
            {{ $t("sellOrderFonts.Sellorder_StatusResult") }}
          </p>
          <p v-if="currentStep >= 5" class="step-tips">
            {{
              orderStateData.orderStatus == 5
                ? $t("sellOrderFonts.Sellorder_StatusResultCompleted")
                : $t("sellOrderFonts.Sellorder_StatusResultfail")
            }}
          </p>
        </div>
      </div>
    </div>
    <p class="tips">{{ $t("sellOrderFonts.Sellorder_StatusTitle") }}</p>
    <footer class="footer" ref="footer_ref">
      <div class="button" @click="goHistry">
        {{ $t("sellOrderFonts.Sellorder_ButtongoHistory") }}
        <img
          class="rightIcon"
          src="@/assets/images/button-right-icon.svg"
          alt=""
        />
      </div>
      <powered-by
        @setPaddingBottom="
          $refs.padding_bottom_box.style.paddingBottom =
            $refs.footer_ref.clientHeight + 'px'
        "
      />
    </footer>
  </div>
</template>
<script>
export default {
  name: "sellState",
  props: {
    orderStateData: {
      default: "",
    },
  },
  data() {
    return {
      line: {
        notStated: require("@/assets/images/stateSell/Line.svg"),
        inProgress: require("@/assets/images/stateSell/LineIn.svg"),
        completed: require("@/assets/images/stateSell/LineActive.svg"),
      },
      state: 2,
    };
  },
  computed: {
    currentStep() {
      if (this.orderStateData.orderStatus < 6) {
        return this.orderStateData.orderStatus;
      } else {
        // [6,8,9]
        return 6;
      }
    },
  },
  methods: {
    goSellOrder() {
      setTimeout(() => {
        this.$store.state.nextOrderState = 1;
      }, 1000);
      this.$router.replace("/");
    },
    goHistry() {
      this.$store.state.historyTab = "sell";
      this.$router.push("/tradeHistory");
    },
  },
};
</script>
<style lang="scss" scoped>
.sellState-container {
  padding-bottom: 0.56rem;
  .sellState_nav {
    padding-bottom: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background-color: #fff;
    p {
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 600;
      font-size: 0.18rem;
      line-height: 0.22rem;
      color: #252830;
    }
    img {
      width: 0.24rem;
      cursor: pointer;
    }
  }
  .sellState_content {
    .sellState {
      display: flex;
      align-items: center;
      img {
        width: 0.4rem;
        margin-right: 0.16rem;
      }
      .sellState_right {
        font-family: "SF Pro Display";
        font-style: normal;
        .step-title {
          font-size: 0.16rem;
          line-height: 0.16rem;
        }
        .step-tips {
          margin-top: 0.1rem;
          font-weight: 400;
        }
        &.not-stated {
          .step-title {
            font-weight: 500;
            color: #848b96;
          }
        }
        &.in-progress {
          .step-title {
            font-weight: 700;
            color: #0260e7;
          }
          .step-tips {
            font-size: 0.13rem;
            line-height: 0.13rem;
            color: #0260e7;
          }
        }
        &.completed {
          .step-title {
            font-weight: 700;
            color: #252830;
          }
          .step-tips {
            font-size: 0.14rem;
            line-height: 0.14rem;
            color: #848b96;
          }
        }
        &.failed {
          .step-title {
            font-weight: 700;
            color: #f53f3f;
          }
          .step-tips {
            font-size: 0.13rem;
            line-height: 0.13rem;
            color: #f53f3f;
          }
        }
      }
    }
    .line {
      height: 0.4rem;
      margin: 0.12rem 0;
    }
  }

  .tips {
    padding: 0.08rem;
    font-family: "SF Pro Display";
    font-style: normal;
    font-weight: 400;
    font-size: 0.11rem;
    line-height: 0.15rem;
    color: #252830;
    border-radius: 0.06rem;
    background: rgba(255, 125, 0, 0.05);
    margin: 0.24rem 0 0.16rem 0;
    border: 1px solid rgba(255, 125, 0, 0.15);
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
    left: 0;
    background: #ffffff;
    padding: 0.08rem 0.16rem 0;
    z-index: 999;
    .button {
      width: 100%;
      height: 0.48rem;
      border-radius: 0.06rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      font-family: "SF Pro Display";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #ffffff;
      .rightIcon {
        width: 0.2rem;
        margin-left: 0.08rem;
        span {
          height: 0.17rem;
        }
      }

      background: #0059da;
      opacity: 1;
      cursor: pointer;
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
