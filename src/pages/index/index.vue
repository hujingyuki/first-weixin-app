<template>
  <div>
    <!-- 新闻部分 -->
    <div v-if="currentMeun =='news'">
      <scroll-view :scroll-x="true" :scroll-left="scrollLeft" class="tab-scroll">
        <span v-for="(item, index) in newsTypes" :key="index" @click="changeType(index)" :class="['tab-item',currentBar == index ? 'active' :'']">{{item.desc}}</span>
      </scroll-view>
      <swiper :current="currentBar" @change="handleSwiper" class="swiper">
        <swiper-item v-for="(swiperitem, swiperIndex) in newsTypes" :key="swiperIndex">
          <scroll-view class="scroll" :scroll-y="true">
            <ul class="container log-list">
              <li v-for="(news, index) in newsData[swiperitem.name]" :key="index" class="log-item" @click="goNewsDetail(news.link)">
                <i-card :title="news.title" :thumb="!!news.picInfo[0]?news.picInfo[0].url:''">
                  <view slot="content">{{news.digest}}</view>
                  <view slot="footer">{{news.source}}</view>
                </i-card>
              </li>
            </ul>
          </scroll-view>
        </swiper-item>
      </swiper>
    </div>
    <!-- 天气预报部分 -->
    <div  v-if="currentMeun =='weather'" class="weather clearfix">
      <div class="today center" v-if="weatherArray.length > 0">
        <p>今日 {{weatherArray[1].weekday}}</p>
        <p>{{weatherArray[1].temperture}}</p>
        <p>{{weatherArray[1].type}}</p>
        <p>{{weatherArray[1].fengxiang + weatherArray[1].fengli}}</p>
      </div>
      <div class="today right">
        <img :src="!!weatherArray[1] ? weatherArray[1].img :'https://cdn.heweather.com/cond_icon/999.png'" class="big-img"/>
        <span class="nowspan">{{nowTemp}}℃</span>
        <div class="city" @click="goToCity" >
          <i-icon type="coordinates_fill" size="20"/>
          <text class="loc">{{cityName}}</text>
        </div>
      </div>
      <ul class="forecast">
        <scroll-view class="scroll-view" :scroll-x="true">
          <li v-for="(item,index) in weatherArray" :key='index' v-if="index!=1">
            <p>{{ item.weekday }}</p>
            <p><img :src="item.img" class="small-img"/></p>
            <p>{{ item.type }}</p>
            <p>{{ item.temperture }}</p>
            <p>{{ item.fengxiang + item.fengli}}</p>
          </li>
        </scroll-view>
      </ul>
      <p class="tips"><span>温馨提示：</span>{{tips}}</p>
    </div>
    <!-- 热门段子 -->
    <div v-if="currentMeun =='satin'" class="satin">
      <scroll-view :scroll-x="true" :scroll-left="scrollLeft" class="tab-scroll">
        <span v-for="(item, index) in satinTypes" :key="index" @click="currentSatin=index" :class="['tab-item',currentSatin == index ? 'active' :'']">{{item}}</span>
      </scroll-view>
      <swiper :current="currentSatin" @change="handleSwiper" class="swiper">
        <swiper-item v-for="(swiperitem, swiperIndex) in satinTypes" :key="swiperIndex">
          <scroll-view :scroll-y="true" class="satin-scroll" @scrolltolower="initSatin(1)">
            <div class="satin-box" v-for="(satin,index) in satinData" :key="index">
              <div class="pulisher align">
                <image class="pulisher-img" :src="satin.header" :lazy-load="true"/>
                <span class="pulisher-name">{{ satin.username }}</span>
              </div>
              <div class="content">
                <p class="content-text">{{satin.text}}</p>
                <view>
                  <image v-if=" satin.type == 'image' || satin.type == 'video' " :src="satin.thumbnail" :lazy-load="true" mode="aspectFill" @click="preview(satin.thumbnail)"/>
                  <!-- <image v-if="satin.type=='video'" :src="satin.thumbnail" :lazy-load="true" mode="aspectFill" @click="playVideo(satin.uid)"/>
                  <video v-if="showVideo" :src="satin.video" :id="satin.uid"></video> -->
                </view>
              </div>
              <div class="comments">
                <p class="comments-like"><i-icon type="collection_fill" />{{satin.up}}<i-icon type="collection" />{{satin.down}}</p>
                <p class="commenter align">
                  <image class="comments-img" :src="satin.top_commentsHeader" :lazy-load="true"/>
                  <span class="comments-name">{{ satin.top_commentsName }}</span>
                </p>
                <p class="first-comments">
                  <i-icon type="interactive" />
                  {{satin.top_commentsContent}} 
                </p>
              </div>
            </div>
          </scroll-view>
        </swiper-item>
      </swiper>
    </div>
    <i-tab-bar :current="currentMeun" color="#2b85e4" :fixed="true" @change="handleChange">
      <i-tab-bar-item key="news" icon="barrage" current-icon="barrage_fill" title="新闻"></i-tab-bar-item>
      <i-tab-bar-item key="weather" icon="dynamic" current-icon="dynamic_fill" title="天气"></i-tab-bar-item>
      <i-tab-bar-item key="satin" icon="emoji" current-icon="emoji_fill" title="段子"></i-tab-bar-item>
      <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
    </i-tab-bar>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index';

