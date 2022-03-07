/** @format */

// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const { it, beforeEach, describe } = require('mocha');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hello, World!';
const TEST_UPDATE_STRING = 'Test update';

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: [INITIAL_STRING],
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });
});

describe('Inbox Test', () => {
  it('Validate deployment', () => {
    assert.ok(inbox.options.address);
  });
  it('Validate non-empty initial property', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });
  it('Validate setter and getter', async () => {
    const tx = await inbox.methods.setMessage(TEST_UPDATE_STRING).send({
      from: accounts[0],
      gas: '1000000',
    });
    assert.ok(tx);
    assert.equal(await inbox.methods.message().call(), TEST_UPDATE_STRING);
  });
});
