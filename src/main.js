// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import './assets/css/element.scss'
import './assets/css/common.scss'
import './assets/css/font.scss'
import './assets/css/row.css'
import './assets/css/flex.scss'
import store from './store/index'
import filter from './filter/filter'
import {isTest} from './config/config'

Vue.use(filter)
Vue.use(Element, {size: 'small'})
Vue.config.productionTip = false

/*权限验证*/
router.beforeEach((to, form, next) => {
  if (isTest) {
    if (store.getters.isLogin) {
      next()
    } else {
      if (to.name != 'login') {
        store.dispatch({type: 'loginAction', routeName: to.name, params: to.params}).then(function () {
        })
      } else {
        next()
      }
    }
  } else {
    next()
  }

})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
