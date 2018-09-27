function EndPoint(_method, _uri, _price) {
  return {
    method: _method,
    uri: _uri,
    price: _price
  }
}

function Dbot(_address, _name, _domain, _endPoints) {
  return {
    addr: _address,
    name: _name,
    domain: _domain,
    endPoints: _endPoints
  }
}


function ChannelInfo() {

}

function MsgParam() {

}

function MsgResponse() {

}

exports = module.exports = {
  EndPoint,
  Dbot,
  ChannelInfo,
  MsgParam,
  MsgResponse
}
