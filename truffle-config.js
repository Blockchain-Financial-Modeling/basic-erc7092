const path = require("path");
const HDWalletProvider = require('./client/node_modules/@truffle/hdwallet-provider');
require('./client/node_modules/dotenv').config();

const MNEMONIC = process.env.REACT_APP_MNEMONIC;
const GOERLI_KEY = process.env.REACT_APP_GOERLI_KEY;

console.log('MNEMONIC:', MNEMONIC);
console.log('KEY:', GOERLI_KEY);

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${GOERLI_KEY}`),
      network_id: 5,
      gas: 4500000
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }

};