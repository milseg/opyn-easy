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
