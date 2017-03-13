'use strict'

const request = require('request')
const Promise = require('bluebird')
const async = require('asyncawait/async')
const awaitFun = require('asyncawait/await')
const users = require('./users')

function pushMessage(user, message) {
  var postData = {
    "to": user,
    "messages": message
  }
  request.post({
    "url": "https://api.line.me/v2/bot/message/push",
    "method": "POST",
    "headers": {
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + process.env.LINE_TOKEN
    },
    "json": postData
  }, function (err, resp, body) {
    if (err) {
      console.log(err)
    }
    console.log("PushMessage to USER: " + user + ", MESSAGE: " + JSON.stringify(postData))
  })
}

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

module.exports.run = (event, context) => {
  requirePrice().then(function(entity) {
    users.readAll().then(function(result){
      if (result.rowCount > 0) {
        result.rows.forEach(function(user) {
          var message = [{
            "type": "text",
            "text": "BitCoin Price: " + entity.bitCoinPrice + " USD"
          }, {
            "type": "text",
            "text": "EtherCoin Price: " + entity.etherCoinPrice + " USD"
          }]
          pushMessage(user.id, message)
        })
      }
    })
  })
}
