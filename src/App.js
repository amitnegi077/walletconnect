import { useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal";

let provider = null;
let w3 = null;

function App() {
  const providerRef = useRef();
  const w3Ref = useRef();
  provider = providerRef.current;
  w3 = w3Ref.current;

  const [user, setUser] = useState(null);

  const handleWalletDisconnect = async () => {
    await provider.disconnect();
    console.log("Disconnected");
    setUser(null);
  };

  const handleWalletConnect = async () => {
    //  Create WalletConnect Provider
    const provider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed1.binance.org/",
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        137: "https://polygon-rpc.com",
        80001: "https://polygon-testnet.public.blastapi.io",
        // ...
      },
    });
    providerRef.current = provider;
    //  Enable session (triggers QR Code modal)
    await provider.enable();
    w3 = new Web3(provider);
    w3Ref.current = w3;
    const accounts = await w3.eth.getAccounts();
    console.log("connected", accounts);
    setUser(accounts[0]);
  };

  // Subscribe to accounts change
  provider?.on("accountsChanged", (accounts) => {
    console.log(accounts, "accountsChanged");
  });

  // Subscribe to chainId change
  provider?.on("chainChanged", (chainId) => {
    console.log(chainId, "chainChanged");
  });

  // Subscribe to session disconnection
  provider?.on("disconnect", (code, reason) => {
    console.log(code, reason, "disconnect");
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {user ? (
          <>
            <p>{`Connected User: ${user}`}</p>
            <button onClick={handleWalletDisconnect}>Disconnect</button>
          </>
        ) : (
          <button onClick={handleWalletConnect}>Connect</button>
        )}
      </header>
    </div>
  );
}

export default App;
