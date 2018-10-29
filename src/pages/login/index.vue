<template>
  <div class="container">

    <div class="userinfo">
      <img class="userinfo-avatar"
           v-if="userInfo.avatarUrl"
           :src="userInfo.avatarUrl"
           background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <form class="form-container">
      <i-input type="text"
<<<<<<< HEAD
               :value="username"
               title="账号"
               placeholder="请输入用户名"
               @change="input('username', $event)"></i-input>
      <i-input type="password"
               :value="password"
               title="密码"
               placeholder="请输入密码"
               @change="input('password', $event)"></i-input>
=======
               v-model="username"
               title="账号"
               placeholder="请输入用户名"
               @input='input("username",$event)'></i-input>
      <i-input type="password"
               v-model="password"
               title="密码"
               placeholder="请输入密码"
               @input='input("password",$event)'></i-input>
>>>>>>> c2c0ba2923cee0257c1e899b9893fc3f93f2cd0e
      <i-button type="primary"
                @click="login">登 录</i-button>
    </form>
  </div>
</template>

<script>
import card from '@/components/card'
export default {
  data() {
    return {
      username: '',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    input(name, ev) {
      this[name] = ev.mp.detail.detail.value
    },
    async login() {
      if (this.username && this.password) {
        let data = {
          key: '00d91e8e0cca2b76f515926a36db68f5',
          phone: this.username,
          passwd: this.password
        }
        await this.$net.post('login', data).then(res => {
          if (res.code === 200) {
            const url = '../index/main'
            wx.redirectTo({ url })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          title: '用户名或密码不能为空',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },

  created() {
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
