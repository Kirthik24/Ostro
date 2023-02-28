import OstroToken from 0xf8d6e0586b0a20c7

transaction(AccAddress: Address) {
  prepare(acct: AuthAccount) {
    acct.link<&OstroToken.Vault{OstroToken.Receiver, OstroToken.Balance}>(/public/MainReceiver, target: /storage/MainVault)

    log("Public Receiver reference created!")
  }
  post {
    getAccount(AccAddress).getCapability<&OstroToken.Vault{OstroToken.Receiver}>(/public/MainReceiver)
                    .check():
                    "Vault Receiver Reference was not created correctly"
    }
}
 