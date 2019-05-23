
<div align="center">
  <img src="https://raw.githubusercontent.com/punicasuite/solo-chain/master/image/icon.png" height="200" width="200">
  <h2 class="doc-title">Solo Chain</h2>
</div>

Solo Chain is a one-click local blockchain deployment service, designed for Ontology developmen. It is available for both Windows and Mac. Solo Chain is part of the Punica Suite, which you can read more about in the [official documentation](http://dev-docs.ont.io/#/docs-en/Punica/punica).

#### Content:
- [Overview](#solo-chain-overview)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)

## Solo Chain Overview
Solo Chain is a desktop application for developers to quickly setup and manage their own private instance of the Ontology blockchain for rapid development. With Solo Chain, there are no dependencies to install, source code to compile, or Docker image to setup. It is packaged with [Electron](http://electronjs.org) and provides users with an intuitive GUI interface to setup and manage all aspects of their private Ontology blockchain instance.

The Solo Chain application allows you to:
- Start, Stop, and Restart your private instance.
- Provides all of the available RPC, REST, and WebSocket server interfaces present with the Ontology MainNet and TestNet
- Facilitates account to account asset transfers and claims
- Extremely detailed block, transaction, and event monitoring for debugging
- List of deployed smart contracts
- Verbose network activity logging
- Customizable network configurations, such as the ability to adjust the gas price

## Installation

### Download Release
You can download the latest release of Solo Chain for Windows and Mac in the [release section](https://github.com/punicasuite/solo-chain/releases).

### Build from Source
If you would like to compile the application yourself from the source repo, you are free to do that as well.
- Clone the repo `git clone git@github.com:punicasuite/solo-chain.git`
- Install dependencies `yarn install`
- Compile application `yarn build`
- Navigate to the `release` folder and open the appropriate desktop installer (dmg or exe)

#### Run for Development
To run Solo Chain on your local machine for development of Solo Chain:
- Clone the repo `git clone git@github.com:punicasuite/solo-chain.git`
- Install dependencies `yarn install`
- Run application `yarn dev`

This will install and compile all required dependencies and source code, and spin up a local server to host the local codebase at `localhost:9080`. As you make changes to the codebase in the ./src folder, the application will update without reloading.

## Getting started
For a full guide on using Solo Chain you can read the [getting started guide](./getting-started.md).

## Contributing
Contributors are welcome to `Solo Chain`. Before beginning, please take a look at our contributing guidelines. You can open an issue by [clicking here](https://github.com/punicasuite/solo-chain/issues/new).

If you have any issues getting setup, open an issue or reach out in the [Ontology Discord](https://discordapp.com/invite/4TQujHj).
