<style scoped>
.accounts-balance  p {
  margin-bottom:0px;
}
.accounts-showKey {
  font-size:20px;
}
</style>

<template>
  <div id="wrapper">
    <main>
      <!-- <div>
        <a-button @click="chmodOntology">授权节点</a-button>
        <a-button @click="showPrikey">写入私钥文件</a-button>
        <a-button @click="startNode">启动节点</a-button>
        <a-button @click="stopNode">结束节点</a-button>
        <a-button @click="withdrawONG">提取ONG</a-button>
        <a-button @click="syncBlock">同步区块</a-button>        
      </div> -->
      <a-table :columns="columns"
                :rowKey="record => record.address"
                :dataSource="data"
                :loading="loading"
            >
            <div slot="balance" slot-scope="text, record" class="accounts-balance">
              <p>ONT: {{record.balance.ont}}</p>
              <p>ONG: {{record.balance.ong}}</p>
            </div>
            <div slot="action" slot-scope="text, record" class="accounts-showKey" >
                <a  href="javascript:;" @click="showPrikey(record)">
                  <a-icon type="key" />
                </a>
            </div>
            </a-table>
    </main>
  
    <common-modal modalId="modal1" @modalOk="sysPassModalOk" title="Private key">
      <p>{{privateKey}}</p>
    </common-modal>
  </div>
</template>

<script>
  import * as DB from '../../core/dbService.js'
  import CommonModal from './common/CommonModal' 
  import electron from 'electron'
  import { readFileSync, writeFile } from 'fs';
  import {Wallet, Crypto, OntAssetTxBuilder, RestClient} from 'ontology-ts-sdk'
  import {delay, getTxtype} from '../../core/util.js'
  var os = require('os').platform()
  console.log(os)
  var execFile = require('child_process').execFile;
  var exec = require('child_process').exec;


  var nodeProcess;
// const app = electron.remote.app;
// const userData = app.getAppPath()
// console.log('appPath: ' + userData)
  const path = require('path')

  const options = {
    name: 'Solo Chain',
    // icns: '../../../build/icon.ions'
  }
  const url = 'http://127.0.0.1:20334'
  const rest = new RestClient(url)
  const columns = [
    {
      title: 'Address',
      dataIndex: 'address'
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      scopedSlots: {customRender: 'balance'}
    },
    {
      title: '',
      key: 'action',
      scopedSlots: {customRender:'action'}
    }
  ]
  export default {
    name: 'landing-page',
    components:{
      CommonModal
    },
    mounted(){
      localStorage.removeItem('Node_PID')
      this.loading = false;
    },
    beforeDestroy(){
      clearInterval(this.intervalId)
    },
    data() {
      const ontologyPath = path.join(__static, '/ontology-darwin-amd64')
      const accounts = JSON.parse(readFileSync(__static+'/privateKey.json').toString())
      const data = accounts.map((item)=>{
        return {
          ...item,
          balance:{
            ont: 0,
            ong: 0
          }
        }
      })
      return {
        columns,
        data,
        loading:false,
        passModal:false,
        ontologyPath,
        sysPass: '',
        intervalId: '',
        privateKey: ''
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      
      showPrikey(record){
        this.$store.commit('SHOW_COMMON_MODAL')
        this.privateKey = record.privateKey
      },
      sysPassModalOk(modalId) {
        console.log(modalId)
        this.$store.commit('HIDE_COMMON_MODAL')
      },
      withdrawONG() {
        // need to wait tranfer finish
        const command2 = 'cd ' + __static + ' && ./ontology-darwin-amd64 asset withdrawong 1'
          const process2 = exec(command2 ,(error, stdout, stderr) => {
            if(error) throw error;
            console.log(stdout)
          })
          process2.stdin.write('1\n')
      },
      
    }
  }
</script>

