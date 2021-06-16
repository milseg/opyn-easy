## OPTION BUYER
0. Looks at available oTokens (only oTokens which are not expired by default)
0.1 Checks market price of oToken on 0x ask chain book
1. Buys a token
2. Lists oTokens(options) bought (what oTokens does it have on balance)
3. Waits for expiry date


--- Rollover ---
- Check bid market price for an oToken
- Rollover token (sell token)
- Go to step 0 for a later expiration

buy_option(...)

## OPTION SELLER
0. Looks at available oToken
0.1 Checks market price of oToken on 0x bid chain book
1. Create vault for that oToken
2. Adds collateral to vault
3. Receives and Sells oToken and gets premium
4. Query vaults short positions

sell_option(...)

## OPTION SELLER WITH POSSIBLE ENHANCEMENT
This implementation depends on having a VaultBridge.sol smart contract. This contract is responsible for creating vaults for every 
available option. It introduces the idea of a **Vault Creator** role in the protocol, some entity or market maker responsible for creating vaults.
Such optimization would be interesting to reduce the gas costs for sellers, which with this approach only need to add collateral. Collateral is added
indirectly by VaultBridge contract, which also transfers the minted oToken to the seller and stores the seller position for future querying or redeem

0. Looks at available oToken
0.1 Checks market price of oToken on 0x bid chain book
1. Adds collateral to vault
2. Receives and Sells oToken and gets premium
3. Query vaults short positions


What is the possible incentives for the Vault Creator?
- fee paid by the option sellers
- If Opyn protocol implements an incentive token, it could be minted to Vault Creators
- Opyn USDc liquidity program?


## GENERAL
- Query underlying price
- List options

list_available_option()
get_option_price(...)

## TASKS
- Develop javascript library
- Develop a simple UI/UX interface as a proof of concept on ropsten

## FUTURE
- Develop Rust library
