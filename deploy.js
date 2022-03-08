/** @format */

// deploy code will go here

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const config = require('./config');
const INITIAL_STRING = 'Hello, World!';
const provider = new HDWalletProvider(config.getMnemonic(), config.getInfuraEndpoint());
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Deploying from account', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
