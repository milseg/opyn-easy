import { entries, EthNetworks, SubgraphOToken, OrderWithMetaData } from "../types"
import { fetch, postQuery } from './fetch-helper'
import { getPrimaryPaymentToken } from './addresses'
import { sleep } from './utils'

const ZERO_ADDR = "0x0000000000000000000000000000000000000000"
const isPublic = process.env.APP_PUBLIC === "true"


export const blacklistOTokens: {
  [key in EthNetworks]: [string]
} = {
  [EthNetworks.Mainnet]: [ZERO_ADDR],
  [EthNetworks.Ropsten]: [ZERO_ADDR],
  [EthNetworks.Kovan]: ["0x81300ac27ac2470713602b4d8a73dfcc85b779b1"],
}


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



/**
 * get bids and asks for an oToken
 */
export async function getOTokenUSDCOrderBook(
  networkId: EthNetworks,
  oToken: string,
): Promise<{
  success: boolean
  asks: OrderWithMetaData[]
  bids: OrderWithMetaData[]
}> {
  // skip request for kovan.
  if (networkId === EthNetworks.Kovan) {
    return {
      success: false,
      asks: [],
      bids: [],
    }
  }
  const quote = getPrimaryPaymentToken(networkId).id
  const endpoint = ZeroXEndpoint[networkId].http
  const url = `${endpoint}sra/v4/orderbook?baseToken=${oToken}&quoteToken=${quote}&perPage=${100}`
  try {
    const res = await fetch(url)
    // refetch in 0.5 sec
    if (res.status === 429) {
      await sleep(500)
      return getOTokenUSDCOrderBook(networkId, oToken)
    } else {
      const result: { asks: entries; bids: entries } = await res.json()
      return {
        success: true,
        asks: result.asks.records,
        bids: result.bids.records,
      }
    }
  } catch (error) {
    return {
      success: false,
      asks: [],
      bids: [],
    }
  }
}

/**
 * get oToken:WETH stats (v1) for all options
 * @param {Array<{addr:string, decimals:number}>} options
 * @param {{addr:string, decimals:number}} quoteAsset
 * @return {Promise<Array<
 * >}
 */
/*export async function getBasePairAskAndBids(
  oTokens: OToken[],
  networkId: SupportedNetworks,
): Promise<OTokenOrderBook[]> {
  const filteredOTokens = oTokens // await filter0xAvailablePairs(networkId, oTokens);
  // 0x has rate limit of 6 request / 10 sec, will need to chuck array into 6 each
  const BATCH_REQUEST = 6
  const COOLDOWN = networkId === 1 ? 0.5 : 2

  const batchOTokens = filteredOTokens.reduce(
    (prev: OToken[][], curr) => {
      if (prev.length > 0 && prev[prev.length - 1].length >= BATCH_REQUEST) {
        return [...prev, [curr]]
      } else {
        const copy = [...prev]
        copy[copy.length - 1].push(curr)
        return copy
      }
    },
    [[]],
  )

  let final: OTokenOrderBook[] = []

  for (const batch of batchOTokens) {
    const [bestAskAndBids] = await Promise.all([
      Promise.map(batch, async ({ id: oTokenAddr }: OToken) => {
        const { asks, bids } = await getOTokenUSDCOrderBook(networkId, oTokenAddr)
        return {
          id: oTokenAddr,
          asks: asks.filter(record => isValidAsk(record)),
          bids: bids.filter(record => isValidBid(record)),
        }
      }),
      sleep(COOLDOWN * 1000),
    ])
    final = final.concat(bestAskAndBids)
  }

  return final
}*/