<template>
  <div class="verify-exception-container">
    <div class="status-content">
      <verify-img-status status="exception"></verify-img-status>
      <div class="user-info">
        <div class="p1">{{ $t("kycStatus.account") }}{{ emailSlice }}</div>
        <div class="p2">
          {{ $t("kycStatus.login_time") }}
          {{ kycInfo.lastLoginTime | lastLoginTimeFilter }}
        </div>
      </div>
      <div class="verify-status-reason">
        <div class="label">
          <img src="@/assets/images/kycOnfido/5.svg" alt="" />
          <span>
            {{ $t("kycStatus.verify_exception.tips") }}
          </span>
        </div>
        <div class="content">
          <template v-if="failList.length == 1">
            {{ failList[0].returnMsg }}
          </template>
          <template v-else>
            <div class="p" v-for="(item, index) in failList" :key="index">
              {{ item.returnMsg }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="update-documents" @click="updateDocuments">
      <span>{{ $t("kycStatus.verify_exception.update_document") }}</span>
      <img src="@/assets/images/kycOnfido/7.svg" alt="" />
    </div>
  </div>
</template>
<script>
import VerifyImgStatus from "./VerifyImgStatus";

export default {
  name: "VerifyException",
  components: {
    VerifyImgStatus,
  },
  props: ["kycInfo", "emailSlice"],
  data() {
    return {};
  },
  methods: {
    updateDocuments() {
      this.$router.push({
        path: "/kycVerify",
      });
    },
  },
  computed: {
    failList() {
      let failList = [];
      this.kycInfo.failList.forEach((item, index) => {
        if (item.returnMsg) {
          failList.push(item);
        }
      });
      return failList;
    },
  },
  filters: {
    lastLoginTimeFilter(val) {
      let date = new Date(val);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;

      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();

      let m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let strDate = `${M}/${D}/${Y} ${h}:${m}`;
      return strDate;
    },
  },
};
</script>
<style lang="scss" scoped>
.verify-exception-container {
  height: 100%;
  .status-content {
    height: calc(100% - 0.78rem);
    margin-bottom: 0.2rem;
    overflow: auto;
  }

  .user-info {
    font-family: "Regular";
    font-style: normal;
    font-weight: 400;
    font-size: 0.14rem;
    line-height: 0.22rem;
    /* identical to box height, or 157% */
    text-align: center;
    color: #6e7687;
    margin-bottom: 0.24rem;
    .p1 {
      margin-bottom: 0.02rem;
    }
    .p2 {
    }
  }
  .verify-status-reason {
    background: rgba(253, 102, 38, 0.05);
    border-radius: 0.12rem;
    padding: 0.16rem;
    .label {
      margin-bottom: 0.1rem;
      display: flex;
      img {
        width: 0.2rem;
        height: 0.2rem;
        margin: 0.02rem 0.1rem 0 0.02rem;
      }
      span {
        font-family: "Medium";
        font-style: normal;
        font-weight: 500;
        font-size: 0.16rem;
        line-height: 0.22rem;
        color: #fd6626;
      }
    }
    .content {
      font-family: "Regular";
      font-style: normal;
      font-weight: 400;
      font-size: 0.14rem;
      line-height: 0.22rem;
      color: #6e7687;
      .p {
        position: relative;
        padding-left: 0.24rem;
        &:not(:last-child) {
          margin-bottom: 0.06rem;
        }
        &:before {
          content: "";
          position: absolute;
          width: 0.04rem;
          height: 0.04rem;
          left: 0.1rem;
          top: 0.1rem;
          border-radius: 50%;
          background-color: #6e7687;
        }
      }
    }
  }
  .update-documents {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.58rem;
    background: linear-gradient(88.06deg, #0059da 0%, #1bb2f2 100%);
    border-radius: 0.3rem;
    cursor: pointer;
    span {
      font-family: "Medium";
      font-style: normal;
      font-weight: 500;
      font-size: 0.16rem;
      line-height: 0.19rem;
      text-align: center;
      color: #fafafa;
    }
    img {
      margin-left: 0.08rem;
      width: 0.2rem;
      height: 0.2rem;
    }
  }
}
</style>
