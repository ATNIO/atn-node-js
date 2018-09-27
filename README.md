# ATN Client 
### atn-node-js 
 简体中文 | [English](README.zh-EN.md)
 &emsp;&emsp;***atn-node-js*** 是基于 **Node** 和 **Web3** 独立开发的程序包，是 **ATN Client** 的一部分。**ATN Client** 是**ATN生态**的面向用户的重要一环，是连接 **DBotServer** 开发者和 **APP Developer** 的 "桥梁"。**ATN Client** 在 **ATN** 生态中所处位置如下图所示：

![atn-ecosystem](http://p5vswdxl9.bkt.clouddn.com/ATN%20ecosystem.png "ATN生态")

---

### ATN Client

**ATN Client**目前有以下两个版本：  
   - [atn-node-js](https://github.com/ATNIO/atn-node-js)：**Node**版本程序，本程序包Demo项目可参考[ATN Client Example](https://github.com/ATNIO/atn-client-example/tree/alpha#%E8%B0%83%E8%AF%95);  
   - [atn-js](https://github.com/ATNIO/atn-js)：浏览器端使用，结合[atn-wallet](https://github.com/ATNIO/atn-wallet)，使用`atn-wallet`自身的签名算法;
     
 未来会陆续提供 **Java**、**Python**等主流语言版本。

#### 简单使用：
-  初始化**DBotServer AI**服务调用通道：initChannel(dbotAddress, private_key)     
-  调用**DBotServer AI**服务：callDBotAI(dbotAddress, uri, method, option)

#### 具体使用：
-  创建**AI**调用通道： createChannel(receiverAddress, deposit)
-  获取**AI**通道信息： getChannelDetail(receiverAddress)
-  增加通道调用次数：topUpChannel(receiverAddress, value)
-  关闭**AI**调用通道： closeChannel(receiverAddress, balance, closeSignature)
-  调用**DBotServer AI**服务：callDBotAI(dbotAddress, uri, method, option)


### 快速开始   
&emsp;&emsp;我们精心准备了一个简单的示例：`ATN Client Example`([项目地址](https://github.com/ATNIO/atn-client-example))方便你快速开发使用 **atn-node-js**
 
#### 1. `AI Market` 上查询想要使用的 DBot AI 服务 
   🔗[AI Market地址](https://market-test.atnio.net)  
   例如：**百度NLP**
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
   
#### 2. 使用 `atn-node-js`  
   使用该包之前请确认本地已安装node环境(需要V8.0以上node版本)
   ```
   $ node --version 
   ```
   JS项目根目录安装atn-node-js
   ```markdown
   $ npm install atn-node-js --save
   ```
#### 3. 开发示例  
以下相关示例请参照[ATN Client Example](https://github.com/ATNIO/atn-client-example)
 * 3.1 简单使用   
  
   STEP 1：初始化DBotServer调用服务
   ```javascript
   // 代码片段引入
   // 1. 引入 atn-node-js 包
   var Atn = require('atn-node-js');
   var key = require('../atnconfig/user1');
   const atn = new Atn(key.key);
   
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303"
   var privateKeyFile = "/libs/atnconfig/user.json";//自定义私钥生成所在文件(包含目录)
  
   // 2. 初始化调用
   const result = await atn.initConfig(privateKeyFile, dbotAddress);
   
   ```
   ***注***：如果自己有私钥可增加参数如下所示
   ```javascript
   var privateKey = '0x01adc971225be058c7031b536375b79115ed58993c86a4ec4288f36fc9eb51b7'; 
   const result = await atn.initConfig(privateKeyFile, dbotAddress,privateKey);
   ```
   
   
   STEP 2：调用DBotServer
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
      // 3. 调用DBotServer AI服务
      const result = await atn.callDBotAI(dbotAddress,uri,method,option);
   ```

 * 3.2 具体使用开发示例   
 
   STEP 1：引入 **atn-node-js** 包，并在当前项目下配置个人账户私钥
   
   ```js
   //  引入atn-node-js包
   var Atn = require('atn-node-js');
   //  配置个人账户（当前开发目录下配置json文件）
   var key = require('../atnconfig/user1');
   //  创建atn对象   
   const atn = new Atn(key.key);
   //  设置DBotAddress地址
   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   ```
 
   STEP 2：创建DBotServer调用通道
   
   ```js
   // 代码片段  
   // 1. 引入 atn-node-js 包
   ...

   const deposit = 3e18  //可自定义
   // 2. 使用 步骤(1) 上查询的DBotServer 地址
   const result = await atn.createChannel(dbotAddress, deposit)
   ```  
   
   STEP 3：创建 **DBotServer** 调用通道
   
   ```js
   // 代码片段  
   // 1. 引入 atn-node-js 包
   ...
   
   // 2. 获取创建的调用通道信息
   const result = await atn.getChannelDetail(dbotAddress);
   ``` 
   
   STEP 4：调用指定地址的 **DBotServer AI** 服务
   
   ```js
   // 代码片段
   // 1. 引入 atn-node-js 包
   ...
   // 调用DBotServer AI 服务
   // 2. 设置请求参数（百度nlp请求示例）, option参数设置参见 callDBotAI参数具体详情
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
   // 3. 调用DBotServer AI服务
   const result = await atn.callDBotAI(dbotAddress,uri,method,option);
   
   ```
     
   STEP 5：增加通道调用次数
   
   ```js
   // 代码片段
   // 1. 引入 atn-node-js 包
   ... 

  
   var vaule = 10e18 ; //可自定义，按照单位可自己换算

   // 2. 增加调用次数
   const result = await  atn.topUpChannel(dbotAddress,vaule);
  
   ```
   
   STEP 6：关闭调用通道
   
   ```js
   // 代码片段
   // 1. 引入 atn-node-js 包
   ...

   const dbotAddress = "0xe4640e4005903e147ebb54dd9ddf17e85ce53303";
   var vaule = 10e18 ; //可自定义，按照单位可自己换算
   
   // 2. 关闭调用通道
   const result = await atn.closeChannel(dbotAddress,balance);
   ```
   
 
### 接口文档
* [atn-node-js](https://atnio.github.io/atn-js/classes/_atn_.atn.html)  


### 相关参考
* [mochajs](https://mochajs.org/#more-information)
