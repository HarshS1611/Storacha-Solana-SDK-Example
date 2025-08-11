import React, { useState } from "react";
import { Connection,clusterApiUrl } from "@solana/web3.js";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import { Client } from "solana-storacha-sdk";

export default function App() {
  const wallet = useWallet();
  const [status, setStatus] = useState<string>("");

  // Configure client with defaults or override server URLs here
  const client = new Client({
    rpcUrl: "https://api.testnet.solana.com",
    serverUrl: "https://storacha-solana-sdk-bshc.onrender.com",
  });

  const handleDeposit = async () => {
    if (!wallet.publicKey) {
      setStatus("❌ Please connect your wallet first.");
      console.warn("Wallet not connected");
      return;
    }

    try {
      setStatus("⏳ Creating deposit transaction...");
      console.log("Starting deposit process with params:", {
        payer: wallet.publicKey.toBase58(),
        cid: "baqeq23e23qwqdf5l5lab3232asqa1527gq1vz5c6uv3qc6a3",
        size: 1234,
        durationDays: 30,
        depositAmount: 0.3,
      });

      // 1️⃣ Create deposit transaction
      const tx = await client.createDeposit({
        payer: wallet.publicKey,
        cid: "baqeq23e23qwqdf5l5lab3232asqa1527gq1vz5c6uv3qc6a3",
        size: 1234,
        durationDays: 30,
        depositAmount: 0.3,
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
