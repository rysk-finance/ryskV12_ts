export type HexString = `0x${string}`;

export type Request = {
  asset: HexString;
  assetName: string;
  chainId: number;
  expiry: number;
  isPut: boolean;
  quantity: string;
  strike: string;
  taker: HexString;
};

export type Quote = {
  assetAddress: HexString;
  chainId: number;
  expiry: number;
  isPut: boolean;
  isTakerBuy: boolean;
  maker: HexString;
  nonce: string;
  price: string;
  quantity: string;
  signature: HexString;
  strike: string;
  validUntil: number;
};

export type Transfer = {
  amout: string;
  asset: string;
  chain_id: number;
  is_deposit: boolean;
  nonce: string;
};

export type JSONRPCResponse = {
  jsonrpc: string;
  id: string;
  method: string;
  params: Record<string, any>;
};

export type JSONResponseHandler = (res: JSONRPCResponse) => void;
