import "dotenv/config"

import Web3 from "web3"
import { default as TradeApi } from "./index"
import HDWalletProvider from "@truffle/hdwallet-provider"

const provider = new HDWalletProvider(
  //@ts-ignore
  process.env.PRIVATE_KEY,
  `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
)
const web3Client = new Web3(provider)
const tap = new TradeApi(web3Client)

describe("TradeApi", () => {
  describe("#constructor", () => {
    it("simple tradeapi instance", async () => {
      expect(tap.web3).toBeDefined()
      const account = await tap.getAccount()
      expect(account).toEqual(process.env.PUBLIC_ADDRESS)
    })
  })

  describe("getAvailableOptions", () => {
    it("check truthy return", async () => {
      const ao = await tap.getAvailableOptions()
      console.log("otokens", ao)
      expect(ao).toBeTruthy()
    })
  })
})
