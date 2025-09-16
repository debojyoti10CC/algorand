"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import LuteConnect from 'lute-connect'

export function CTASection() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lute] = useState(() => new LuteConnect())

  const handleConnectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // For Lute, we need to provide the genesis ID
      // Mainnet: "mainnet-v1.0"
      // Testnet: "testnet-v1.0"
      // Betanet: "betanet-v1.0"
      const genesisID = "mainnet-v1.0";
      
      // This will open the Lute wallet popup for connection
      const addresses = await lute.connect(genesisID);
      
      if (addresses && addresses.length > 0) {
        // Use the first address by default
        const selectedAddress = addresses[0];
        setAccount(selectedAddress);
        setIsConnected(true);
        console.log("Connected account:", selectedAddress);
        
        // Store the connected account
        localStorage.setItem('luteConnectedAccount', selectedAddress);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to connect to wallet"
      setError(errorMsg)
      console.error("Error connecting to Lute wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Check connection status on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if we have a stored account
        const storedAccount = localStorage.getItem('luteConnectedAccount');
        if (storedAccount) {
          setAccount(storedAccount);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Save account to localStorage when connected
  useEffect(() => {
    if (account) {
      localStorage.setItem('luteConnectedAccount', account);
    } else {
      localStorage.removeItem('luteConnectedAccount');
    }
  }, [account]);

  return (
    <section className="py-20 sm:py-32 bg-accent/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Ready to secure your payments?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty mb-8">
            Join thousands of users who trust TimeLockBox for their time-locked escrow needs.
          </p>
          
          {!isConnected ? (
            <div className="space-y-4">
              <Button 
                onClick={handleConnectWallet}
                className="px-8 py-6 text-lg font-semibold w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Connect Lute Wallet'}
              </Button>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Don't have Lute Wallet?{' '}
                  <a 
                    href="https://chromewebstore.google.com/detail/lute/kiaoohollfkjhikdifohdckeidckokjh" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Install it from Chrome Web Store
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="px-6 py-4 bg-green-50 dark:bg-green-900/20 rounded-lg inline-flex items-center">
                <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-700 dark:text-green-400 font-medium">
                  Connected: {`${account?.substring(0, 6)}...${account?.substring(account.length - 4)}`}
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Successfully connected to your Lute wallet!
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
