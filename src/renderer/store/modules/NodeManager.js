var os = require('os').platform();
var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
const fse = require('fs-extra');
import {rmdir, readFileSync} from 'fs';
import {OntAssetTxBuilder, RestClient, Crypto, TransactionBuilder} from 'ontology-ts-sdk'
import * as DB from '../../../core/dbService'
import { delay, getTxtype, queryClaimableONG } from '../../../core/util.js'
const gasPrice = localStorage.getItem('GasPrice') ? parseInt(localStorage.getItem('GasPrice')) : 0;
const restClient = new RestClient('http://127.0.0.1:20334')

// local accounts
const accounts = JSON.parse(readFileSync(__static + '/privateKey.json').toString())
accounts.forEach((item) => {
    item.balance = {
        ont: 0,
        ong: 0
    }
})
const state = {
    currentHeight: 0,
    accounts,
    nodeStatus : 0 // 0 - stopped; 1 - starting; 2 - running
}
const mutations = {
    UPDATE_CURRENT_HEIGHT(state, payload) {
        state.currentHeight = payload.currentHeight;
    },
    UPDATE_NODE_RUNNING(state, payload) {
        state.nodeStatus = payload.nodeStatus;
    }
}

const actions = {
    startNode({dispatch, commit}) {
        dispatch('showLoading')
        commit('UPDATE_NODE_RUNNING', {nodeStatus: 1});
        let nodeProcess;
        let command = '';
        if (os === 'darwin') {
            command = `./ontology-darwin-amd64 --rest --ws --localrpc --gaslimit 20000 --gasprice ${gasPrice} --testmode -p 1`
            nodeProcess = exec(command, {
                cwd: __static
            })
        } else if (os === 'linux') {
            command = `./ontology-linux-amd64 --rest --ws --localrpc --gaslimit 20000 --gasprice ${gasPrice} --testmode -p 1`
            nodeProcess = exec(command, {
                cwd: __static
            })
        } else if (os === 'win32') {
            command = 'ontology-windows-amd64.exe'
            nodeProcess = execFile(command, ['-p=1', `--gasprice=${gasPrice}`, '--testmode'], {
                cwd: __static
            })
        }

        nodeProcess.stdout.on('data', (data) => {
            console.log(data.toString())
            commit('ADD_LOG_DATA', { data: data.toString() })
            if(data.toString().indexOf('open log file') > -1) {// No admin authorization
                alert('Please run "Solo Chain" as administrator.')
                return;
            }
        })
        sessionStorage.setItem('Node_PID', nodeProcess.pid)


        //handle sync node
        const intervalIdOld = parseInt(sessionStorage.getItem('SyncNode_Interval'))
        clearInterval(intervalIdOld);
        // dispatch('syncNode')
        const intervalId = setInterval(() => {
            dispatch('syncNode')
        }, 6000)
        sessionStorage.setItem('SyncNode_Interval', intervalId)
        // setTimeout(() => {
            
        // }, 1000)

        // transfer to itself
        const accounts = JSON.parse(readFileSync(__static + '/privateKey.json').toString())
        const from = accounts[0].address
        const privateKey = accounts[0].privateKey
        setTimeout(() => {
            dispatch('transferAsset', {from, to:from, asset: 'ONT', amount: 1, privateKey })
            dispatch('hideLoading')
        }, 1000)
        setTimeout(() => {
            queryClaimableONG(from).then(res => {
                if(parseInt(res)>0) {
                    dispatch('withdrawONG', {from, to: from , amount: res, privateKey});
                }
            })
        }, 6000)

    },
    transferSelf({commit}) {
        const accounts = JSON.parse(readFileSync(__static + '/privateKey.json').toString())
        const account = new Crypto.Address(accounts[0].address)
        const privateKey = new Crypto.PrivateKey(accounts[0].privateKey)
        const tx = OntAssetTxBuilder.makeTransferTx('ONT', account, account, 1, `${gasPrice}`, '20000', account);
        TransactionBuilder.signTransaction(tx, privateKey);
        restClient.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        }).catch(err=>{
            console.log('[transferSelf] error: ' + err)
        });
    },
    transferAsset({commit}, {from, to, asset, amount, privateKey}) {
        const fromAddr = new Crypto.Address(from)
        const toAddr = new Crypto.Address(to)        
        const pri = new Crypto.PrivateKey(privateKey)
        const tx = OntAssetTxBuilder.makeTransferTx(asset, fromAddr, toAddr, amount, `${gasPrice}`, '20000', fromAddr);
        TransactionBuilder.signTransaction(tx, pri);
        restClient.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        }).catch(err => {
            console.log('[transferAsset] error: ' + err)
        });
    },
    withdrawONG({commit}, {from, to, amount, privateKey}) {
        const fromAddr = new Crypto.Address(from)
        const toAddr = new Crypto.Address(to)
        const pri = new Crypto.PrivateKey(privateKey)
        const tx = OntAssetTxBuilder.makeWithdrawOngTx(fromAddr, toAddr, amount, fromAddr, `${gasPrice}`, '20000');
        TransactionBuilder.signTransaction(tx, pri);
        restClient.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        }).catch(err => {
            console.log('[widhtdrawONG] error: '+  err)
        });
    },
    stopNode({commit}) {
        if (sessionStorage.getItem('Node_PID')) {
            try {
                process.kill(parseInt(sessionStorage.getItem('Node_PID')))
            } catch(err) {
                console.log(err)
            }
            sessionStorage.removeItem('Node_PID')
            const intervalId = parseInt(sessionStorage.getItem('SyncNode_Interval'))
            clearInterval(intervalId);
        }
        commit('UPDATE_NODE_RUNNING', { nodeStatus: 0 })
    },
    async rebootNode({dispatch, commit}) {
        dispatch('showLoading')
        await dispatch('stopNode')
        //delete db
        await dispatch('removeDB');
        //delete files
        const path1 = __static + '/Chain/'
        const path2 = __static + '/Log/'
        try {
            await fse.remove(path1)
            await fse.remove(path2)
        } catch(err) {
            console.log(err);
            throw err;
        }
        
        //clear cache
        sessionStorage.removeItem('Node_PID');
        localStorage.removeItem('Current_Height')
        // start node
        await dispatch('startNode');
        await dispatch('fetchDataAfterReboot');
        dispatch('hideLoading');
    },
    async syncNode({commit}) {
        console.log('sync node')
        let currentHeight = localStorage.getItem('Current_Height') || 0;
        currentHeight = parseInt(currentHeight)
        let height;
        try {
            height = (await restClient.getBlockHeight()).Result
        } catch(err) {
            console.log('[syncNode] error: ' + err)
        }
        if(height){
            commit('UPDATE_CURRENT_HEIGHT', {currentHeight: height});
            commit('UPDATE_NODE_RUNNING', {nodeStatus: 2})
        } else {
            commit('UPDATE_CURRENT_HEIGHT', { currentHeight: 0 });
            commit('UPDATE_NODE_RUNNING', { nodeStatus: 0 })
        }
        if (currentHeight <= height) {
            for (let i = currentHeight; i <= height; i++) {
                const block = (await restClient.getBlockJson(i)).Result
                if (block && block.Transactions && block.Transactions.length === 0) {
                    continue;
                }
                const event = (await restClient.getSmartCodeEvent(i)).Result
                const blockData = {
                    height: i,
                    hash: block['Hash'],
                    txNum: block.Transactions.length,
                    json: block
                }
                DB.dbInsert(DB.blockDB, blockData).then(() => { }, (err) => { console.log(err) })
                if (event && event.length > 0) {
                    for (const tx of event) {
                        const eventData = {
                            height: i,
                            hash: tx['TxHash'],
                            json: tx
                        }
                        DB.dbInsert(DB.eventDB, eventData).then(() => { }, (err) => { console.log(err) })
                    }
                }
                if (block && block.Transactions && block.Transactions.length > 0) {
                    console.log(block.Transactions)
                    for (const tx of block.Transactions) {
                        const type = getTxtype(tx["TxType"])
                        if (type === 'Deploy') {
                            const deploy = tx.Payload
                            const contract = Crypto.Address.fromVmCode(deploy.Code);
                            const contractHash = contract.toHexString();
                            const scData = {
                                height: i,
                                contractHash,
                                name: deploy.Name,
                                version: deploy.CodeVersion,
                                author: deploy.Author,
                                email: deploy.Email,
                                needStorage: deploy.NeedStorage ? 'true': 'false',
                                desc: deploy.Description
                            }
                            DB.dbInsert(DB.scDB, scData).then(() => { }, (err) => { console.log(err) })
                        }
                        const txData = {
                            type: type,
                            hash: tx["Hash"],
                            height: i,
                            json: tx
                        }
                        DB.dbInsert(DB.txDB, txData).then(() => { }, (err) => { console.log(err) })
                    }
                }

            }
        }
        localStorage.setItem('Current_Height', height)
    }
}

export default {
    state,
    mutations,
    actions
}
