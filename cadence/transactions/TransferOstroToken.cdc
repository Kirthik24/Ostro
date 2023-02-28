import OstroToken from 0xf8d6e0586b0a20c7

transaction(AccAddress: Address) {
  var temporaryVault: @OstroToken.Vault

  prepare(acct: AuthAccount) {
    let vaultRef = acct.borrow<&OstroToken.Vault>(from: /storage/MainVault)
        ?? panic("Could not borrow a reference to the owner's vault")
      
    self.temporaryVault <- vaultRef.withdraw(amount: 10.0)
  }

  execute {
    let recipient = getAccount((AccAddress))

    let receiverRef = recipient.getCapability(/public/MainReceiver)
                      .borrow<&OstroToken.Vault{OstroToken.Receiver}>()
                      ?? panic("Could not borrow a reference to the receiver")

    receiverRef.deposit(from: <-self.temporaryVault)

    log("Transfer succeeded!")
  }
}