import { EthNetworks } from "../types"

type Token = {
  id: string
  name: string
  symbol: string
  decimals: number
  canMint?: boolean // if we can provide faucet
}

type Tokens = {
  [key in EthNetworks]: Token[]
}


const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

export const eth: Token = {
  name: 'Ether',
  id: ZERO_ADDR,
  symbol: 'ETH',
  decimals: 18,
}

export const tokens: Tokens = {
  [EthNetworks.Mainnet]: [
    eth,
    {
      name: 'USDC',
      id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      symbol: 'USDC',
      decimals: 6,
    },
    {
      name: 'Wrapped Ether',
      id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Wrapped Bitcoin',
      id: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTC',
      decimals: 8,
    },
  ],

  [EthNetworks.Ropsten]: [
    eth,
    {
      name: 'Opyn USDC',
      id: '0x27415c30d8c87437BeCbd4f98474f26E712047f4',
      symbol: 'USDC',
      decimals: 6,
      canMint: true,
    },
    {
      name: 'Wrapped Ether',
      id: '0xc778417e063141139fce010982780140aa0cd5ab',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Opyn Wrapped Bitcoin',
      id: '0xe477d1FFC1e5eA6a577846a4699617997315B4ee',
      symbol: 'WBTC',
      decimals: 8,
      canMint: true,
    },
  ],
  [EthNetworks.Kovan]: [
    eth,
    {
      name: 'USDC',
      id: '0x7e6edA50d1c833bE936492BF42C1BF376239E9e2',
      symbol: 'USDC',
      decimals: 6,
      canMint: true,
    },
    {
      name: 'Wrapped Ether',
      id: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
      symbol: 'WETH',
      decimals: 18,
    },
    {
      name: 'Wrapped Bitcoin',
      id: '0x50570256f0da172a1908207aAf0c80d4b279f303',
      symbol: 'WBTC',
      decimals: 8,
      canMint: true,
    },
  ],
}


export const getPrimaryPaymentToken = (networkId: EthNetworks): Token => {
  return tokens[networkId].find(t => t.symbol === 'USDC') as Token
}

export const getWeth = (networkId: EthNetworks): Token => {
  return tokens[networkId].find(t => t.symbol === 'WETH') as Token
}

export const getWbtc = (networkId: EthNetworks): Token => {
  return tokens[networkId].find(t => t.symbol === 'WBTC') as Token
}