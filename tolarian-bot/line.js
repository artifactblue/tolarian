const superagent = require('superagent')
const request = require('request')
const Promise = require('bluebird')
const async = require('asyncawait/async')
const awaitFun = require('asyncawait/await')

const endpoint = 'https://api.line.me/v2/bot/message/reply'
const accessToken = process.env.LINE_TOKEN

var requirePrice = async( function () {
  var bitCoinPrice = awaitFun (getBitCoinPrice())
  var etherCoinPrice = awaitFun (new Promise(function(resolve){resolve(getEtherCoinPrice())}))
  return {
    bitCoinPrice,
    etherCoinPrice,
  }
})

function getBitCoinPrice () {
  return new Promise(function(resolve, reject){
    request.get({
      "url": "https://blockchain.info/q/24hrprice",
      "method": "GET"
    }, function (err, resp, body) {
      if (err) {
        reject(err)
      }
      resolve(body)
    })
  })
}

function getEtherCoinPrice () {
  return new Promise(function(resolve, reject){
    request.get({
      "url": "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=" + process.env.ETHERSCAN_APIKEY,
      "method": "GET"
    }, function (err, resp, body) {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(body).result.ethusd)
    })
  })
}

module.exports.webhook = (event, context, callback) => {
  // console.log('event', event.body)
  var body = event.body
  body.events.forEach(function(data) {
    var replyToken = data.replyToken
    var message = data.message.text
    requirePrice().then(function(entity) {
      superagent.post(endpoint)
              .set('Content-type', 'application/json; charset=UTF-8')
              .set('Authorization',  'Bearer ' + accessToken)
              .send({
                replyToken: replyToken,
                messages: [
                  {
                    type: 'text',
                    text: "BitCoin Price: " + entity.bitCoinPrice + " USD\r\n"
                    + "EtherCoin Price: " + entity.etherCoinPrice + " USD",
                  }
                ],
              })
              .end(function(error){
                if (error) {
                  console.log(error);
                }
              })
    })
  })

  callback(null, {statusCode: 200, body: JSON.stringify({})});
};