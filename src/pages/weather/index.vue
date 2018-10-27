<template>
  <div class="weather clearfix">
    <div class="today center"
         v-if="dataArray.length > 0">
      <p>今日 {{dataArray[1].weekday}}</p>
      <p>{{dataArray[1].temperture}}</p>
      <p>{{dataArray[1].type}}</p>
      <p>{{dataArray[1].fengxiang + dataArray[1].fengli}}</p>
    </div>
    <div class="today right">
      <img :src="!!dataArray[1] ? dataArray[1].img :'https://cdn.heweather.com/cond_icon/999.png'"
           class="big-img" />
      <span class="nowspan">{{nowTemp}}℃</span>
      <div class="city"
           @click="goCity">
        <i-icon type="coordinates_fill"
                size="20" />
        <text class="loc">{{cityName}}</text>
      </div>
    </div>
    <ul class="forecast">
      <scroll-view class="scroll-view"
                   :scroll-x="true">
        <li v-for="(item,index) in dataArray"
            :key='index'
            v-if="index!=1">
          <p>{{ item.weekday }}</p>
          <p><img :src="item.img"
                 class="small-img" /></p>
          <p>{{ item.type }}</p>
          <p>{{ item.temperture }}</p>
          <p>{{ item.fengxiang + item.fengli}}</p>
        </li>
      </scroll-view>
    </ul>
    <p class="tips"><span>温馨提示：</span>{{tips}}</p>
  </div>
</template>

<script>
import { setTimeout } from 'timers'

export default {
  data() {
    return {
      cityName: '武汉',
      dataArray: [],
      tips: '',
      nowTemp: '',
      currentMeun: 'weather'
    }
  },
  methods: {
    goCity() {
      this.showCity = true
    },
    initWeather() {
      this.$net.get('weatherApi', { city: this.cityName }).then(res => {
        wx.hideNavigationBarLoading()
        if (res.code == 200) {
          try {
            let resData = res.data
            this.tips = resData.ganmao
            this.nowTemp = resData.wendu
            //昨日数据处理
            resData.yesterday.fengxiang = resData.yesterday.fx
            resData.yesterday.fengli = resData.yesterday.fl
              .replace('<![CDATA[', '')
              .replace(']]>', '')
            resData.yesterday.temperture = this.temperture(resData.yesterday)
            resData.yesterday.img = this.getImageUrl(resData.yesterday)
            this.dateFormat(resData.yesterday)
            this.dataArray.push(resData.yesterday)
            //预报数据处理
            for (let i = 0; i < resData.forecast.length; i++) {
              this.dateFormat(resData.forecast[i])
              resData.forecast[i].temperture = this.temperture(
                resData.forecast[i]
              )
              if (i == 0) {
                resData.forecast[i].img = this.getImageUrl(
                  resData.forecast[i],
                  true
                )
              } else {
                resData.forecast[i].img = this.getImageUrl(resData.forecast[i])
              }
              resData.forecast[i].fengli = resData.forecast[i].fengli
                .replace('<![CDATA[', '')
                .replace(']]>', '')
            }
            this.dataArray = this.dataArray.concat(resData.forecast)
            this.cityName = resData.city
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    getImageUrl(source, istoday) {
      let url = 'https://cdn.heweather.com/cond_icon/',
        reCode = 999
      if (!!source) {
        reCode = this.$imgCode(source.type)
      }
      url += reCode
      if (istoday && new Date().getHours() >= 18 && reCode !== 999) {
        url += 'n'
      }
      url += '.png'
      return url
    },
    temperture(data) {
      let temp = ''
      if (!!data) {
        temp =
          data.low.replace('低温 ', '') + '~' + data.high.replace('高温 ', '')
      }
      return temp
    },
    dateFormat(data) {
      if (!!data) {
        let dateA = data.date.split('日')
        data.day = dateA[0]
        data.weekday = dateA[1]
      }
    },
    handleChange(ev) {
      //this.currentMeun = ev.target.key;
      let url
      switch (ev.target.key) {
        case 'news':
          url = '../news/main'
          wx.redirectTo({ url })
          break
        /*  case "weather":
          url = '../weather/main';
          wx.redirectTo({url});
          break; */
        case 'remind':
          break
        case 'mine':
          break
        default:
          break
      }
    }
  },
  computed: {},
  mounted() {
    this.initWeather()
  },
  // 下拉刷新
  async onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    setTimeout(() => {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
    }, 500)
    this.initWeather()
  }
}
</script>

<style scoped>
.weather {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(http://5b0988e595225.cdn.sohucs.com/images/20180507/c6e5c35c506848139685683db881a154.jpg);
  background-size: 100% 100%;
  font-weight: 400;
  color: #fff;
}

.weather::after {
  content: '';
  position: fixed;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
}

.center {
  text-align: center;
}

.today {
  width: 40%;
  height: 120px;
  margin-left: 5%;
  margin-top: 20px;
  float: left;
}

.today.right {
  width: 50%;
  margin-left: 0;
}

.today p,
.forecast p {
  margin-top: 5px;
}

.nowspan {
  font-size: 40px;
  float: right;
  margin-right: 20px;
  margin-top: 18px;
}

.city {
  font-size: 20px;
  text-align: center;
}

.loc {
  margin-left: 6px;
}

.big-img {
  width: 80px;
  height: 80px;
  color: #fff;
}

.small-img {
  width: 45px;
  height: 45px;
}

.forecast {
  margin-top: 160px;
  padding: 0 40px;
  font-size: 14px;
}

.forecast li {
  display: inline-block;
  width: 100px;
  padding-top: 20px;
  text-align: center;
}

.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
}

.clearfix:after {
  clear: both;
  overflow: hidden;
}

.tips {
  font-size: 14px;
  padding: 15px 20px;
}

.tips span {
  color: #ff9900;
}

.scroll-view {
  height: 200px;
  white-space: nowrap;
  overflow-x: scroll;
}
</style>


