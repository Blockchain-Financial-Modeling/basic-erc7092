const path = require("path");
const HDWalletProvider = require('./client/node_modules/@truffle/hdwallet-provider');

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    }
  },
  compilers: {
    solc: {
      version: "0.8.7"
    }
  }

};