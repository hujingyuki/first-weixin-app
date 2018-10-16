<template>
  <div>
    <i-tabs :current="currentBar" scroll>
      <i-tab  v-for="(item, index) in newsTypes" :title="item" :key="index" @click="changeType(index)"></i-tab>
    </i-tabs>
    <ul class="container log-list">
      <li v-for="(news, index) in newsArray" :key="index" class="log-item">
       <i-card :title="news.title" :thumb="!!news.picInfo[0]?news.picInfo[0].url:''">
        <view slot="content">{{news.digest}}</view>
        <view slot="footer">{{news.source}}</view>
      </i-card>
      </li>
    </ul>
    <i-tab-bar :current="currentMeun" color="#f759ab">
      <i-tab-bar-item key="homepage" icon="homepage" current-icon="homepage_fill" title="首页"></i-tab-bar-item>
      <i-tab-bar-item key="group" icon="group" current-icon="group_fill" title="朋友"></i-tab-bar-item>
      <i-tab-bar-item key="remind" icon="remind" current-icon="remind_fill" title="通知"></i-tab-bar-item>
      <i-tab-bar-item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i-tab-bar-item>
    </i-tab-bar>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index';
import card from '@/components/card';

export default {
  components: {
    card
  },

  data () {
    return {
      resData: {},
      itemList: [],
      newsTypes: [],
      newsArray: [],
      currentBar: 0,
      currentMeun: 'homepage'
    }
  },

  methods: {
    // 获取新闻数据
    async getNews() {
      await this.$net.get('journalismApi').then(res =>{
        if (res.code === 200) {
          this.resData = res.data;
          try {
            for (let item in this.resData) {
              this.itemList.push(item);
              this.newsTypes.push(this.resData[item][0].category);
            }
            this.newsArray = this.resData[this.itemList[0]];
          } catch (error) {
            console.log(error);
          }
        }
      })
    },
    changeType(index) {
      this.currentBar = index;
      this.newsArray = this.resData[this.itemList[index]];
    }
  },
  
  mounted () {
    this.getNews();
  },
  
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
</style>
