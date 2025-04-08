import { spawn } from "child_process";
import {
  HexString,
  JSONResponseHandler,
  JSONRPCResponse,
  Quote,
  Transfer,
} from "./types";

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

  public connect(
    channelId: string,
    uri: string,
    handler: JSONResponseHandler
  ): void {
    /**
     * Instantiate a new websocket connection with a given id.
     */
    try {
      const command = `${
        this._cli_path
      } connect --channel_id ${channelId} --url ${this._url(uri)}`;
      const process = spawn(command, [], {
        shell: true,
        stdio: ["pipe", "pipe", "pipe"], // stdin, stdout, stderr
      });

      if (process.stdout) {
        process.stdout.on("data", (data: string) => {
          const lines = data.toString().trim().split("\n");
          for (const line of lines) {
            if (line) {
              try {
                const res: JSONRPCResponse = JSON.parse(line);
                handler(res);
              } catch (e) {
                console.error("Error parsing JSON:", e, line);
              }
            }
          }
        });
      }

      if (process.stderr) {
        process.stderr.on("data", (data: string) => {
          console.error(`CLI error: ${data}`);
        });
      }

      process.on("close", (code) => {
        console.log(`CLI process exited with code ${code}`);
      });

      process.on("error", (err) => {
        console.error(`CLI process error: ${err}`);
      });
    } catch (e: any) {
      console.error(`Exception raised ${e}`);
    }
  }

  public approve(channelId: string, chainId: number, amount: string): void {
    spawn(
      this._cli_path,
      [
        "approve",
        "--channel_id",
        channelId,
        "--chain_id",
        chainId.toString(),
        "--amount",
        amount,
        "--private_key",
        this._private_key,
      ],
      { stdio: "inherit" }
    );
  }

  public balances(channelId: string, account: HexString): void {
    spawn(
      this._cli_path,
      [
        "balances",
        "--channel_id",
        channelId,
        "--account",
        account
      ],
      { stdio: "inherit" }
    );
  }

  public transfer(channelId: string, transfer: Transfer): void {
    /**
     * Send a transfer request through the given channel_id.
     * The response will be readable through the channel output.
     */
    spawn(
      this._cli_path,
      [
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
      ],
      { stdio: "inherit" }
    );
  }

  public positions(channelId: string, account: HexString): void {
    spawn(
      this._cli_path,
      [
        "positions",
        "--channel_id",
        channelId,
        "--account",
        account
      ],
      { stdio: "inherit" }
    );
  }

  public quote(channelId: string, reply_id: string, quote: Quote): void {
    /**
     * Send a quote through the given channel_id.
     * The response will be readable through the channel output.
     */
    spawn(
      this._cli_path,
      [
        "quote",
        "--channel_id",
        channelId,
        "--reply_id",
        reply_id,
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
      ],
      { stdio: "inherit" }
    );
  }
}

export default Rysk;
