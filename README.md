# atn-node-js 
atn-node-js is for building browser AIapps & NodeJS services that interact with ATN Network.

![atn-node-js architecture](https://github.com/ATNIO/AI_market_plan/blob/master/images/ATN-JS.svg)

### 方法简介

简单使用：
-  初始化DBotServer AI服务调用通道：initChannel(dbotAddress, private_key)
-  调用DBotServer AI服务：callDbotApi(dbotAddress, uri, method, option)

具体使用：
-  创建AI调用通道：createChannel(receiverAddress, deposit)
-  获取AI通道信息： getChannelDetail(receiverAddress)
-  增加通道调用次数：topUpChannel(receiverAddress, value)
-  关闭AI调用通道：closeChannel(receiverAddress, balance, closeSignature)
-  调用DBotServer AI服务：callDBotAI(dbotAddress, uri, method, option)

### 快速起步   



 
1. `AI Market` 上查询想要使用的AI服务：(AI Market🔗)[https://market-test.atnio.net]  
   例如：
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
   
2. 使用`atn-node-js`

   ```javascript
   $ npm install atn-node-js 
   ```
   
3. 开发示例  
 * 3.1  简单使用  
   STEP 1：初始化DBotServer调用服务
   ```javascript

   ```
   
   STEP 2：调用DBotServer
   ```javascript
   

   ```

 * 3.2 具体使用开发示例  
   STEP 1：创建DBotServer调用通道
   ```javascript
   // 代码片段  
   // 1. 引入 atn-node-js 包
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');
   
   ...

   const deposit = 3e18  //可自定义
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303"
   
   
   // 2. 使用 步骤(1) 上查询的DBotServer 地址
   const result = await atn.createChannel(dbotAddress, deposit)
   return result
   ```  
   
   STEP 2：创建DBotServer调用通道
   ```javascript
   //1. 引入 atn-node-js 包
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');
  
   ...
   
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303"
   //2. 获取创建的调用通道信息
   const result = await atn.getChannelDetail(dbotAddress);
   ``` 
   
   STEP 3：调用指定地址的DBotServer服务
   ```javascript
   //1. 引入 atn-node-js 包
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');
   
   ...
   
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   // 调用DBotServer AI 服务
   //2. 设置请求参数（百度nlp请求示例）
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
   //3. 调用DBotServer AI服务
   const result = await atn.callDbotApi(dbotAddress,uri,method,option);
   
   ```
   
   STEP 4：增加通道调用次数
   ```javascript
   // 1. 引入 atn-node-js 包
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');

   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   var vaule = 10e18 ; //可自定义，按照单位可自己换算

   // 2. 增加调用次数
   const result = await  atn.topUpChannel(dbotAddress,vaule);
  
   ```
   
   STEP 5：关闭调用通道
   ```javascript
   // 1. 引入 atn-node-js 包
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   var vaule = 10e18 ; //可自定义，按照单位可自己换算
   
   // 2. 关闭调用通道
   const result = await atn.closeChannel(dbotAddress,balance);
   ```
   

### 

#### reference
* [Nodejs单元测试](https://segmentfault.com/a/1190000002921481)
* [mochajs](https://mochajs.org/#more-information)
