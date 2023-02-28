import OstroToken from 0xf8d6e0586b0a20c7

transaction (nooftokens: UFix64){
    let mintingRef: &OstroToken.VaultMinter

    var receiver: Capability<&OstroToken.Vault{OstroToken.Receiver}>

	prepare(acct: AuthAccount) {
        self.mintingRef = acct.borrow<&OstroToken.VaultMinter>(from: /storage/MainMinter)
            ?? panic("Could not borrow a reference to the minter")
        
        let recipient = getAccount(0xf8d6e0586b0a20c7)
      
        self.receiver = recipient.getCapability<&OstroToken.Vault{OstroToken.Receiver}>
(/public/MainReceiver)

	}

    execute {
        self.mintingRef.mintTokens(amount: nooftokens, recipient: self.receiver)

        log("tokens minted and deposited to account 0xf8d6e0586b0a20c7")
    }
}