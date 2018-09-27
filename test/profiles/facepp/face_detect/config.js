qs = require('qs')
module.exports = {
  dbot: {
      profile: "dbot_profile_face_detect.json",
      axios: {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: qs.stringify({
          "image_url": "https://www.faceplusplus.com.cn/scripts/demoScript/images/demo-pic1.jpg",
          "return_landmark": 1,
          "return_attributes": "gender,age"
        })
      }
  }
}
