<template>
  <div class="tiemDown-container">
    <div class="title" v-if="watch_flagView && flagStauts">
      {{ $t("worldCuo.countdown") }}
    </div>
    <div class="title" v-if="watch_flagView && !flagStauts">
      {{ $t("worldCuo.countdownstart") }}
    </div>
    <div class="wraper" v-if="flagStauts">
      <div class="line">
        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index8}px)` }"
        >
          <div class="num" v-for="(item, index) in arr8" :key="index">
            {{ item }}
          </div>
        </div>

        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index7}px)` }"
        >
          <div class="num" v-for="(item, index) in arr7" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="con">D</div>
      </div>
      <div class="line">
        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index6}px)` }"
        >
          <div class="num" v-for="(item, index) in arr6" :key="index">
            {{ item }}
          </div>
        </div>

        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index5}px)` }"
        >
          <div class="num" v-for="(item, index) in arr5" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="con">H</div>
      </div>
      <div class="line">
        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index4}px)` }"
        >
          <div class="num" v-for="(item, index) in arr4" :key="index">
            {{ item }}
          </div>
        </div>

        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index3}px)` }"
        >
          <div class="num" v-for="(item, index) in arr3" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="con">M</div>
      </div>
      <div class="line">
        <div
          class="column"
          :style="{ transform: `translateY(${-lineHeight * index2}px)` }"
        >
          <div class="num" v-for="(item, index) in arr2" :key="index">
            {{ item }}
          </div>
        </div>

        <div
          class="column second"
          :style="{ transform: `translateY(${-lineHeight * index1}px)` }"
        >
          <div class="num" v-for="(item, index) in arr1" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="con">S</div>
      </div>
    </div>
    <div class="time" v-else>2022.11.20 19:00:00 (UTC+3)</div>
  </div>
</template>

<script>
import moment from "moment-timezone";

export default {
  props: {
    flagView: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      temOut: null,
      lineHeight: "25", //跟字体大小和wraper的高度相关！
      // 秒
      arr1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index1: 0, //就是获取真实时间后的起始数字
      arr2: [0, 1, 2, 3, 4, 5],
      index2: 0,
      // 分
      arr3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index3: 0,
      arr4: [0, 1, 2, 3, 4, 5],
      index4: 0,
      // 时
      arr5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index5: 0,
      arr6: [0, 1, 2],
      index6: 0,
      // 天
      arr7: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index7: 0,
      arr8: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      index8: 0,
      //世界杯活动未开始时展示
      flagStauts: false,
    };
  },
  mounted() {
    //获取活动是否支持
    this.getWorldCurTime();
  },
  distoryed() {
    clearInterval(this.temOut);
  },
  methods: {
    getTime() {
      // this.startTime = '2022.11.18 07:05:00'
      var moment = require("moment-timezone");
      //现在的utc时间
      let data = moment().valueOf();
      //世界杯开始时间
      let getTimeData = moment(this.startTime).valueOf();
      //世界杯结束时间
      let data1 = moment(this.endTime).valueOf();
      if (data >= getTimeData && data <= data1) {
        this.$store.commit("userInfo/set_activityStatus", true);
        this.flagStauts = true;
        let msec = data1 - data;
        let day = this.bu0(parseInt(msec / 1000 / 60 / 60 / 24));
        let hour = this.bu0(parseInt((msec / 1000 / 60 / 60) % 24));
        let minute = this.bu0(parseInt((msec / 1000 / 60) % 60));
        let second = this.bu0(parseInt((msec / 1000) % 60));
        //世界杯结束时间
        // 秒
        this.index1 = parseInt(second[1]);
        this.index2 = parseInt(second[0]);
        // 分
        this.index3 = parseInt(minute[1]);
        this.index4 = parseInt(minute[0]);
        // 时
        this.index5 = parseInt(hour[1]);
        this.index6 = parseInt(hour[0]);
        //天
        this.index7 = parseInt(day[1]);
        this.index8 = parseInt(day[0]);
        // this.turnSecond(this.arr1.length)
        return;
      } else {
        // 活动未开始展示
        if (data < getTimeData) {
          this.flagStauts = false;
          this.$store.commit("userInfo/set_activityStatus", false);
          return;
        }
        //活动结束展示
        this.flagStauts = true;
        this.$store.commit("userInfo/set_activityStatus", false);
        // 展示0分0秒
        // 秒
        this.index1 = parseInt([0, 0]);
        this.index2 = parseInt([0, 0]);
        // 分
        this.index3 = parseInt([0, 0]);
        this.index4 = parseInt([0, 0]);
        // 时
        this.index5 = parseInt([0, 0]);
        this.index6 = parseInt([0, 0]);
        //天
        this.index7 = parseInt([0, 0]);
        this.index8 = parseInt([0, 0]);
        // this.turnSecond(this.arr1.length)
      }
    },
    bu0(num) {
      let str;
      if (num < 10) str = `0${num}`;
      else str = `${num}`;
      return str.split("");
    },
    // turnSecond (length) {
    //
    // },
    //获取世界杯时间
    getWorldCurTime() {
      this.$axios
        .get(this.$api.get_activitytime)
        .then((res) => {
          if (res) {
            this.startTime = res.data.startTime;
            this.endTime = res.data.endTime;
            clearInterval(this.temOut);
            this.temOut = setInterval(() => {
              this.getTime();
            }, 1000);
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // turnOther(type, length) {
    //   // type代表第几组数列，例如2，就是从右往左第二列
    //   if (this[`index${type}`] === length-1) {
    //     // console.log(type)
    //     // 通知前一位移动
    //     let next = type+1
    //     this.turnOther( next, this[`arr${next}`].length)
    //
    //     this[`index${type}`] = -1
    //   }
    //   this[`index${type}`]++
    // }
  },
  computed: {
    watch_flagView() {
      if (this.flagView === false && this.$store.state.isPcAndPhone === "pc") {
        return true;
      } else {
        return this.flagView;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tiemDown-container {
  //width: 1.8rem;
  //margin: .22rem .2rem 0 0;
  .title {
    color: #6d84a5;
    font-size: 0.12rem;
    font-family: Regular;
    margin-bottom: 0.06rem;
  }
  .wraper {
    //height: .42rem;
    //margin-top: 7px;
    display: flex;
    justify-content: center;
    .line {
      display: flex;
      justify-content: center;
      width: 40px;
      height: 25px;
      background: rgba(38, 188, 198, 0.8);
      border-radius: 5px;
      margin-right: 0.02rem;
      overflow: hidden;
      .con {
        color: #92e8e6;
        font-size: 0.12rem;
        font-family: Semibold;
        line-height: 0.3rem;
        margin-left: 0.02rem;
      }
    }
    .column {
      transition: transform 300ms;
      .num {
        height: 25px;
        font-family: Regular;
        color: #ffffff;
        font-size: 16px;
        line-height: 27px;
      }
    }
  }
  .time {
    width: 1.66rem;
    height: 0.25rem;
    font-family: Regular;
    background: rgba(38, 188, 198, 0.8);
    border-radius: 0.05rem;
    font-style: normal;
    font-weight: 400;
    font-size: 0.12rem;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
