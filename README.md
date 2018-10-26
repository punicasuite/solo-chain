# Solo chain

<div align="center">
  <img src="https://raw.githubusercontent.com/punicasuite/solo-chain/master/image/icon.png" height="200" width="200"><br><br>
</div>

Solo chain is One click Blockchain, is your personal blockchain for Ontology development.

This project base on Ontology Blockchain [release](https://github.com/ontio/ontology/releases), run in test mode.


> An electron-vue project


<div align="center">
  <img src="https://raw.githubusercontent.com/punicasuite/solo-chain/master/image/solo_chain.png" ><br><br>
</div>


## Getting started
You can download a self-contained prebuilt binary for your platform from this repository's [releases](https://github.com/punicasuite/solo-chain/releases) page.



### Main interface

When you launch Solo chain, the screen will show some details about the server, and also list out a number of accounts. Each account is given private key. Having ether automatically in all accounts allows you to focus on developing your application.


There are four pages available:

* The Accounts page shows the accounts generated and their balances. This is the default view.
* The Blocks page shows each block on the blockchain, along with transactions.
* The Transactions page lists all transactions run against the blockchain.
* The Events page shows the smart contract events.
* The Smart contract page shows the smart contract whitch have been deployed.
* The Logs page shows the logs for the server, which is useful for debugging.


### Settings
You can change some features of the generated blockchain through the Settings pages, accessed by the gear icon in the top right corner.


### How to build by source code?

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

### Package

Use electron-builder to package.

> Need to change the Ontology binary files to orignal files before package.

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[cf53551](https://github.com/SimulatedGREG/electron-vue/tree/cf53551a209b49220525e7de80f1c541d7096aef) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