export default {
  data () {
    return {
      newsData: {},
      newsTypes: [],
      currentBar: 0,
      currentMeun: 'news',
      cityName: "",
      scrollLeft: 0,
      weatherArray: [],
      tips: '',
      nowTemp: '',
      satinData:[],
      currentSatin: 0,
      satinTypes:['推荐','文字','照片','GIF','视频'],
      showVideo: false,
      pageIndex: 1
    }
  },

  methods: {
    // 点击底部菜单
    handleChange(ev){
      if (this.currentMeun != ev.target.key){
        this.reloadData(ev.target.key);
      }
      this.currentMeun = ev.target.key;
    },
    // 重载各个页面的数据
    reloadData(page) {
      switch(page){
        case "news":
          wx.setNavigationBarTitle({title:'新闻列表'});
          this.getNews();
          break; 
        case "weather":
          wx.setNavigationBarTitle({title:'天气预报'});
          this.initWeather();
          break;
        case "satin":
          wx.setNavigationBarTitle({title:'热门段子'});
          this.initSatin();
          break;
        case "mine":
          break;
        default:break;
      }
    },
    // 获取新闻数据
    async getNews() {
      await this.$net.get('journalismApi').then(res =>{
        wx.hideNavigationBarLoading();
        if (res.code === 200) {
          this.newsData = res.data;
          try {
            for (let item in this.newsData) {
              let titleItem = {};
              titleItem.name = item;
              titleItem.desc = this.newsData[item][0].category;
              this.newsTypes.push(titleItem);
            }
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    // 点击新闻标签动作
    changeType(index) {
      this.currentBar = index;
    },
    // 新闻页面左右滑动
    handleSwiper(ev){
      if(this.currentMeun=='news'){
        this.currentBar = ev.mp.detail.current;
        //超过6个tab后滚动tab标签
        if(this.currentBar > 6) {
          this.scrollLeft = 50;
        }
      } else if(this.currentMeun=='satin') {
        this.satinData = [];
        this.currentSatin = ev.mp.detail.current;
        this.initSatin();
      }
    },
    //查看新闻详情 未发布出去的不支持
    goNewsDetail(link){
      let url = '../newsDetail/main?link=' + link;
      wx.navigateTo({url});
    },
    // 选择城市
    goToCity() {
      let url = '../location/main';
      wx.navigateTo({url});
    },
    // 获取天气数据
    async initWeather() {
      await this.$net.get('weatherApi',{city:this.cityName}).then(res => {
        wx.hideNavigationBarLoading();
        if (res.code == 200) {
          this.weatherArray = [];//清空数据
          try {
            let resData = res.data;
            this.tips = resData.ganmao;
            this.nowTemp = resData.wendu;
            //昨日数据处理
            resData.yesterday.fengxiang = resData.yesterday.fx;
            resData.yesterday.fengli = resData.yesterday.fl.replace('<![CDATA[','').replace(']]>','');
            resData.yesterday.temperture = this.temperture(resData.yesterday);
            resData.yesterday.img = this.getImageUrl(resData.yesterday);
            this.dateFormat(resData.yesterday);
            this.weatherArray.push(resData.yesterday);
            //预报数据处理
            for(let i = 0; i < resData.forecast.length; i++){
              this.dateFormat(resData.forecast[i]);
              resData.forecast[i].temperture = this.temperture(resData.forecast[i]);
              if(i == 0){
                resData.forecast[i].img = this.getImageUrl(resData.forecast[i],true);
              }else{
                resData.forecast[i].img = this.getImageUrl(resData.forecast[i]);
              }
              resData.forecast[i].fengli = resData.forecast[i].fengli.replace('<![CDATA[','').replace(']]>','');
            }
            this.weatherArray = this.weatherArray.concat(resData.forecast);
            //this.cityName = resData.city;
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    // 获取天气图片
    getImageUrl(source,istoday) {
      let url = 'https://cdn.heweather.com/cond_icon/',reCode = 999;
      if(!!source) {
        reCode = this.$imgCode(source.type);
      }
      url += reCode;
      if (istoday && new Date().getHours() >= 18 && reCode !== 999) {
        url += 'n';
      }
      url += '.png';
      return url
    },
    // 处理温度数据
    temperture(data) {
      let temp = '';
      if(!!data) {
        temp = data.low.replace('低温 ','') + '~' + data.high.replace('高温 ','');
      }
      return temp;
    },
    // 处理天气日期
    dateFormat(data) {
      if(!!data){
        let dateA = data.date.split('日');
        data.day = dateA[0];
        data.weekday = dateA[1];
      }
    },
    // 加载段子数据
    async initSatin(isRefresh) {
      wx.showLoading();
      if(isRefresh){
        this.pageIndex += 1;
      } else {
        this.pageIndex = 1;
      }
      await this.$net.get('satinGodApi',{type: this.currentSatin + 1,page:this.pageIndex}).then(res => {
        if (res.code == 200) {
          if(isRefresh){
            this.satinData= this.satinData.concat(res.data);
          } else {
            this.satinData = res.data;
          }
          // console.log(this.satinData);
        }
        wx.hideLoading();
      })
    },
    // 预览图片
    preview(src) {
      wx.previewImage({
		  	current: src, // 当前显示图片的http链接
		  	urls: [src] // 需要预览的图片http链接列表
		  })
    },
    // 播放视频
    playVideo(uid) {
      this.showVideo = true;
      let videoContext = wx.createVideoContext(uid);
      videoContext.play();
    }
  },
  mounted () {
    this.getNews();
  },
  // 下拉刷新
  async onPullDownRefresh() {
    // 停止下拉刷新
    wx.stopPullDownRefresh();
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.reloadData(this.currentMeun);
  },
  onShow(){
    let newCity = wx.getStorageSync('location')
    if(newCity !== this.cityName){
      this.initWeather();
      this.cityName = newCity;
    }
  }
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 10rpx;
}

.log-item {
  margin: 5rpx;
}
.swiper,
.scroll,
.satin-scroll {
  height: 500px;
}

.swiper {
  padding-top: 50px;
}

.tab-scroll {
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 40px;
  background: #F7F7F7;
  font-size: 16px;
  white-space: nowrap;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
}

.tab-item {
  margin:0 30rpx;
  display: inline-block;
}

.tab-item.active {
  color: #4675F9;
  position: relative;
}

.tab-item.active:after {
  content: "";
  display: block;
  height: 3px;
  width: 40px;
  background: #4675F9;
  position: absolute;
  bottom: 0;
  left: -5px;
  border-radius: 3px;
}

.weather {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(http://5b0988e595225.cdn.sohucs.com/images/20180507/c6e5c35c506848139685683db881a154.jpg);
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
  width:40%;
  height:120px;
  margin-left:5%;
  margin-top:20px;
  float: left;
}

.today.right {
  width: 50%;
  margin-left: 0;
}

.today p,
.forecast p{
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

.forecast li{
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

.tips{
  font-size: 14px;
  padding: 15px 20px;
}

.tips span{
  color: #ff9900;
}

.scroll-view {
  height: 200px;
  white-space: nowrap;
  overflow-x: scroll;
}

.satin-box{
  margin:0 16px;
  font-size:14px;
  overflow:hidden;
  position:relative;
  background:#fff;
  border:1rpx solid #dddee1;
  border-radius:5px;
  margin-bottom: 10px;
}

.pulisher {
  height: 32px;
  line-height: 32px;
  margin-top: 6px;
}

.pulisher-img {
  width:30px;
  height:30px;
  border-radius:50%;
  margin-right:10px;
}

.pulisher-name,
.comments-name {
  width: 250px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  display: inline-block;
}

.content {
  margin-bottom: 10px;
}

.content image,
.content video {
  width: 280px;
  height: 200px;
  margin: 10px 15px;
}

.content-text,
.first-comments {
  margin:0 20px;
  text-indent: 2;
  padding-top: 10px;
}

.comments {
  margin-bottom: 15px;
}

.commenter {
  height: 24px;
  line-height: 24px;
}
.comments-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
}

.comments-like {
  text-align: right;
  margin-right:16px;
}

.align {
  display: flex;
  justify-content: center;
  align-items: center;
}

.more {
  float: right;
  margin-right: 16px;
}
</style>
