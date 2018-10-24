import {RestClient, Crypto} from 'ontology-ts-sdk'
import {BigNumber} from 'bignumber.js'
const ONT_CONTRACT = '0000000000000000000000000000000000000001';
export function delay(s) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, s);
    })
}

export function getTxtype(type) {
    if(type === 0xd0) {
        return 'Deploy'
    } else if(type === 0xd1) {
        return 'Invoke'
    }
}

export function isNodeRunning() {
    const rest = new RestClient('http://127.0.0.1:20334');
    return rest.getBlockHeight().then(res => {
        return res ? true : false;
    }).catch(err => {
        return Promise.resolve(false)
    }) 
}

export function queryBalance(address) {
    const addr = new Crypto.Address(address);
    const rest = new RestClient('http://127.0.0.1:20334');
    return rest.getBalance(addr).then(res => {
        console.log(res)
        const result = res.Result
        if(result.ong) {
            result.ong = new BigNumber(result.ong).dividedBy(1e9).toString()
        }
        return res.Result
    }).catch(err => {
        return Promise.resolve({
            ont: 0,
            ong: 0
        })
    }) 
}

export function queryClaimableONG(address) {
    const addr = new Crypto.Address(address);
    const rest = new RestClient('http://127.0.0.1:20334');
    return rest.getAllowance('ong', new Crypto.Address(ONT_CONTRACT), addr).then(res => {
        console.log(res)
        const result = res.Result
        // if (result) {
            // result = new BigNumber(result.ong).dividedBy(1e9).toString()
        // }
        return result
    }).catch(err => {
        return Promise.resolve(0)
    }) 
}