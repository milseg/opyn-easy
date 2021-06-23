import Web3 from "web3"
import BigNumber from "bignumber.js"

export default class TradeApi {
  private web3

  constructor(web3: Web3) {
    this.web3 = web3
  }

  public getAvailableOptions(): Promise<string[]> {
    return []
  }

  public buyOption(): string {
    return ""
  }

  public sellOption(): string {
    return ""
  }

  public getBuyOptionEstimatedGas(): BigNumber {
    return new BigNumber(0)
  }

  public getSellOptionEstimatedGas(): BigNumber {
    return new BigNumber(0)
  }
}
