<template>
  <div id="app">
    <top-navbar></top-navbar>

    <router-view></router-view>
  </div>
</template>

<script>
import TopNavbar from './components/TopNavbar'
  export default {
    name: 'solo_chain',
    components: {
      TopNavbar
    }
  }
</script>

<style>
  /* CSS */
  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
   @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    padding: 10px;
    width: 100vw;
    overflow: scroll;
  }

</style>
