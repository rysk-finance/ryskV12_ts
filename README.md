# Rysk V12 Typescript client

Typescript wrapper for ryskv12-cli

## Setup

Navigate to https://github.com/rysk-finance/ryskV12-cli/releases and download the latest release in this directory as `ryskV12`

## Run

### Instantiation

```ts
const privateKey = "YOUR_PRIVATE_KEY"; // Replace with your actual private key
const env = Env.TESTNET; // Choose your environment: Env.LOCAL, Env.TESTNET, Env.MAINNET
const ryskSDK = new Rysk(env, privateKey, "/path/to/ryskV12"); // Optional CLI path
```

### Create a Connection

```ts
const channelId = "my-unique-channel-id";
const uri = "/ws/<assetAddress>"; // Example websocket endpoint

const responseHandler: JSONResponseHandler = (response: JSONRPCResponse) => {
  console.log("Received response:", response);
  // Handle the JSON RPC response here
  // This is purposely left very generic so you can have your own implementation.
  // A few options are:
  // - Subscriber Pattern
  // - Message Queue
  // - Immediate Callback
  // - Streams
}

ryskSDK.connect(channelId, uri, responseHandler);
```

### Approve USDC spending

```ts
const approvalChannelId = "approval-channel";
const chainId = 84532;
const amount = "1000000";

ryskSDK.approve(approvalChannelId, chainId, amount);
```

### List USDC Balances

```ts
const makerChannel = "maker-channel";
const account = "0xabc";

ryskSDK.balances(makerChannel, account);
```

### Deposit / Withdraw

```ts
const makerChannel = "maker-channel";
const transferDetails: Transfer = {
  amout: "500000",
  asset: "0x...", // The asset address
  chain_id: 84532,
  is_deposit: true,
  nonce: "some-unique-nonce",
};

ryskSDK.transfer(makerChannel, transferDetails);
```

### List Positions

```ts
const makerChannel = "maker-channel";
const account = "0xabc";

ryskSDK.positions(makerChannel, account);
```

### Send a Quote

```ts
const makerChannel = "maker-channel";
const request_id = "some-uuid-from-server";
const quoteDetails: Quote = {
  assetAddress: "0x...",
  chainId: 84532,
  expiry: 1678886400,
  isPut: false,
  isTakerBuy: true,
  maker: "0x...",
  nonce: "another-unique-nonce",
  price: "0.01",
  quantity: "1",
  strike: "1000000",
  validUntil: 1678886460,
};

ryskSDK.quote(makerChannel, request_id, quoteDetails);
```
