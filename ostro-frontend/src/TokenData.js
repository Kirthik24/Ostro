import React, { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

const TokenData = () => {
  const [tokensToSell, setTokensToSell] = useState([])

  useEffect(() => {    
    checkMarketplace()
  }, []);

  const checkMarketplace = async () => {
    try {
      const encoded = await fcl.send([
        fcl.script`
       import MarketplaceContract from 0xf8d6e0586b0a20c7
        pub fun main(): [UInt64] {
            let account1 = getAccount(0xf8d6e0586b0a20c7)
            let acct1saleRef = account1.getCapability<&AnyResource{MarketplaceContract.SalePublic}>(/public/NFTSale)
                .borrow()
                ?? panic("Could not borrow acct2 nft sale reference")
            return acct1saleRef.getIDs()
        }
        `
      ]);
      const decoded = await fcl.decode(encoded);
      let marketplaceMetadata = [];
      console.log(decoded); 
      for (const id of decoded) {
        const encodedMetadata = await fcl.send([
          fcl.script`
            import PropertyContract from 0xf8d6e0586b0a20c7
            pub fun main(id: Int) : {String : String} {
              let nftOwner = getAccount(0xf8d6e0586b0a20c7)  
              let capability = nftOwner.getCapability<&{PropertyContract.NFTReceiver}>(/public/NFTReceiver)
              let receiverRef = capability.borrow()
                  ?? panic("Could not borrow the receiver reference")
              return receiverRef.getMetadata(id: 1)
            }
          `,
          fcl.args([
            fcl.arg(id, t.Int)    
          ]),
        ]);
    
        const decodedMetadata = await fcl.decode(encodedMetadata);
        const encodedPrice = await fcl.send([
          fcl.script`
            import MarketplaceContract from 0xf8d6e0586b0a20c7
            pub fun main(id: UInt64): UFix64? {
                let account1 = getAccount(0xf8d6e0586b0a20c7)
                let acct1saleRef = account1.getCapability<&AnyResource{MarketplaceContract.SalePublic}>(/public/NFTSale)
                    .borrow()
                    ?? panic("Could not borrow acct nft sale reference")
                return acct1saleRef.idPrice(tokenID: id)
            }
          `, 
          fcl.args([
            fcl.arg(id, t.UInt64)
          ])
        ])
        const decodedPrice = await fcl.decode(encodedPrice)
        decodedMetadata["price"] = decodedPrice;
        marketplaceMetadata.push(decodedMetadata);
      }
      console.log(marketplaceMetadata);
      setTokensToSell(marketplaceMetadata)
    } catch (error) {
      console.log("NO NFTs FOR SALE")
    }    
  }
  return (
    <div className="token-data">
      {
        tokensToSell.map(token => {
          return (
            <div key={token.uri} className="listing" >
              <div >
                <h3>{token.name}</h3>
                <h4>Stats</h4>
                <p>Property : {token.PropertyName}</p>
                <p>Address: {token.Address}</p>
                <p>Coordinates: {token.Coordinates}</p>
                <h4>Photo</h4>
                {/* <video loop="true" autoplay="" playsinline="" preload="auto" width="85%">
                  <source src={`https://ipfs.io/ipfs/${token["uri"].split("://")[1]}`} type="video/mp4" />
                </video> */}
                <img src = {`https://source.unsplash.com/178j8tJrNlc/1920x1080`} width = "150px" height="150px" />
                <h4>Price</h4>
                <p>{parseInt(token.price, 10).toFixed(2)} Pinnies</p>
                <button className="btn-primary">Buy Now</button>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default TokenData;
