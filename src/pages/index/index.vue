<template>
  <div class="container">

    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <form class="form-container">
      <i-input type="text" v-model="username" title="账号" placeholder="请输入用户名" ></i-input>
      <i-input type="password" v-model="password" title="密码" placeholder="请输入密码"></i-input>
      <i-button type="primary" @click="login">登 录</i-button>
    </form>
  </div>
</template>

<script>
import card from '@/components/card'
export default {
  data () {
    return {
      username: '13163377929',
      password: '123456',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    async login () {
      let data = {
        key: '00d91e8e0cca2b76f515926a36db68f5',
        phone: this.username,
        passwd: this.password
      }
      await this.$net.post('login', data).then(res => {
        if (res.code === 200) {
          const url = '../news/main'
          wx.navigateTo({ url })
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

</style>
