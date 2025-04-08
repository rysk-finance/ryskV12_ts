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
  params: Record<string, any> | Array<any> | string;
};

export type JSONResponseHandler = (res: JSONRPCResponse) => void;

// Type predicate for Request
export function isRequest(obj: any): obj is Request {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.asset === 'string' &&
    typeof obj.assetName === 'string' &&
    typeof obj.chainId === 'number' &&
    typeof obj.expiry === 'number' &&
    typeof obj.isPut === 'boolean' &&
    typeof obj.quantity === 'string' &&
    typeof obj.strike === 'string' &&
    typeof obj.taker === 'string'
  );
}

// Type predicate for Quote
export function isQuote(obj: any): obj is Quote {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.assetAddress === 'string' &&
    typeof obj.chainId === 'number' &&
    typeof obj.expiry === 'number' &&
    typeof obj.isPut === 'boolean' &&
    typeof obj.isTakerBuy === 'boolean' &&
    typeof obj.maker === 'string' &&
    typeof obj.nonce === 'string' &&
    typeof obj.price === 'string' &&
    typeof obj.quantity === 'string' &&
    typeof obj.signature === 'string' &&
    typeof obj.strike === 'string' &&
    typeof obj.validUntil === 'number'
  );
}

// Type predicate for Transfer
export function isTransfer(obj: any): obj is Transfer {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.amout === 'string' &&
    typeof obj.asset === 'string' &&
    typeof obj.chain_id === 'number' &&
    typeof obj.is_deposit === 'boolean' &&
    typeof obj.nonce === 'string'
  );
}

// Type predicate for JSONRPCResponse
export function isJSONRPCResponse(obj: any): obj is JSONRPCResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.jsonrpc === 'string' &&
    typeof obj.id === 'string' &&
    typeof obj.method === 'string' &&
    (typeof obj.params === 'object' || Array.isArray(obj.params) || typeof obj.params === 'string')
  );
}
