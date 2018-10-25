<style scoped>
.accounts-balance  p {
  margin-bottom:0px;
}
.accounts-showKey {
  font-size:20px;
}
.transfer-item {
  margin-bottom:15px;
}
.transfer-item label {
  margin-right:15px;
  font-weight: bold;
}
</style>

<template>
  <div id="wrapper">
    <main>
      <a-table :columns="columns"
                :rowKey="record => record.address"
                :dataSource="data"
                :loading="loading"
            >
            <div slot="balance" slot-scope="text, record" class="accounts-balance">
              <p>ONT: {{record.balance.ont}}</p>
              <p>ONG: {{record.balance.ong}}</p>
            </div>
            <div slot="operation" slot-scope="text, record" class="accounts-operation">
              <a-button @click="transfer(record)">Transfer</a-button>
              <a-button @click="redeemONG(record)">Redeem ONG</a-button>
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

<!-- for transfer -->
    <a-modal
            title="Transfer Asset"
            v-model="transferVisible"
            @ok="submitTransfer"
            @cancel="cancelTransfer"
            >
          <div>
            <div class="transfer-item">
              <label for="">Asset:</label>
              <a-select v-model="transferAsset" style="width: 120px" >
                    <a-select-option value="ONT">ONT</a-select-option>
                    <a-select-option value="ONG">ONG</a-select-option>
                </a-select>
            </div>
            <div class="transfer-item">
              <label for="">Sender:</label>
              <a-input v-model="transferFrom" disabled />
            </div>
            <div class="transfer-item">
              <label for="">Receiver:</label>
              <a-input v-model="transferTo"></a-input>
            </div>
            <div class="transfer-item">
              <label for="">Amount:</label>
              <a-input v-model="transferAmount"></a-input>
            </div>
          </div>
        </a-modal>
  </div>
</template>

<script>
  import * as DB from '../../core/dbService.js'
  import CommonModal from './common/CommonModal' 
  import {BigNumber} from 'bignumber.js'
  import electron from 'electron'
  import { readFileSync, writeFile } from 'fs';
  import {Wallet, Crypto, OntAssetTxBuilder, RestClient} from 'ontology-ts-sdk'
  import {delay, getTxtype, queryBalance, queryClaimableONG} from '../../core/util.js'
  import {mapState} from 'vuex'
  var os = require('os').platform()
  console.log(os)
  var execFile = require('child_process').execFile;
  var exec = require('child_process').exec;


  var nodeProcess;
// const app = electron.remote.app;
// const userData = app.getAppPath()
// console.log('appPath: ' + userData)
  const path = require('path')

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
      key: 'operation',
      scopedSlots: {customRender: 'operation'}
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
      setTimeout(()=>{
        this.updateBalance()
      }, 1000)
      this.intervalId = setInterval(()=>{
        this.updateBalance()
      }, 2000)
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
        privateKey: '',

        transferVisible: false,
        transferFrom: '',
        transferTo: '',
        transferAmount: '',
        transferAsset: 'ONT'
      }
    },
    computed:{
      ...mapState({
        isNodeRunning: state => state.NodeManager.isNodeRunning
      })
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
      async updateBalance() {
        if(!this.isNodeRunning) {
          return;
        }
        this.data.forEach(async (item) => {
          const res = await queryBalance(item.address)
          item.balance = res;
        })
      },
      async redeemONG(record) {
        const claimable = await queryClaimableONG(record.address);
        if(parseInt(claimable)>0){
          const from = record.address;
          const privateKey = record.privateKey
          this.$store.dispatch('withdrawONG', {from, to: from , amount: claimable, privateKey}).then(res => {
            this.$message.success('Redeem ONG succeed.')
          });
        } else {
          this.$message.warning('No claimable ONG for this address.')
          return;
        }
      },
      transfer(record) {
        this.transferVisible = true;
        this.transferFrom = record.address;
        this.transferPri = record.privateKey;
      },
      submitTransfer() {
        if(!this.transferTo || !this.transferAmount){
          return;
        }
        let amount = 0;
        if(this.transferAsset === 'ONG') {
          amount = new BigNumber(this.transferAmount).multipliedBy(1e9).toString();
        } else {
          amount = this.transferAmount;
        }
        const from = this.transferFrom;
        this.$store.dispatch('transferAsset', {from, to:this.transferTo, asset: this.transferAsset , amount, privateKey:this.transferPri }).then(res => {
          this.$message.success('Trasaction has been sent successfully.')
          this.transferVisible = false;
        })
      },
      cancelTransfer() {
        this.transferVisible = false;
      }
    }
  }
</script>

