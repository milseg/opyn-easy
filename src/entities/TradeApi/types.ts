export type Wei = string | number
export type Ether = string | number

export enum EthNetworks {
  Mainnet = 1,
  Ropsten = 3,
  //Rinkeby = 4,
  //Goerli = 5,
  Kovan = 42,
}

export type SubgraphToken = {
  id: string
  symbol: string
  name: string
  decimals: number
}

export type SubgraphOToken = SubgraphToken & {
  underlyingAsset: SubgraphToken
  strikeAsset: SubgraphToken
  collateralAsset: SubgraphToken
  strikePrice: string
  expiryTimestamp: string
  isPut: boolean
  creator: string
  createdAt: string
  totalSupply: string
}


//0x types
export type OrderWithMetaData = {
  order: SignedOrder
  metaData: {
    orderHash: string
    remainingFillableTakerAmount: string
  }
}

export type SignedOrder = UnsignedOrder & {
  signature: {
    r: string
    s: string
    v: number
    signatureType: number
  }
}

export type UnsignedOrder = {
  makerToken: string
  takerToken: string
  makerAmount: string
  takerAmount: string
  maker: string
  taker: string
  pool: string
  expiry: string
  salt: string
  chainId: number
  verifyingContract: string
  takerTokenFeeAmount: string
  sender: string
  feeRecipient: string
}

export type OTokenOrderBook = {
  id: string
  asks: OrderWithMetaData[]
  bids: OrderWithMetaData[]
}

export type OTokenOrderBookWithDetail = OTokenOrderBook & {
  bestAskPrice: string
  bestBidPrice: string
  totalBidAmt: string
  totalAskAmt: string
}


export type entries = {
  total: number
  page: number
  perPage: number
  records: OrderWithMetaData[]
}