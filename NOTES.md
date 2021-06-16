## OPTION BUYER
0. Looks at available oTokens (only oTokens which are not expired by default)
1. Checks market price of oToken on 0x ask chain book
2. Buys a token
3. Lists oTokens(options) bought (what oTokens does it have on balance)
4. Waits for expiry date


--- Rollover ---
- Check bid market price for an oToken
- Rollover token (sell token)
- Go to step 0 for a later expiration

buy_option(...)

## OPTION SELLER
0. Looks at available oToken
1. Checks market price of oToken on 0x bid chain book
2. Create vault for that oToken
3. Adds collateral to vault
4. Receives and Sells oToken and gets premium
5. Query vaults short positions

sell_option(...)

## OPTION SELLER WITH POSSIBLE ENHANCEMENT
This implementation depends on having a VaultBridge.sol smart contract. This contract is responsible for creating vaults for every 
available option. It introduces the idea of a **Vault Creator** role in the protocol, some entity or market maker responsible for creating vaults.
Such optimization would be interesting to reduce the gas costs for sellers, which with this approach only need to add collateral. Collateral is added
indirectly by VaultBridge contract, which also transfers the minted oToken to the seller and stores the seller position for future querying or redeem

0. Looks at available oToken
1. Checks market price of oToken on 0x bid chain book
2. Adds collateral to vault
3. Receives and Sells oToken and gets premium
4. Query vaults short positions


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
