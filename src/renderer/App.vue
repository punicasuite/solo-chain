<template>
  <div id="app">
    <top-navbar></top-navbar>

    <router-view></router-view>
  </div>
</template>

<script>
import TopNavbar from './components/TopNavbar'
const sudo = require('sudo-prompt')


var os = require('os').platform()
  export default {
    name: 'solo_chain',
    data() {
      return {
        intervalId: ''
      }
    },
    components: {
      TopNavbar
    },
    beforeMount(){
      this.chmodOntology()
    },
    mounted(){
      this.startNode()
    },
    beforeDestroy() {
      this.stopNode();
      clearInterval(this.intervalId);
    },
    methods: {
      startNode() {
        this.$store.dispatch('startNode')
        setTimeout(()=>{
          this.$store.dispatch('syncNode')
          this.intervalId = setInterval(()=>{
            this.$store.dispatch('syncNode')
          },6000)
        }, 1000)
      },
      stopNode() {
        this.$store.dispatch('stopNode')
      },
      chmodOntology() {
        const hasChmod = localStorage.getItem('hasChmod') || false;
        if(hasChmod === 'true') {
          console.log('已授权。');
          return;
        }
        if(os === 'win32') {
          return;
        }
        const command = 'chmod +x ' + this.ontologyPath
        
        sudo.exec(command, options, (error, stdout, stderr) => {
          if(error) throw error
          console.log('stdout: ' + stdout)
          localStorage.setItem('hasChmod', true);
          console.log('授权成功。')
        })
      },
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
    height:100%;
    overflow: scroll;
  }

p {
  margin:0;
}
</style>
