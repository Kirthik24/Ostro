 import OstroToken from 0xf8d6e0586b0a20c7

 transaction(AccAddress: Address) {
	prepare(acct: AuthAccount) {
		let vaultA <- OstroToken.createEmptyVault()
			
		acct.save<@OstroToken.Vault>(<-vaultA, to: /storage/MainVault)

    log("Empty Vault stored")

		let ReceiverRef = acct.link<&OstroToken.Vault{OstroToken.Receiver, OstroToken.Balance}>(/public/MainReceiver, target: /storage/MainVault)

    log("References created")
	}

    post {
        getAccount(AccAddress).getCapability<&OstroToken.Vault{OstroToken.Receiver}>(/public/MainReceiver)
                        .check():  
                        "Vault Receiver Reference was not created correctly"
    }
}