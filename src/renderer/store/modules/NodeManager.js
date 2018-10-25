var os = require('os').platform();
var execFile = require('child_process').execFile;
var exec = require('child_process').exec;
import {rmdir, readFileSync} from 'fs';
import {OntAssetTxBuilder, RestClient, Crypto, TransactionBuilder} from 'ontology-ts-sdk'
import * as DB from '../../../core/dbService'
import { delay, getTxtype, queryClaimableONG } from '../../../core/util.js'
const gasPrice = localStorage.getItem('GasPrice') ? parseInt(localStorage.getItem('GasPrice')) : 0;
const state = {

}
const mutations = {}

const actions = {
    startNode({dispatch, commit}) {
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
        })
        sessionStorage.setItem('Node_PID', nodeProcess.pid)

        //handle sync node
        const intervalId = parseInt(sessionStorage.getItem('SyncNode_Interval'))
        clearInterval(intervalId);
        setTimeout(() => {
            dispatch('syncNode')
            const intervalId = setInterval(() => {
                dispatch('syncNode')
            }, 6000)
            sessionStorage.setItem('SyncNode_Interval', intervalId)
        }, 1000)

        // transfer to itself
        const accounts = JSON.parse(readFileSync(__static + '/privateKey.json').toString())
        const from = accounts[0].address
        const privateKey = accounts[0].privateKey
        setTimeout(() => {
            dispatch('transferAsset', {from, to:from, asset: 'ONT', amount: 1, privateKey })
        }, 100)
        setTimeout(() => {
            queryClaimableONG(from).then(res => {
                if(parseInt(res)>0) {
                    dispatch('withdrawONG', {from, to: from , amount: res, privateKey});
                }
            })
        }, 5000)

    },
    transferSelf({commit}) {
        const accounts = JSON.parse(readFileSync(__static + '/privateKey.json').toString())
        const account = new Crypto.Address(accounts[0].address)
        const privateKey = new Crypto.PrivateKey(accounts[0].privateKey)
        const tx = OntAssetTxBuilder.makeTransferTx('ONT', account, account, 1, `${gasPrice}`, '20000', account);
        TransactionBuilder.signTransaction(tx, privateKey);
        const rest = new RestClient('http://127.0.0.1:20334');
        rest.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        });
    },
    transferAsset({commit}, {from, to, asset, amount, privateKey}) {
        const fromAddr = new Crypto.Address(from)
        const toAddr = new Crypto.Address(to)        
        const pri = new Crypto.PrivateKey(privateKey)
        const tx = OntAssetTxBuilder.makeTransferTx(asset, fromAddr, toAddr, amount, `${gasPrice}`, '20000', fromAddr);
        TransactionBuilder.signTransaction(tx, pri);
        const rest = new RestClient('http://127.0.0.1:20334');
        rest.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        });
    },
    withdrawONG({commit}, {from, to, amount, privateKey}) {
        const fromAddr = new Crypto.Address(from)
        const toAddr = new Crypto.Address(to)
        const pri = new Crypto.PrivateKey(privateKey)
        const tx = OntAssetTxBuilder.makeWithdrawOngTx(fromAddr, toAddr, amount, fromAddr, `${gasPrice}`, '20000');
        TransactionBuilder.signTransaction(tx, pri);
        const rest = new RestClient('http://127.0.0.1:20334');
        rest.sendRawTransaction(tx.serialize(), false).then(res => {
            console.log(res);
        });
    },
    stopNode() {
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
    },
    rebootNode({dispatch, commit}) {
        dispatch('stopNode')
        //delete db
        dispatch('removeDB');
        //delete files
        const command1 = 'rm -rf '  + 'Chain/';
        const command2 = 'rm -rf '  + 'Log/';
        exec(command1, {
            cwd: __static
        }, (err, stdout, stderr) => {
            if(err) throw err;
        })
        exec(command2, {
            cwd: __static
        }, (err, stdout, stderr) => {
            if (err) throw err;
        })
        //clear cache
        sessionStorage.removeItem('Node_PID');
        localStorage.removeItem('Current_Height')
        // start node
        dispatch('startNode');
    },
    async syncNode() {
        console.log('sync node')
        const rest = new RestClient('http://127.0.0.1:20334');
        let currentHeight = localStorage.getItem('Current_Height') || 0;
        currentHeight = parseInt(currentHeight)
        const height = (await rest.getBlockHeight()).Result
        if (currentHeight < height) {
            for (let i = currentHeight; i <= height; i++) {
                const block = (await rest.getBlockJson(i)).Result
                if (block && block.Transactions && block.Transactions.length === 0) {
                    continue;
                }
                const event = (await rest.getSmartCodeEvent(i)).Result
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
                                contractHash,
                                name: deploy.name,
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
            localStorage.setItem('Current_Height', height)
        }
    }
}

export default {
    state,
    mutations,
    actions
}
