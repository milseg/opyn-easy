import "dotenv/config"

import Web3 from "web3"
import BigNumber from "bignumber.js"

export default class TradeApi {
  public web3: Web3
  public account = "" //public address

  constructor(web3: Web3) {
    this.web3 = web3
    const vm = this
    web3.eth.getAccounts().then(function (accounts: string[]) {
      if (accounts.length < 1) {
        throw new Error("An account must be set for provider/wallet")
      }
      if (process.env.DEBUG_ENABLED) {
        console.log("account found", accounts[0], typeof accounts[0])
      }
      vm.account = accounts[0]
    })
    //await web3.eth.getBalance(this.account)
  }

  public async getAccount(): Promise<string> {
    const accounts = await this.web3.eth.getAccounts()
    if (accounts.length < 1) {
      throw new Error("An account must be set for provider/wallet")
    }
    return accounts[0]
  }

  public async getAvailableOptions(): Promise<string[]> {
    return []
  }

  public async buyOption(): Promise<string> {
    return ""
  }

  public async sellOption(): Promise<string> {
    return ""
  }

  public async getBuyOptionEstimatedGas(): Promise<BigNumber> {
    return new BigNumber(0)
  }

  public async getSellOptionEstimatedGas(): Promise<BigNumber> {
    return new BigNumber(0)
  }
}
