<template>
  <div class="important-updates-box">
    <div class="bg" :style="{ height: height + 'px' }">
      <div class="important-updates">
        <div class="updates-title">
          <img
            src="@/assets/images/noticeBar/1.jpg"
            alt=""
            class="notice-img"
          />
          <span class="text">{{ updates.title }}</span>
        </div>
        <div class="updates-content">
          <div
            class="list"
            v-for="(item, index) in updates.content"
            :key="index"
          >
            {{ item }}
          </div>
          <div class="apologies">{{ updates.apologies }}</div>
        </div>
        <div class="button" @click="onCloseDialog">{{ "I understand" }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ImportantUpdates",
  props: ["height"],
  data() {
    return {
      updates: {
        title: "Important updates:",
        content: [
          "September 1, 2023: All banks in Singapore will be closed due to the public holiday, there will be no transactions conducted on that day.",
          "September 4, 2023: USD settlement will be delayed as it is Labor Day in the United States.",
          "Payments made in USD after 5pm on August 31, 2023, will be settled on September 5, 2023.",
        ],
        apologies: "Apologies for any inconvenience caused.",
      },
    };
  },
  computed: {},
  mounted() {},
  beforeDestroy() {},
  watch: {},
  methods: {
    onCloseDialog() {
      this.$store.commit("changeisShowImportantUpdates", {
        flag: false,
        timeStamp: new Date().getTime(),
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.important-updates-box {
  height: 0;
  position: relative;
  width: 3.75rem;
  z-index: 2;
  .bg {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    .important-updates {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 3.43rem;
      // height: 326px;
      border-radius: 0.08rem;
      overflow: hidden;
      background: #fff;
      .updates-title {
        display: flex;
        align-items: center;
        padding: 0.24rem 0.16rem 0;
        margin-bottom: 0.16rem;

        .notice-img {
          width: 0.16rem;
          margin-right: 0.12rem;
        }
        .text {
          color: #252830;
          font-family: SF Pro Display;
          font-size: 0.18rem;
          font-style: normal;
          font-weight: 700;
          line-height: 120%;
        }
      }
      .updates-content {
        padding: 0 0.16rem 0.24rem;
        .list,
        .apologies {
          color: #252830;
          font-family: SF Pro Display;
          font-size: 0.14rem;
          font-style: normal;
          font-weight: 400;
          line-height: 150%; /* 21px */
          padding-left: 0.2rem;
        }
        .list {
          margin-bottom: 0.08rem;
          position: relative;
          padding-left: 0.2rem;
          position: relative;
          &:before {
            content: "";
            position: absolute;
            left: 0.1rem;
            top: 0.1rem;
            width: 0.02rem;
            height: 0.02rem;
            background: #252830;
            border-radius: 50%;
          }
        }
        .apologies {
        }
      }
      .button {
        cursor: pointer;
        height: 0.48rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 0.5px solid #e6e8eb;
        padding: 0.1rem;
        color: #0059da;
        text-align: center;
        font-family: SF Pro Display;
        font-size: 0.16rem;
        font-style: normal;
        font-weight: 500;
        line-height: 0.24rem; /* 150% */
      }
    }
  }
}

@media (min-width: 791px) {
  .important-updates-box {
    .bg {
      border-radius: 0.15rem;
    }
  }
}
@media (max-width: 791px) {
  .important-updates-box {
    .bg {
      border-radius: 0;
    }
  }
}
</style>
