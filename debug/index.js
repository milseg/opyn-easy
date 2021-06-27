require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")
const fs = require("fs")
const moment = require("moment-timezone")

const provUrl = `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`

console.log("provUrl", provUrl)
const provider = new HDWalletProvider(process.env.PRIVATE_KEY, provUrl)

const web3Client = new Web3(provider)
const opyneasy = require("../build/src/index")
const tapi = new opyneasy.TradeApi(web3Client)

function log(msg) {
  var baseDir = require("path").basename(__dirname)
  fs.appendFile(
    baseDir + "/output.txt",
    moment().tz("America/Sao_Paulo").format() + " - " + msg + "\r\n",
    "utf-8",
    (err) => {
      if (err) throw err
      //console.log('The "data to append" was appended to file!');
    }
  )
}

async function start() {
  console.log("start getAvailableOptions")
  const ao = await tapi.getAvailableOptions()
  console.log("available options found")
  log(JSON.stringify(ao))
}

start()
