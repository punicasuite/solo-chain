import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/accounts',
      name: 'Accounts',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/accounts'
    },
    {
      path: '/transactions',
      name: 'TransactionList',
      component: require('@/components/TransactionList').default
    },
    {
      path: '/blocks',
      name: 'BlockList',
      component: require('@/components/BlockList').default
    },
    {
      path: '/events',
      name: 'EventList',
      component: require('@/components/EventList').default
    },
    {
      path: '/scs',
      name: 'ScList',
      component: require('@/components/ScList').default
    },
    {
      path: '/logs',
      name: 'Logs',
      component: require('@/components/Logs').default
    },
  ]
})
