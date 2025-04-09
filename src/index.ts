import { spawn } from "child_process";
import { Quote, Transfer } from "./types";

export enum Env {
  LOCAL = 0,
  TESTNET = 1,
  MAINNET = 2,
}

interface EnvConfigPayload {
  base_url: string;
}

class EnvConfig implements EnvConfigPayload {
  public readonly base_url: string;

  constructor(base_url: string) {
    this.base_url = base_url;
  }
}

const ENV_CONFIGS: { [key in Env]: EnvConfig } = {
  [Env.LOCAL]: new EnvConfig("ws://localhost:8000/"),
  [Env.TESTNET]: new EnvConfig("wss://rip-testnet.rysk.finance/"),
  [Env.MAINNET]: new EnvConfig(""),
};

class Rysk {
  private _env: Env;
  private _cli_path: string;
  private _private_key: string;

  constructor(env: Env, privateKey: string, v12CliPath: string = "./ryskV12") {
    this._env = env;
    this._cli_path = v12CliPath;
    this._private_key = privateKey;
  }

  private _url(uri: string): string {
    return `${ENV_CONFIGS[this._env].base_url}${uri}`;
  }

  public execute(
    args: Array<string> = [],
    stdOutHandler: (data: string) => any | Promise<any> = console.log,
    stdErrHandler: (data: string) => any | Promise<any> = console.error,
    closeHandler: (code: number) => any | Promise<any> = console.log,
    errHandler: (err: Error) => any | Promise<any> = (err) => {
      throw err;
    }
  ) {
    const proc = spawn(this._cli_path, args, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (proc.stdout) {
      process.stdout.on("data", stdOutHandler);
    }
    if (proc.stderr) {
      proc.stderr.on("data", stdErrHandler);
    }
    proc.on("close", closeHandler);
    proc.on("error", errHandler);
  }

  public connectArgs(channelId: string, uri: string) {
    return ["connect", "--channel_id", channelId, "--url", this._url(uri)];
  }

  public approveArgs(channelId: string, chainId: number, amount: string) {
    return [
      "approve",
      "--channel_id",
      channelId,
      "--chain_id",
      chainId.toString(),
      "--amount",
      amount,
      "--private_key",
      this._private_key,
    ];
  }

  public balancesArgs(channelId: string, account: string) {
    return ["balances", "--channel_id", channelId, "--account", account];
  }

  public transferArgs(channelId: string, transfer: Transfer) {
    return [
      "transfer",
      "--channel_id",
      channelId,
      "--chain_id",
      transfer.chain_id.toString(),
      "--asset",
      transfer.asset,
      "--amount",
      transfer.amout,
      "--is_deposit",
      transfer.is_deposit ? "true" : "false",
      "--nonce",
      transfer.nonce,
      "--private_key",
      this._private_key,
    ];
  }

  public positionsArgs(channelId: string, account: string) {
    return ["positions", "--channel_id", channelId, "--account", account];
  }

  public quoteArgs(channelId: string, rfqId: string, quote: Quote) {
    return [
      "quote",
      "--channel_id",
      channelId,
      "--rfq_id",
      rfqId,
      "--asset_address",
      quote.assetAddress,
      "--chain_id",
      quote.chainId.toString(),
      "--expiry",
      quote.expiry.toString(),
      "--is_put",
      quote.isPut ? "true" : "false",
      "--is_taker_buy",
      quote.isTakerBuy ? "true" : "false",
      "--maker",
      quote.maker,
      "--nonce",
      quote.nonce,
      "--price",
      quote.price,
      "--quantity",
      quote.quantity,
      "--strike",
      quote.strike,
      "--valid_until",
      quote.validUntil.toString(),
      "--private_key",
      this._private_key,
    ];
  }
}

export default Rysk;
