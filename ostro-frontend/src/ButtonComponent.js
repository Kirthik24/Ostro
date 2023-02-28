import React, { useState } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types"

function ButtonComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // Call an asynchronous function here
      let add = "0xf8d6e0586b0a20c7"
      const encoded = await fcl.send([
        fcl.script`
        import OstroToken from 0xf8d6e0586b0a20c7
        
        pub fun main(): UFix64 {
            let acct1 = getAccount(0xf8d6e0586b0a20c7)
        
            let acct1ReceiverRef = acct1.getCapability<&OstroToken.Vault{OstroToken.Balance}>(/public/MainReceiver)
                .borrow()
                ?? panic("Could not borrow a reference to the acct1 receiver")
        
            log("Account 1 Balance")
            log(acct1ReceiverRef.balance)
            return acct1ReceiverRef.balance
        }
        `,
        // fcl.args([
        // fcl.arg(0x8d6e0586b0a20c7, t.Address)]),
      ]);
      const decoded = await fcl.decode(encoded);
      console.log(decoded);
      console.log('Async function call successful!');
    } catch (error) {
      console.error('Async function call failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Call Async Function'}
      </button>
    </div>
  );
}

export default ButtonComponent;
