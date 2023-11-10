<template>
  <div id="TraderInformation">
    <div class="title">{{ $t("TraderInformation.title") }}</div>
    <div class="info-view">
      <div class="icon">
        <img src="@/assets/images/TraderInformation/user.png" alt="" />
      </div>
      <div class="info">{{ showInfo }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TraderInformation",
  props: ["name", "idNumber", "phone"],
  computed: {
    ...mapState("buyPayments", {
      lastTimePaymentFormInfo: (state) => state.lastTimePaymentFormInfo,
    }),
    /**
     * name、idNumber、phone 为 lastTimePaymentFormInfo 中存放信息键值名
     * @returns {string}
     */
    showInfo() {
      const result = {};
      const iterate = (obj, prefix = "") => {
        for (const key in obj) {
          const newKey = prefix ? `${key}` : key;
          if (typeof obj[key] === "object" && obj[key] !== null) {
            iterate(obj[key], newKey); // 递归调用，处理嵌套对象
          } else {
            result[newKey] = obj[key];
          }
        }
      };
      iterate(this.lastTimePaymentFormInfo);
      if (result[this.name] !== undefined && this.name) {
        return result[this.name].substring(0, 4) + "****";
      }
      if (result[this.idNumber] && this.idNumber) {
        return result[this.idNumber].toString().substring(0, 4) + "****";
      }
      if (result[this.phone] && this.phone) {
        return result[this.phone].toString().substring(0, 4) + "****";
      }
      return "";
    },
  },
};
</script>

<style scoped lang="scss">
#TraderInformation {
  margin-top: 0.24rem;
  margin-bottom: 0.16rem;
  .title {
    color: #5d636d;
    font-family: SF Pro Display;
    font-size: 0.13rem;
    font-style: normal;
    font-weight: 500;
    line-height: 120%;
  }
  .info-view {
    display: flex;
    align-items: center;
    height: 0.48rem;
    border-radius: 0.12rem;
    background: #f4f8fb;
    border: 1px solid #e6e8eb;
    margin-top: 0.06rem;
    padding: 0 0.12rem;
    .icon {
      width: 0.2rem;
      height: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      margin-left: 0.06rem;
      color: #5d636d;
      font-family: HarmonyOS Sans;
      font-size: 0.16rem;
      font-style: normal;
      font-weight: 500;
      line-height: 0.24rem;
    }
  }
}
</style>
