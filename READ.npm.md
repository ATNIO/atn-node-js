atn-node-js is for building browser AIapps & NodeJS services that interact with ATN Network.

![atn-node-js architecture](http://p5vswdxl9.bkt.clouddn.com/atn-node-js-2.svg)

### This JS Client contains the following methods

- [x] createChannel
- [x] getChannelInfo
- [x] getChannelDetail
- [x] topUpChannel
- [x] closeChannel
- [x] callDBotAI
- [x] callAPI
- [x] requestCloseSignature

- [x] initConfig
- [x] initAccount
- [x] signBalanceProof
- [x] getDBotName
- [x] getDBotDomain
- [x] getPrice
- [x] waitTx
- [x] privateKeyToAccount
- [x] unlockAccountsIfNeeded
- [x] asyncSleep
- [x] getBalanceProofData
- [x] handlerDBotDomain

### Getting started

node version required:  v8.11.3 or above

Clone this repository and install its dependencies:

```
$ npm i atn-node-js --save
```


### NPM script
"test": "mocha --timeout 5000",
    "generate-docs-version": "rm -rf docs && jsdoc --configure .jsdoc.json --verbose",
    "jsdoc-minami-docs": "rm -rf docs && jsdoc src/atn.js -d docs generate-doc/minami",
    "": 
 - `npm run test`: Run test suite
 - `npm run generate-docs-version`: generate the `atn-node-js` API documents by jsdoc  
 - `npm run deploy-docs`: Run linting and generate coverage


### Usage

**Step 1:**
Create calling channel between account and DBot  
`atn.createChannel()`

**Step 2:**
Getting calling channel information from DBotServer  
`atn.getChannelDetail()`

**Step 3:**
Use the calling channel to call DBot Server AI services  
`atn.callDBotAI()`

**Step 4:**
Increase the calling times , you can topup the balance to the channel  
`atn.topUpChannel()`

**Step 5:**
Get your balance back from channel 
`atn.closeChannel()`



#### reference
* [mochajs](https://mochajs.org/#more-information)
