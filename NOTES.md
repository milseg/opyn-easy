## OPTION BUYER
1. Looks at available oTokens (only oTokens which are not expired by default)
2. Checks market price of oToken on 0x ask chain book
3. Buys a token
4. Lists oTokens(options) bought (what oTokens does it have on balance)
5. Waits for expiry date

With opyn-easy library all of these steps would be encapsulated into a single **buy_option(...)** call

--- Rollover ---
- Check bid market price for an oToken
- Rollover token (sell token)
- Go to step 0 for a later expiration



## OPTION SELLER
1. Looks at available oToken
2. Checks market price of oToken on 0x bid chain book
3. Create vault for that oToken
4. Adds collateral to vault
5. Receives and Sells oToken and gets premium
6. Query vaults short positions

With opyn-easy library all of these steps would be encapsulated into a single **sell_option(...)** call

## OPTION SELLER WITH POSSIBLE ENHANCEMENT
This implementation depends on having a VaultBridge.sol smart contract. This contract is responsible for creating vaults for every 
available option. It introduces the idea of a **Vault Creator** role in the protocol, some entity or market maker responsible for creating vaults.
Such optimization would be interesting to reduce the gas costs for sellers, which with this approach only need to add collateral. Collateral is added
indirectly by VaultBridge contract, which also transfers the minted oToken to the seller and stores the seller position for future querying or redeem

1. Looks at available oToken
2. Checks market price of oToken on 0x bid chain book
3. Adds collateral to vault
4. Receives and Sells oToken and gets premium
5. Query vaults short positions


What is the possible incentives for the Vault Creator?
- fee paid by the option sellers
- If Opyn protocol implements an incentive token, it could be minted to Vault Creators
- Opyn USDc liquidity program?


## GENERAL
- Query underlying price
- List options

list_available_options()  
get_option_price(...)

## TASKS
- Develop javascript library
- Develop a simple UI/UX interface as a proof of concept on ropsten

## FUTURE
- Develop Rust library
