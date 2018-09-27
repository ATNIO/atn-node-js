natn-js is for building browser AIapps & NodeJS services that interact with ATN Network.

![atn-js architecture](http://p5vswdxl9.bkt.clouddn.com/ATN-js.svg)

### This JS Client contains the following methods

- [ ] createChannel
- [ ] getChannelInfo
- [ ] getChannelDetail
- [ ] topUpChannel
- [ ] closeChannel
- [ ] callDBotAI
- [ ] callAPI
- [ ] requestCloseSignature

- [ ] initConfig
- [ ] initAccount
- [ ] signBalanceProof
- [ ] getDBotName
- [ ] getDBotDomain
- [ ] getPrice
- [ ] waitTx
- [ ] privateKeyToAccount
- [ ] unlockAccountsIfNeeded
- [ ] asyncSleep
- [ ] getBalanceProofData
- [ ] handlerDBotDomain

### Getting started

node version required:v8.11.3

Clone this repository and install its dependencies:

```
git clone https://github.com/ATNIO/atn-js.git

cd atn-js

npm i
```

### NPM script

- `npm run build` builds the library to `dist`

	* `dist/lib/atn.js` A CommonJS bundle, suitable for use in Node.js, that requires the external dependency. This corresponds to the "main" field in package.json
	* `dist/atn.es5.js` an ES module bundle, suitable for use in other people's libraries and applications, that imports the external dependency. This corresponds to the "module" field in package.json
	* `dist/atn.umd.js` a UMD build, suitable for use in any environment (including the browser, as a <script> tag), that includes the external dependency. This corresponds to the "browser" field in package.json

 - `npm t`: Run test suite
 - `npm start`: Run `npm run build` in watch mode
 - `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
 - `npm run test:prod`: Run linting and generate coverage
 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code

### Usage

**Step 1:**
Getting all Dbot count
`atn.getDbotCount()`

**Step 2:**
Getting a Dbot detail 
`atn.getDbotInfo()`

**Step 3:**
Opening a transfer channel
`atn.openChannel()`

**Step 4:**
Calling the AI`lib.callAI()`



#### reference
* [mochajs](https://mochajs.org/#more-information)
