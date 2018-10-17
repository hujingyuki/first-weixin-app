<template>
  <div>
    <div class="weather clearfix" v-if="!showCity">
      <div class="today center" v-if="dataArray.length > 0">
        <p>今日 {{dataArray[1].weekday}}</p>
        <p>{{dataArray[1].temperture}}</p>
        <p>{{dataArray[1].type}}</p>
        <p>{{dataArray[1].fengxiang + dataArray[1].fengli}}</p>
      </div>
      <div class="today">
        <img :src="!!dataArray[1] ? dataArray[1].img :'https://cdn.heweather.com/cond_icon/999.png'" class="big-img"/>
        <div class="city" @click="goCity" >
          <i-icon type="coordinates_fill" class="loc-icon"/>
          <text class="loc">{{cityName}}</text>
        </div>
      </div>
      <ul class="forecast">
        <li v-for="(item,index) in dataArray" :key='index' v-if="index!=1">
          <img :src="item.img" class="small-img"/>
          <span>{{ item.date }}</span>
          <span>{{ item.type }}</span>
          <span>{{ item.temperture }}</span>
          <span>{{ item.fengxiang + item.fengli}}</span>
        </li>
      </ul>
    </div>
    <div class="tabcity" v-if="showCity">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cityName: '北京',
      showCity: false,
      dataArray: []
    }
  },
  methods: {
    goCity() {
      this.showCity = true;
    },
    initWeather() {
      this.$net.get('weatherApi',{city:this.cityName}).then(res => {
        if (res.code == 200) {
          try {
            let resData = res.data;
            //昨日数据处理
            resData.yesterday.fengxiang = resData.yesterday.fx;
            resData.yesterday.fengli = resData.yesterday.fl.replace('<![CDATA[','').replace(']]>','');
            resData.yesterday.temperture = this.temperture(resData.yesterday);
            resData.yesterday.img = this.getImageUrl(resData.yesterday);
            this.dateFormat(resData.yesterday);
            console.log('yesterday', resData.yesterday);
            this.dataArray.push(resData.yesterday);
            //预报数据处理
            for(let i = 0; i < resData.forecast.length; i++){
              this.dateFormat(resData.forecast[i]);
              resData.forecast[i].temperture = this.temperture(resData.forecast[i]);
              resData.forecast[i].img = this.getImageUrl(resData.forecast[i]);
              resData.forecast[i].fengli = resData.forecast[i].fengli.replace('<![CDATA[','').replace(']]>','');
            }
            this.dataArray = this.dataArray.concat(resData.forecast);
            this.cityName = resData.city;
            console.log('all',this.dataArray);
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    getImageUrl(source) {
      let url = 'https://cdn.heweather.com/cond_icon/',reCode = 999;
      if(!!source) {
        reCode = this.$imgCode(source.type);
      }
      url += reCode;
      if (new Date().getHours() >= 18 && reCode !== 999) {
        url += 'n';
      }
      url += '.png';
      return url
    },
    temperture(data) {
      let temp = '';
      if(!!data) {
        temp = data.low.replace('低温 ','') + '~' + data.high.replace('高温 ','');
      }
      console.log(temp);
      return temp;
    },
    dateFormat(data) {
      if(!!data){
        let dateA = data.date.split('日');
        data.day = dateA[0];
        data.weekday = dateA[1];
      }
    }
  },
  computed: {
    
  },
  mounted () {
    this.initWeather();
  }

}
</script>

<style scoped>
.weather {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(http://5b0988e595225.cdn.sohucs.com/images/20180507/c6e5c35c506848139685683db881a154.jpg);
  /* background-image: url(http://i9.download.fd.pchome.net/t_600x1024/g1/M00/0E/18/ooYBAFUQwnyILmmaAAKiJrdovCIAACXDQOoGiEAAqI-844.jpg ); */
  background-size:100% 100%;
  font-weight: 400;
  color: #FFF;
}

.weather::after{
  content: '';
  position: fixed;
  top: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background:rgba(0,0,0,.4);
}

.center {
  text-align: center;
}

.today {
  width:42.5%;
  height:120px;
  margin-left:5%;
  margin-top:20px;
  float: left;
}

.today p{
  margin-top: 5px;
}

.city {
  margin-left: 30px;
  font-size: 20px;
}

.loc { 
  margin-left: 6px;
}

.loc-icon[style] {
  font-size: 20px !important;
}

.big-img {
  margin-left: 20px;
  width: 80px;
  height: 80px;
  color: #fff;
}

.small-img {
  width: 16px;
  height: 16px;
}

.forecast {
  margin-top: 160px;
  padding: 0 5%;
  font-size: 14px;
}

.forecast li{
  margin-top: 5px;
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
</style>


