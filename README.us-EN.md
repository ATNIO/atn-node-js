# ATN Client 
### atn-node-js 
English | [简体中文](README.md)   
 &emsp;&emsp;***Atn-node-js*** is a library based on **Node** and **Web3**, and is also part of the **ATN Client**. As a key component of **ATN** ecosystem, **ATN Client** connects **DBot developer** and **Application Developer**, and the following figure shows the relations.
：

![atn-ecosystem](http://p5vswdxl9.bkt.clouddn.com/ATN%20ecosystem.png "ATN ecosystem")

---

### ATN Client

So far, **ATN Client** has Node version and TypeScript version：  
   - [atn-node-js](https://github.com/ATNIO/atn-node-js): this is node version lib ;  
   - [atn-js](https://github.com/ATNIO/atn-js)：used in browser ，we can use with the sign method in [atn-wallet](https://github.com/ATNIO/atn-wallet) 
     
     
 In the future ,we will provide main programming language like **Java**,**Python** and so on . 

#### Simple usage：
-  initConfig(privateKeyFile, dbotAddress): to initialize the Channel of a DBot AI service .
-  callDBotAI(dbotAddress, uri, method, option): to call the AI service from a DBot

#### Detail usage：
-  createChannel(receiverAddress, deposit): to create AI calling channel 
-  getChannelDetail(receiverAddress): get information of AI channel
-  topUpChannel(receiverAddress, value): top-up to the channel, to increase the number of callings
-  closeChannel(receiverAddress, balance, closeSignature): close the DBot AI channel
-  callDBotAI(dbotAddress, uri, method, option): call DBot AI service


### Quick start   
&emsp;&emsp; We prepare a simple example `ATN Client Example`([Project Address](https://github.com/ATNIO/atn-client-example)), to demonstrate how to use **atn-node-js** in the development .
 
#### 1. Search for a **DBot AI** service in the `AI Market`
   🔗AI Market:[link](https://market-test.atnio.net)  
   For instance,: Baidu NLP API 
   ```javascript
   dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303"
   ``` 
   ```javascript
   uri = '/lexer'
   ```
   ```javascript
   method = "post"
   ```
   ![AI Market](http://p5vswdxl9.bkt.clouddn.com/AI_market_ui.png "AI Market UI")	
   
#### 2. Use `atn-node-js`  
   Before using this library, make sure you have successfully installed the node (version 8.0 or later).
   ```
   $ node --version 
   ```
   Then Install the atn-node-js at the root directory of the JS project
   ```markdown
   $ npm install atn-node-js --save
   ```
#### 3. Development Example   

The following example is in [ATN Client Example](https://github.com/ATNIO/atn-client-example) project

 * 3.1 Simple Usage
  
   STEP 1：Initialize the DBot Server AI service
   ```javascript
   // Code Snippets
   // 1. Import atn-node-js lib
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');
   const atn = new Atn(key.key);
   
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303"
   var privateKeyFile = "/libs/atnconfig/user.json";//you can define your own filename  and filepath
  
   // 2. Init the condition before calling DBot Server AI
   const result = await atn.initConfig(privateKeyFile, dbotAddress);
   
   ```
   ***Notice***：If you have private key ,you can use this method like this:
   ```javascript
   var privateKey = '0x01adc971225be058c7031b536375b79115ed58993c86a4ec4288f36fc9eb51b7'; 
   const result = await atn.initConfig(privateKeyFile, dbotAddress,privateKey);
   ```
   
   
   STEP 2：Call the DbotServer
   ```javascript
   
   var option = {
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          responseEncoding: "GBK",
          method: "post",
          data: { text: "百度是一家高科技公司" }
      };
      var uri = '/lexer';
      var method = 'post';
      // 3. Call DBotServer AI Service
      const result = await atn.callDBotAI(dbotAddress,uri,method,option);
   ```

 * 3.2 Detail Usage   
 
   STEP 1：Import the **atn-node-js** lib ，and plugin your own private key in your project
   
   ```js
   //  Import the atn-node-js lib
   var Atn = require('atn-node-js');
   //  Config your  private key json file
   var key = require('../atnconfig/user1');
   //  create atn Object   
   const atn = new Atn(key.key);
   //  set the DBot Address 
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   ```
 
   STEP 2：Create a channel to call DBot Server AI service 
   
   ```js
   // Code Snippets : 
   // 1. Import the atn-node-js lib
   ...

   const deposit = 3e18  // you can define the variable by yourself 
   // 2. Use the DBotServer address which queried on AI Market 
   const result = await atn.createChannel(dbotAddress, deposit)
   ```  
   
   STEP 3：Get the channel from **DBotServer**
   
   ```js
   // Code Snippets :
   // 1. Import the atn-node-js lib
   ...
   
   // 2. Get channel infomation from DBotServer
   const result = await atn.getChannelDetail(dbotAddress);
   ``` 
   
   STEP 4：Call the DBotServer AI Service
   
   ```js
   // Code Snippets :
   // 1. Import the atn-node-js lib
   ...
   // Call DBotServer AI Service
   // 2. The request params config like Baidu NLP
   var option = {
     headers: {
         "Content-Type": "application/json;charset=UTF-8"
       },
       responseEncoding: "GBK",
       method: "post",
       data: { text: "Baidu is a high-tech company" }
   };
   var uri = '/lexer';
   var method = 'post';
   // 3. Call DBotServer AI Service
   const result = await atn.callDBotAI(dbotAddress,uri,method,option);
   
   ```
     
   STEP 5：Top-up into the channel

   ```js
   // Code Snippets 
   // 1. Import the atn-node-js lib
   ... 

  
   var vaule = 10e18 ; //you can define the value by yourself

   // 2. increate the usage times of DBotServer AI services 
   const result = await  atn.topUpChannel(dbotAddress,vaule);
  
   ```
   
   STEP 6：Close the channel
   
   ```js
   // Code Snippets
   // 1. Import the atn-node-js lib
   ...

   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   var vaule = 10e18 ; //you can define the value by yourself
   
   // 2. Close the channel
   const result = await atn.closeChannel(dbotAddress,balance);
   ```
   
 
### API Document
* [atn-node-js](https://atnio.github.io/atn-js/classes/_atn_.atn.html)  


### Reference
* [mochajs](https://mochajs.org/#more-information)
