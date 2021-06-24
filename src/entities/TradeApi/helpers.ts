import Web3 from "web3"
import { EthNetworks } from "./types"
import { AbiItem } from "web3-utils"
import { ContractSendMethod } from "web3-eth-contract"

const gammaControllerABI: AbiItem[] = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"ProxyOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"impl","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxyOwner","outputs":[{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferProxyOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_implementation","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}]
const gammaControllerAddress = {
	[EthNetworks.Mainnet]: '0x4ccc2339F87F6c59c6893E1A678c2266cA58dC72',
	[EthNetworks.Ropsten]: '0x7e9beaccdccee88558aaa2dc121e52ec6226864e',
	[EthNetworks.Kovan]: '0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e'
}

export const gammaControllerProxyContract = (web3: Web3) => web3.eth.Contract(gammaControllerABI, gammaControllerAddress[web3.eth.getChainId()])

export async function resolveTxOnConfirmation(
	tx: ContractSendMethod,
	account: string,
	gas?: number //could be useful to control gas costs
): Promise<string> {
	console.log("received", tx)
	return new Promise((resolve, reject) => {
	  tx.send({
	    from: account
	  })
	    .on("transactionHash", (hash) => {
	        resolve(hash)
	    })
	    .on("error", (error) => reject(error))
	})
}