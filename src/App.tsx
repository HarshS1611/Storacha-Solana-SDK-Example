import React, { useState } from "react";
import { Connection,clusterApiUrl } from "@solana/web3.js";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import { Client } from "sdk";

export default function App() {
  const wallet = useWallet();
  
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  // Configure client with defaults or override server URLs here
  const client = new Client({
    environment: "testnet" // or "mainnet-beta" or "devnet"
  });

  const handleDeposit = async () => {
    if (!wallet.publicKey) {
      setStatus("❌ Please connect your wallet first.");
      console.warn("Wallet not connected");
      return;
    }
    if (!file) {
      setStatus("❌ Please select a file to deposit.");
      console.warn("No file selected");
      return;
    }

    try {
      setStatus("⏳ Creating deposit transaction...");
      console.log("Starting deposit process with params:", {
        payer: wallet.publicKey.toBase58(),
        file,
        durationDays: 7,
      });

      // 1️⃣ Create deposit transaction
      const tx = await client.createDeposit({
        payer: wallet.publicKey,
        file,
        durationDays: 7,
      });
      console.log("📄 Transaction created:", tx);

      // 2️⃣ Sign transaction
      setStatus("✍️ Signing transaction...");
      const signedTx = await wallet.signTransaction!(tx);
      console.log("✅ Transaction signed:", signedTx);

      // 3️⃣ Send transaction
      setStatus("📤 Sending transaction to Solana network...");
      const connection = new Connection(clusterApiUrl("testnet"), "confirmed");
      const signature = await connection.sendRawTransaction(signedTx.serialize());
      console.log(`📌 Transaction signature: ${signature}`);
      console.log(
        `🌐 Explorer link: https://explorer.solana.com/tx/${signature}?cluster=testnet`
      );

      // 4️⃣ Confirm transaction
      setStatus("⏳ Confirming transaction...");
      await connection.confirmTransaction(signature, "confirmed");

      setStatus(`✅ Transaction confirmed! Signature: ${signature}`);
      console.log("🎉 Transaction confirmed successfully:", signature);
    } catch (error: any) {
      console.error("💥 Deposit flow error:", error);
      setStatus(`❌ Error during deposit: ${error?.message || "Unknown error"}`);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2em auto", textAlign: "center" }}>
      <WalletMultiButton />
      <div style={{ marginTop: 20 }}>
      <input type="file" onChange={handleFileChange} />

        <button onClick={handleDeposit} disabled={!wallet.connected}>
          Submit Deposit
        </button>
      </div>
      <p style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>{status}</p>
    </div>
  );
}

// Wrap your App with WalletProvider and WalletModalProvider
export function AppProviders({ children }: { children: React.ReactNode }) {
  const wallets = [new PhantomWalletAdapter()];

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}
