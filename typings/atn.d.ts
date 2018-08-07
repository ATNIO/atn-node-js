import BN from 'bn.js'

export interface EndPoint {
  method: string
  uri: string
  price: number
}

export interface Dbot {
  id: number
  addr: string
  name: string
  domain: string
  endPoints: EndPoint[]
}

// export interface ChannelInfo {
//   state: string
//   block: number
//   deposit: BN
//   withdrawn: BN
// }

export interface AiResponse {
  code: string
  msg: string
  error: string
}

export interface Proof {
  balance: number
  sig?: string;
}

export interface MsgParam {
  type: string
  name: string
  value: string
}

export interface MsgResponse {
  code: string
  msg: string
  error: string
}


export interface ChannelInfo {
  receiver: string
  sender: string
  deposit: BN,
  open_block_number: BN,
  balance: BN,
  state: number,
  last_signature: string,
  settle_timeout: number,
  ctime: string,
  mtime: string,
  confirmed: number,
  unconfirmed_topups: {}
  // state: string
  // block: number
  // deposit: BN
}

export interface ChannelSettledArgs {
  senderAddress: string
  receiverAddress: string
  blockNumber: number
}

export interface AIParam {
  dbotAddress: string

}

