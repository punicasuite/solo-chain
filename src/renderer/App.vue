<template>
  <div id="app">
    <top-navbar></top-navbar>

    <router-view></router-view>
  </div>
</template>

<script>
import TopNavbar from './components/TopNavbar'
const sudo = require('sudo-prompt')
const fs = require('fs')
const options = {
    name: 'Solo Chain',
    // icns: '../../../build/icon.ions'
  }

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
    },
    methods: {
      startNode() {
        const hasChmod = localStorage.getItem('hasChmod') || false;
        if(hasChmod !== 'true') {
          return;
        }
        this.$store.dispatch('startNode')
      },
      stopNode() {
        this.$store.dispatch('stopNode')
      },
      chmodOntology() {
        if(os === 'win32') {
          localStorage.setItem('hasChmod', true);
          return;
        }
        const hasChmod = localStorage.getItem('hasChmod') || false;
        if(hasChmod === 'true') {
          console.log('已授权。');
          return;
        }
        
        let ontologyPath = '';
        if(os === 'linux') { 
          ontologyPath = __static + '/ontology-linux-amd64'
        } else if(os === 'darwin') {
          ontologyPath = __static + '/ontology-darwin-amd64'
        }
        ontologyPath = ontologyPath.replace(/(\s+)/g, '\\$1')

        // if(!fs.existsSync(ontologyPath)) {
        //   localStorage.setItem('hasChmod', true);
        //   console.log('没有未授权文件。')
        //   this.startNode() //尝试启动
        //   return;
        // }

        const command = 'chmod +x ' + ontologyPath
        
        sudo.exec(command, options, (error, stdout, stderr) => {
          if(error) {
            console.log(error)
            this.$message.warning('Please grant the permission.')
            this.chmodOntology()
            return;
          }

          console.log('stdout: ' + stdout)
          localStorage.setItem('hasChmod', true);
          console.log('授权成功。')
          // this.startNode()
          window.location.reload();
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
    overflow: hidden;
  }

p {
  margin:0;
}
</style>
