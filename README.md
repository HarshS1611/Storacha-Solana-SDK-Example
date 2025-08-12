<h1>🛠️ Solana Storacha SDK — Local Development &amp; Testing</h1>

<p>
This guide explains how to set up and use the <strong>Solana Storacha SDK</strong> locally for development and testing with the provided React example app —
without publishing the SDK to npm.
</p>

<hr />

<h2>📂 Project Structure</h2>
<pre><code>.
├── sdk/   # The SDK package
└── /    # Example React app using the SDK
</code></pre>

<hr />

<h2>🔗 1. Linking SDK with the React app</h2>

<h3>Option A — <strong>pnpm link</strong> (recommended)</h3>
<p><strong>In SDK folder:</strong></p>
<pre><code>cd sdk
pnpm install
pnpm build
pnpm link --global
</code></pre>

<p><strong>In example app folder:</strong></p>
<pre><code>pnpm install
pnpm link ./sdk
</code></pre>

<p><em>Now changes to the SDK will be reflected in the app after rebuilding it.</em></p>

<h3>Option B — Local file path dependency</h3>
<p>In <code>./package.json</code>:</p>
<pre><code>"dependencies": {
  "sdk": "file:./sdk"
}
</code></pre>
<p>Then:</p>
<pre><code>pnpm install
</code></pre>

<hr />

<h2>🖥️ 2. Running Example React App</h2>
<p>From the example app folder:</p>
<pre><code>pnpm dev
</code></pre>
<p>Open your browser at <a href="http://localhost:5173" target="_blank">http://localhost:5173</a> (Vite default).</p>

<hr />

<h2>🧩 3. Importing and Using the SDK</h2>
<p>Example in <code>src/App.tsx</code>:</p>
<pre><code>import { Client } from "sdk";

const client = new Client({
  enivironemt: "testnet"
});

const tx = await client.createDeposit({
  payer: wallet.publicKey!,
  file,
  durationDays: 7,
});
</code></pre>

<hr />

<h2>🛠️ 4. TypeScript Support</h2>
<p>If you see:</p>
<pre><code>Could not find a declaration file for module 'sdk'
</code></pre>
<p>Create a file in your example project:</p>
<pre><code>src/index.d.ts
</code></pre>
<p>With content:</p>
<pre><code>declare module "sdk";
</code></pre>

<hr />

<h2>📌 Notes</h2>
<ul>
  <li>Restart dev server after linking.</li>
  <li>If SDK updates, rebuild it (<code>pnpm build</code>) before testing in the app.</li>
  <li>For full error logs when sending transactions, catch <code>SendTransactionError</code> and check <code>error.logs</code>.</li>
</ul>

<hr />

<h2>✅ Done</h2>
<p>You can now develop your SDK and app side-by-side without publishing to npm!</p>
