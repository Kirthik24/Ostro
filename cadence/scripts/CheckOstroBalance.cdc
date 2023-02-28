import OstroToken from 0xf8d6e0586b0a20c7
pub fun main(AccAddress: Address): UFix64 {
    let acct1 = getAccount(AccAddress)

    let acct1ReceiverRef = acct1.getCapability<&OstroToken.Vault{OstroToken.Balance}>(/public/MainReceiver)
        .borrow()
        ?? panic("Could not borrow a reference to the acct1 receiver")

    log("Account 1 Balance")
    log(acct1ReceiverRef.balance)
    return acct1ReceiverRef.balance
}
 