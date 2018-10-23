import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { Button, Modal, message, Table, Icon, Popconfirm } from 'ant-design-vue';
import JsonViewer from 'vue-json-viewer'

Vue.component(Button.name, Button)
Vue.component(Modal.name, Modal)
Vue.component(Table.name, Table)
Vue.component(Icon.name, Icon)
Vue.component(Popconfirm.name, Popconfirm)

Vue.use(JsonViewer)



Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success
Vue.prototype.$info = Modal.info
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
