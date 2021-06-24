import "dotenv/config"

import Web3 from "web3"
import { EthNetworks } from "./types"
import { ContractSendMethod, Contract } from "web3-eth-contract"
import { gammaControllerABI } from "../../abis/gammaControllerABI"

const gammaControllerAddress = {
  [EthNetworks.Mainnet]: "0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72",
  [EthNetworks.Ropsten]: "0x7e9beaccdccee88558aaa2dc121e52ec6226864e",
  [EthNetworks.Kovan]: "0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e",
}

export const gammaControllerProxyContract = async (
  web3: Web3
): Promise<Contract> => {
  const chainId = await web3.eth.getChainId()
  //@ts-ignore
  const gammaAddress = gammaControllerAddress[chainId]
  if (process.env.DEBUG_ENABLED) {
    console.log("gammaAddress", gammaAddress)
  }
  return new web3.eth.Contract(gammaControllerABI, gammaAddress)
}

export async function resolveTxOnConfirmation(
  tx: ContractSendMethod,
  account: string,
  gas?: number //could be useful to control gas costs
): Promise<string> {
  console.log("received", tx)
  return new Promise((resolve, reject) => {
    tx.send({
      from: account,
    })
      .on("transactionHash", (hash) => {
        resolve(hash)
      })
      .on("error", (error) => reject(error))
  })
}
