import PropertyContract from 0xf8d6e0586b0a20c7

transaction {
  let receiverRef: &{PropertyContract.NFTReceiver}
  let minterRef: &PropertyContract.NFTMinter

  prepare(acct: AuthAccount) {
      self.receiverRef = acct.getCapability<&{PropertyContract.NFTReceiver}>(/public/NFTReceiver)
          .borrow()
          ?? panic("Could not borrow receiver reference")        
      
      self.minterRef = acct.borrow<&PropertyContract.NFTMinter>(from: /storage/NFTMinter)
          ?? panic("could not borrow minter reference")
  }

  execute {
      let metadata : {String : String} = {
          "PropertyName": "Pentahouse",
          "Address": "No:3, New York", 
          "Coordinates": "194.34.344.44", 
          "Aera": "3500 Sq",
          "uri": "ipfs://QmRZdc3mAMXpv6Akz9Ekp1y4vDSjazTx2dCQRkxVy1yUj6"
      }
      let newNFT <- self.minterRef.mintNFT()
  
      self.receiverRef.deposit(token: <-newNFT, metadata: metadata)

      log("NFT Minted and deposited to Account Collection")
  }
}
 
 