<template>
  <i_tab_bar :current="currentMeun" color="#2b85e4" :fixed="true" @change="handleChange($event)">
    <i_tab_bar_item key="homepage" icon="homepage" current-icon="barrage_fill" title="首页"></i_tab_bar_item>
    <i_tab_bar_item key="weather" icon="group" current-icon="dynamic_fill" title="天气"></i_tab_bar_item>
    <i_tab_bar_item key="remind" icon="remind" current-icon="remind_fill" title="通知"></i_tab_bar_item>
    <i_tab_bar_item key="mine" icon="mine" current-icon="mine_fill" title="我的"></i_tab_bar_item>
  </i_tab_bar>
</template>

<script>
import i_tab_bar from '../../static/iview/tab-bar/index';
import i_tab_bar_item from '../../static/iview/tab-bar-item/index'
export default {
  components: {
    i_tab_bar, i_tab_bar_item
  },
  data() {
    return {
      currentMeun: 'homepage'
    }
  },
  methods: {
    handleChange(ev){
      this.currentMeun = ev.target.key;
      let url;
      switch(this.currentMeun){
        case "homepage":
          url = '../pages/news/main';
          wx.redirectTo({url});
          break;
        case "weather":
          url = '../pages/weather/main';
          wx.redirectTo({url});
          break;
        case "remind":
          break;
        case "mine":
          break;
        default:break;
      }
    }
  }
}
</script>

