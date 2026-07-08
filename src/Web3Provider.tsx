import { PrivyProvider } from '@privy-io/react-auth';
import type { ReactNode } from 'react';
import { hardhat, flareTestnet } from 'viem/chains';

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  // We use the Vite env variable injected from our .env file
  const appId = import.meta.env.VITE_PRIVY_APP_ID || '';

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Customize Privy's login methods to match our premium UX
        loginMethods: ['email', 'wallet', 'google', 'twitter', 'github'],
        appearance: {
          theme: 'dark',
          accentColor: '#e70052', // Flare neon pink
          logo: 'https://cryptologos.cc/logos/flare-flr-logo.png', // Flare logo
        },
        supportedChains: [hardhat, flareTestnet],
        defaultChain: flareTestnet,
        // Embedded wallets seamlessly create a wallet for users who log in with email/socials
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        } as any,
      }}
    >
      {children}
    </PrivyProvider>
  );
};
