import "./css/App.css";
import { useMemo } from "react";
import * as anchor from "@project-serum/anchor";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import MerchStore from "./MerchStore";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";

import { ThemeProvider, createTheme } from "@material-ui/core";

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

// It was from env
const network = "mainnet-beta" as WalletAdapterNetwork;
// It was from env
const rpcHost = "https://api.mainnet-beta.solana.com";

const connection = new anchor.web3.Connection(rpcHost);

const getCandyMachineId = (): anchor.web3.PublicKey | undefined => {
  try {
    // It was from env
    const candyMachineId = new anchor.web3.PublicKey(
      "6J6cXTGbXRg1F9GtbbL8PKoDB7suqMFUhtSP7PavKuER"
    );

    return candyMachineId;
  } catch (e) {
    console.log("Failed to construct CandyMachineId", e);
    return undefined;
  }
};

const candyMachineId = getCandyMachineId();

const txTimeoutInMilliseconds = 30000;

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getSlopeWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletDialogProvider>
            <div className="backgroundPaper">
              <Navbar />

              <Home
                candyMachineId={candyMachineId}
                connection={connection}
                txTimeout={txTimeoutInMilliseconds}
                rpcHost={rpcHost}
              />

              <Footer />
            </div>
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
