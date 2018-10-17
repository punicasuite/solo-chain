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
  
    <common-modal modalId="modal1" @modalOk="sysPassModalOk">
      <p>Input admin's password:</p>
      <a-input v-model="sysPass"></a-input>
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
  const sudo = require('sudo-prompt')
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
    beforeMount(){
      this.chmodOntology()
    },
    mounted(){
      localStorage.removeItem('Node_PID')
      this.loading = false;
      this.startNode()
      this.queryBalance()
    },
    beforeDestroy(){
      clearInterval(this.intervalId)
    },
    data() {
      const hasChmod = localStorage.getItem('hasChmod') || false;
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
        hasChmod,
        sysPass: ''
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      chmodOntology() {
        if(this.hasChmod === 'true') {
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
      startNode() {
        let command = '';
        if(os === 'darwin') {
          command = './ontology-darwin-amd64 --rest --ws --localrpc --gaslimit 20000 --gasprice 0 --testmode'
          nodeProcess = exec(command, {
            cwd: __static
          })
        } else if (os === 'linux') {
          command = './ontology-linux-amd64 --rest --ws --localrpc --gaslimit 20000 --gasprice 0 --testmode'
          nodeProcess = exec(command, {
            cwd: __static
          })
        } else if (os === 'win32') {
          command = 'ontology-windows-amd64.exe'
          nodeProcess = execFile(commit, ['--gasprice=0', '--testmode'],{
            cwd: __static
          })

        }
        
        nodeProcess.stdout.on('data', (data) => {
          console.log(data.toString())
        })
        nodeProcess.stdin.write('1\n');
        nodeProcess.stdin.end();

        setTimeout(()=>{
          this.syncBlock()
          this.intervalId = setInterval(()=>{
            this.syncBlock()
          },6000)
        }, 1000)

      // transfer to itself
      setTimeout(()=>{
        const command1 = 'cd ' + __static + ' && ./ontology-darwin-amd64 asset transfer --from 1 --to 1 --amount 1'
        const process1 = exec(command1,(error, stdout, stderr) => {
          if(error) throw error;
          console.log(stdout)
        })
        process1.stdin.write('1\n');
      }, 500)

        console.log(nodeProcess)
        localStorage.setItem('Node_PID', nodeProcess.pid)
      },
      stopNode() {
        if(localStorage.getItem('Node_PID')) {
          process.kill(parseInt(localStorage.getItem('Node_PID')))
        }
      },
      showPrikey(){
        this.$store.commit()
      },
      queryBalance(){

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
      async syncBlock() {
        console.log('sync node')
        let currentHeight = localStorage.getItem('Current_Height') || 0;
        currentHeight = parseInt(currentHeight)
        const height = (await rest.getBlockHeight()).Result
        if(currentHeight < height) {
          for(let i=currentHeight+1; i<=height; i++) {
            const block = (await rest.getBlockJson(i)).Result
            const event = (await rest.getSmartCodeEvent(i)).Result
            const blockData = {
              height: i,
              hash: block['Hash'],
              txNum: block.Transactions.length,
              json: block
            }
            DB.dbInsert(DB.blockDB, blockData).then(()=>{}, (err)=>{console.log(err)})
            if(event && event.length > 0) {
              for(const tx of event) {
                const eventData = {
                  height: i,
                  hash: tx['TxHash'],
                  json: tx 
                }
                DB.dbInsert(DB.eventDB, eventData).then(()=>{}, (err)=>{console.log(err)})
              }
              
            }
            if(block && block.Transactions && block.Transactions.length > 0) {
              console.log(block.Transactions)
              for(const tx of block.Transactions) {
                const type = getTxtype(tx["TxType"])
                if(type === 'Deploy') {
                  const scData = {
                    height:i,
                    hash: tx['Hash'],
                    json:tx
                  }
                  DB.dbInsert(DB.scDB, scData).then(()=>{}, (err)=>{console.log(err)})
                }
                const txData = {
                  type: type,
                  hash: tx["Hash"],
                  height: i,
                  json: tx
                }
                DB.dbInsert(DB.txDB, txData).then(()=>{}, (err)=>{console.log(err)})
              }
            }
           
          }
          localStorage.setItem('Current_Height', height)
        }
        // const block = (await rest.getBlockJson(height)).Result
        // // alert(JSON.stringify(block))

        // const event = (await rest.getSmartCodeEvent(height)).Result
        // console.log(JSON.stringify(event))

      }
      
    }
  }
</script>

