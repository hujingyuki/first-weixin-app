import Vue from 'vue'
import App from './index'
import computedImgCode from '@/utils/weather'

Vue.prototype.$imgCode = computedImgCode
const app = new Vue(App)
app.$mount()
