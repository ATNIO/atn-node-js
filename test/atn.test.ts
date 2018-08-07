///<reference path="../src/atn.ts"/>
import Atn from '../src/atn'
import any = jasmine.any
import { AxiosRequestConfig } from 'axios'

const axios = require('axios')
/**
 * ATN Jest Test
 */
describe('Atn Jest Test', () => {
  const timeout = 1000000

  const atn = new Atn('http://127.0.0.1:8545')

  // it('works if true is truthy', () => {
  //   expect(true).toBeTruthy()
  // })

  // DbotFactory Method Start Test

  // it('Atn DbotFactory is instantiable, IdToAddress Mapping Test', async () => {
  //   const a = new Atn('http://localhost:8545')
  //   const b = await a.idToAddress(0)
  //   console.log(b)
  //   expect(new Atn()).toBeInstanceOf(Atn)
  // })
  //
  // it('Atn DbotFactory is instantiable, Register Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const regi = new Atn('http://localhost:8545')
  //   const reg = await regi.register("0x25e582922911a093de00eb1a20334f761b87037a", "0x6c7986a0c46815495e592b1afca62b157027ee65")
  //   console.log(reg)
  // })
  //

  // Dbot Method Start Test  0x6c7986a0c46815495e592b1afca62b157027ee65
  // it('Atn Dbot is instantiable, ChangeName Method Test', async () => {
  //   jest.setTimeout(timeout)
  //
  //   const reg = await atn.changeName("0x123213213213", '0xb58b487d1c54f0d2e0a2a947dc2deea2056b6892',"0x6c7986a0c46815495e592b1afca62b157027ee65")
  //   console.log(reg)
  // })

  // it('Atn Dbot is instantiable, ChangeDomain Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const atn = new Atn('http://localhost:8545')
  //   const reg = await atn.changeDomain(
  //     "0x25e582922911a093de00eb1a20334f761b87037a",
  //     '0xb58b487d1c54f0d2e0a2a947dc2deea2056b6892' ,
  //     "0x6c7986a0c46815495e592b1afca62b157027ee65")
  //   console.log(reg)
  // })

  // it('Atn Dbot is instantiable, ChangeNameAndDomain Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const atn = new Atn('http://localhost:8545')
  //   const chagneNameAndDomain = await atn.changeNameAndDomain(
  //     "0x44444444441144444444441a20334f761b777777",
  //     "0x44444444441144444444441a20334f761b888888",
  //     '0xb58b487d1c54f0d2e0a2a947dc2deea2056b6892',
  //     "0x6c7986a0c46815495e592b1afca62b157027ee65")
  //   console.log(chagneNameAndDomain)
  // })
  //
  // it('Atn Dbot is instantiable, AddEndPoint Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const atn = new Atn('http://localhost:8545')
  //   const addEndPoint = await atn.addEndPoint("0x25e582922911a093de00eb1a20334f761b87037a", "0x25e582922911a093de00eb1a20334f761b87037b",
  //   "0x25e582922911a093de00eb1a20334f761b87037c", '0xb58b487d1c54f0d2e0a2a947dc2deea2056b6892',"0x6c7986a0c46815495e592b1afca62b157027ee65")
  //   console.log(addEndPoint)
  // })
  //
  console.log('+++++++++++++++++++++Dbot Method End Test+++++++++++++++++++++++++++++++++++++')

  // TransferChannel Method Start Test
  console.log(
    '+++++++++++++++++++++TransferChannel Method Query Start Test+++++++++++++++++++++++++++++++++++++'
  )
  //
  // it('0. Atn TransferChannel instantiable , Version Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const  result = await atn.getVersion('0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })

  // it('1. Atn TransferChannel instantiable , ChallengePeriod Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const  result = await atn.getChallengePeriod('0x36de05dd471040fc8ec6883c7665bac4d14af76f','0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })

  // it('2. Atn TransferChannel instantiable, ChannelDepositBugbountyLimit Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.getChannelDepositBugbountyLimit('0x36de05dd471040fc8ec6883c7665bac4d14af76f','0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })

  //0xa55ac5ebdb9bee5da90c5d4a6f104e5e2c116f97967ae2eb73f5fdfbdbb75bcb
  //0xd6d911e391c2a0c5d18bc1d6897e1eb22e9254735daa21a037f5978f00421f42
  // it('3. Atn TransferChannel instantiable, OpenChannel Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const createChannel = await atn.openChannel(
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     '888',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //
  //   console.log(createChannel)
  // })

  // it('4. Atn TransferChannel instantiable, GetKey Method Test ', async () => {
  //   jest.setTimeout(100000)
  //   const result = await atn.getKey(
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     111,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65'
  //   )
  //   console.log(result)
  // })

  // it('5. Atn TransferChannel instantiable, keyToChannels Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.keyToChannel(
  //     '0x6e8b8c625727262aa03262982525a0b5606b71f65a2c125e41b5f45a5df248ea',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })

  // it('6. Atn TransferChannel instantiable, getChannelInfo Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.getChannelInfo(
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     111,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   Promise.resolve(result).then(function(value) {
  //     console.log(value)
  //   })
  // })

  // it('7. Atn TransferChannel instantiable, keyCombineToChannelInfo Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.(
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     111,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   Promise.resolve(result).then(function(value) {
  //     console.log('test keyCombineToChannelInfo:' + value)
  //   })
  // })

  // it('7. Atn TransferChannel instantiable, withdraw Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.withdraw(
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     54,
  //     1231,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65'
  //   )
  //   console.log(result)
  // })

  // it('8. Atn TransferChannel instantiable, withdraw_balance Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.getWithdrawbalance(
  //     '0x6e8b8c625727262aa03262982525a0b5606b71f65a2c125e41b5f45a5df248ea',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })
  //
  //
  //
  //
  // it('9. Atn TransferChannel instantiable, get withdraw_balance Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.getWithdrawbalance(
  //     '0x6e8b8c625727262aa03262982525a0b5606b71f65a2c125e41b5f45a5df248ea',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })
  //
  // it('10. Atn TransferChannel instantiable, get closingRequests Method Test',async()=>{
  //   jest.setTimeout(timeout)
  //   const  result = await atn.getClosingRequests(
  //     '0x6e8b8c625727262aa03262982525a0b5606b71f65a2c125e41b5f45a5df248ea',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65'
  //   )
  //   console.log(result)
  // })
  //
  // it('11. Atn TransferChannel instantiable, uncooperativeClose Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.uncooperativeClose(
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     18,
  //     6888,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65'
  //   )
  //   console.log(result)
  // })

  // it('12. Atn TransferChannel instantiable, settleChannel Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const result = await atn.settleChannel(
  //     '0x845c0aaba0dabd59115c0601b429e23ec713cc80',
  //     18,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(result)
  // })

  console.log(
    '+++++++++++++++++++++TransferChannel Method Write Start Test+++++++++++++++++++++++++++++++++++++'
  )

  // it('Atn TransferChannel instantiable, TopUpChannel Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const topupChannel = await atn.topUpChannel(
  //     '0xf4f10da25f4bd2117f6f760471a4a4e176600a9b',
  //     4854,
  //     '230',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(topupChannel)
  // })
  //
  // it('Atn TransferChannel instantiable, TopUpDelegate Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const atn = new Atn('http://127.0.0.1:8545')
  //   const topUpDelegate = atn.topUpdateDelegateChannel(
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     '0xf4f10da25f4bd2117f6f760471a4a4e176600a9b',
  //     4854,
  //     '550',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65')
  //   console.log(topUpDelegate)
  // })

  //
  //
  // it('Atn TransferChannel instantiable, getOwnerAddress Method Test ', async () => {
  //   jest.setTimeout(timeout)
  //   var ownerAddress = await atn.getOwnerAddress('0xc562cc6b92d4e4a5de1f6ffa033c12b469ed0d8c')
  //   console.log(ownerAddress)
  // })

  // it('string test ', async () => {
  //   jest.setTimeout(100000)
  //   const channelURL: string = 'http://localhost:5000/api/v1/dbots'
  //   result:any = await axios.get(channelURL).then(res => {
  //     console.log(res)
  //   })
  //   console.log(
  //   )
  //
  // })

  it('Atn TransferChannel instantiable, CloseChannel Method Test', async () => {
    jest.setTimeout(timeout)
    const result = await atn.closeChannel(
      '0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd',
      '0x6c7986a0c46815495e592b1afca62b157027ee65',
      '0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd',
      933,
      20,
      '0x6c7986a0c46815495e592b1afca62b157027ee65'
    )
    console.log('jest test:', result)
  })

  // it('Atn TransferChannel instantiable, CallAI Method Test', async () => {
  //   jest.setTimeout(timeout)
  //   const option: AxiosRequestConfig = {}
  //   option.url = 'http://localhost:5000/api/v1/dbots/0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd/channels/0x6c7986a0c46815495e592b1afca62b157027ee65/933'
  //   //                dbotAddress: string,
  //   //                receiverAddress: string, senderAddress: string, blockNumber: number,
  //   //                balance: number, price: number, from: string,
  //   //                option: AxiosRequestConfig, opt?: any
  //   const result = await atn.callAI(
  //     '0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd',
  //     'POST',
  //     'facepp/v3/detect',
  //     '0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd',
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     10,
  //     80,
  //     10,
  //     '0x6c7986a0c46815495e592b1afca62b157027ee65',
  //     option
  //   )
  //
  // })

  // it('Test Axio Method ', async () => {
  //   jest.setTimeout(1000000)
  //   const config: AxiosRequestConfig = {}
  //   const result = await atn.requestAxio(config)
  // })
})
