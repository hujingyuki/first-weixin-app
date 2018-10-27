<template>
  <view class='list-warpper'>
    <view v-if="search"
          class='list-search'>
      <view class='list-search-box'>
        <icon type="search"
              size="15" />
        <input placeholder="输入您要搜索的城市"
               v-model.lazy="keyword" />
      </view>
      <button class='search-button'
              @click='searchMt'>搜索</button>
    </view>

    <block v-if="list.length != 0">
      <scroll-view :class="['list-scroll', search?'top':'']"
                   :style="{'height': windowHeight}"
                   scroll-y="true"
                   :scroll-into-view="jumpNum"
                   :scroll-with-animation="animation">
        <!-- 我的位置  -->
        <view v-if="myCity.name">
          <view class='list-title'>我的位置</view>
          <view class='list-horizontal'>
            <view class="list-name border"
                  @click="choose(myCity.name)">
              {{myCity.name}}
            </view>
          </view>
        </view>
        <view :id="'item'+index"
              v-for="(item,index) in list"
              :key="index">
          <view class='list-title'>{{item.title}}</view>
          <view :class='[index===0&&horizontal&&item.type==="hot"?"list-horizontal":""]'>
            <view :class='["list-name", idx === 0 ?"":"border"]'
                  v-for="(city,idx) in item.item"
                  :key="idx"
                  @click='choose(city.name)'>
              {{city.name}}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class='list-right-wrapper'>
        <view class='right-item'
              v-for="(right,index) in rightArr"
              :key="index"
              @click='jumpMt(index)'>
          {{right}}
        </view>
      </view>
    </block>
    <block v-else>
      <view class='nodata'>没有搜索到相关的数据哦</view>
    </block>
  </view>
</template>

<script>
import Citys from '@/utils/city'
import QQMapWX from '@/utils/qqmap-wx-jssdk.js'
let qqmapsdk
export default {
  data() {
    return {
      horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      cityData: Citys,
      list: [],
      rightArr: [], // 右侧字母展示
      jumpNum: '', //跳转到那个字母
      keyword: '',
      myCity: {
        name: '北京',
        latitude: '',
        longitude: ''
      }, // 默认我的城市
      windowHeight: 700
    }
  },
  onLoad: function() {
    let _this = this
    qqmapsdk = new QQMapWX({
      key: 'UL6BZ-MJJWJ-FVLFL-FN27W-IGM3E-F6BCD' //这里自己的key秘钥进行填充
    })
    wx.getSystemInfo({
      success: function(res) {
        _this.windowHeight = res.windowHeight + 'px'
      }
    })
  },
  mounted() {
    this.resetRight(this.cityData)
    if (this.myCity.name) {
      this.getCity()
    }
  },
  methods: {
    // 数据重新渲染
    resetRight(data) {
      let rightArr = []
      for (let i in data) {
        rightArr.push(data[i].title.substr(0, 1))
      }
      this.rightArr = rightArr
      this.list = data
    },
    getCity() {
      let _this = this
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          _this.locationMt(res.latitude, res.longitude)
        }
      })
    },
    // 右侧字母点击事件
    jumpMt(index) {
      this.jumpNum = 'item' + index
    },
    // 城市名称点击事件
    choose(name) {
      wx.setStorageSync('location', name)
      wx.navigateBack()
    },
    // 获取搜索输入内容
    input(e) {
      this.keyword = e.detail.value
    },
    // 基础搜索功能
    searchMt() {
      this._search()
    },
    _search() {
      console.log('搜索', this.keyword)
      let data = this.cityData
      let newData = []
      for (let i = 0; i < data.length; i++) {
        let itemArr = []
        for (let j = 0; j < data[i].item.length; j++) {
          if (data[i].item[j].name.indexOf(this.keyword) > -1) {
            let itemJson = {}
            for (let k in data[i].item[j]) {
              itemJson[k] = data[i].item[j][k]
            }
            itemArr.push(itemJson)
          }
        }
        if (itemArr.length === 0) {
          continue
        }
        newData.push({
          title: data[i].title,
          type: data[i].type ? data[i].type : '',
          item: itemArr
        })
      }
      this.resetRight(newData)
    },
    // 城市定位
    locationMt(latitude, longitude) {
      let _this = this
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function(res) {
          let city = res.result.ad_info.city
          if (city && city.indexOf('市') > -1) {
            _this.myCity.name = city.replace('市', '')
          } else {
            _this.myCity.name = city
          }
          _this.myCity.latitude = latitude
          _this.myCity.longitude = longitude
        },
        fail: function(res) {
          //console.log(res);
        },
        complete: function(res) {
          //console.log(res);
        }
      })
    }
  }
}
</script>

<style scoped>
.list-warpper {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.list-scroll {
  width: 100%;
  box-sizing: border-box;
}
.list-scroll.top {
  padding-top: 90rpx;
}

/* 样式控制  */

.list-title {
  background: #f5f5f5;
  color: #666;
  font-size: 36rpx;
  padding: 10rpx;
  padding-left: 30rpx;
  padding-top: 15rpx;
}

.list-name {
  position: relative;
  font-size: 28rpx;
  padding: 15rpx;
  padding-left: 30rpx;
  color: #999;
}

.list-name.border::after {
  content: '';
  position: absolute;
  left: 30rpx;
  right: 0;
  top: 0;
  height: 1px;
  background: #f5f5f5;
}

.list-right-wrapper {
  position: fixed;
  top: 100rpx;
  right: 20rpx;
  padding: 10rpx 0;
  border-radius: 20rpx;
  z-index: 2;
  background: #ddd;
}

.right-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rpx 10rpx;
  font-size: 26rpx;
  color: #666;
}

.list-search {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90rpx;
  padding: 10rpx 30rpx;
  box-sizing: border-box;
  z-index: 20;
  background: #fff;
}

.search-title {
  flex-shrink: 0;
  font-size: 28rpx;
  padding-right: 10rpx;
}

.list-search-box {
  display: flex;
  align-items: center;
  padding: 0 30rpx;
  width: 100%;
  height: 70rpx;
  background: #f5f5f5;
  border-radius: 90rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.list-search-box input {
  width: 100%;
  padding-left: 10rpx;
}

.search-button {
  /* width: 100rpx; */
  flex-shrink: 0;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 28rpx;
  margin-left: 10rpx;
}

/* 热门城市横排显示样式  */

.list-horizontal {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
  padding-right: 50rpx;
}

.list-horizontal .list-name {
  padding: 5rpx 20rpx;
  border: 1px #ccc solid;
  border-radius: 10rpx;
  margin: 10rpx;
  /* margin-right: 20rpx; */
}

/* 无数据  */
.nodata {
  padding-top: 200rpx;
  text-align: center;
  font-size: 32rpx;
  color: #ddd;
}
</style>


