let iconv = require('iconv-lite');
module.exports = {
  dbot: {
    profile: "nlp_context_keyword_profile.json",
    axios: {
      headers: {
        "Content-Type": "application/json"
      },
      data: iconv.encode(JSON.stringify({
        "text": "百度是一家高科技公司"
      }), 'gbk')
    }
  },
  channel: {
    "challengePeriod": "5000"
  }
}
