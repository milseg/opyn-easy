import "dotenv/config"

import Web3 from "web3"
import fetch from "node-fetch"
import { EthNetworks, SubgraphOToken } from "./types"
import { ContractSendMethod, Contract } from "web3-eth-contract"
import { gammaControllerABI } from "../../abis/gammaControllerABI"

const gammaControllerAddress: {
  [key in EthNetworks]: string
} = {
  [EthNetworks.Mainnet]: "0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72",
  [EthNetworks.Ropsten]: "0x7e9beaccdccee88558aaa2dc121e52ec6226864e",
  [EthNetworks.Kovan]: "0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e",
}

export const gammaControllerProxyContract = async (
  web3: Web3
): Promise<Contract> => {
  const chainId: EthNetworks = await web3.eth.getChainId()
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

//network helpers
export const networkIdToTxUrl = {
  [EthNetworks.Mainnet]: "https://etherscan.io/tx",
  [EthNetworks.Ropsten]: "https://ropsten.etherscan.io/tx",
  [EthNetworks.Kovan]: "https://kovan.etherscan.io/tx",
}

export const networkIdToAddressUrl = {
  [EthNetworks.Mainnet]: "https://etherscan.io/address",
  [EthNetworks.Kovan]: "https://kovan.etherscan.io/address",
  [EthNetworks.Ropsten]: "https://ropsten.etherscan.io/address",
}

//subgraph and blockchain query helpers
const postQuery = async (endpoint: string, query: string) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }
  const url = endpoint
  const response = await fetch(url, options)
  const data = await response.json()
  if (data.errors) {
    throw new Error(data.errors[0].message)
  } else {
    return data
  }
}

const ZERO_ADDR = "0x0000000000000000000000000000000000000000"

export const blacklistOTokens: {
  [key in EthNetworks]: [string]
} = {
  [EthNetworks.Mainnet]: [ZERO_ADDR],
  [EthNetworks.Ropsten]: [ZERO_ADDR],
  [EthNetworks.Kovan]: ["0x81300ac27ac2470713602b4d8a73dfcc85b779b1"],
}

const isPublic = process.env.APP_PUBLIC === "true"
const subgraphEndpoints: {
  [key in EthNetworks]: string
} = {
  [EthNetworks.Mainnet]: isPublic
    ? "https://api.thegraph.com/subgraphs/name/opynfinance/gamma-mainnet"
    : "https://api.thegraph.com/subgraphs/name/opynfinance/playground",
  [EthNetworks.Kovan]: isPublic
    ? "https://api.thegraph.com/subgraphs/name/opynfinance/gamma-kovan"
    : "https://api.thegraph.com/subgraphs/name/opynfinance/gamma-internal-kovan",
  [EthNetworks.Ropsten]:
    "https://api.thegraph.com/subgraphs/name/opynfinance/gamma-ropsten",
}

/**
 * Get all oTokens
 */
export async function getOTokens(
  networkId: EthNetworks,
  errorCallback: (err: string) => void
): Promise<SubgraphOToken[]> {
  const query = `
  {
    otokens (
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc
    ) {
      id
      symbol
      name
      strikeAsset {
        id
        symbol
        decimals
      }
      underlyingAsset {
        id
        symbol
        decimals
      }
      collateralAsset {
        id
        symbol
        decimals
      }
      strikePrice
      isPut
      expiryTimestamp
      createdAt
      createdTx
      creator
    }
  }`
  try {
    const response = await postQuery(subgraphEndpoints[networkId], query)
    const oTokens = response.data.otokens.filter(
      (otoken: { id: string }) =>
        !blacklistOTokens[networkId].includes(otoken.id)
    )
    return oTokens
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

//0x helpers
export const ZeroXEndpoint: {
  [key in EthNetworks]: { http: string; ws: string }
} = {
  1: {
    http: "https://api.0x.org/",
    ws: "wss://api.0x.org/sra/v4",
  },
  3: {
    http: "https://ropsten.api.0x.org/",
    ws: "wss://ropsten.api.0x.org/sra/v4",
  },
  42: {
    http: "https://kovan.api.0x.org/",
    ws: "wss://kovan.api.0x.org/sra/v4",
  },
}
