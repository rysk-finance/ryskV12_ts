import Rysk, { Env } from "ryskv12";
import { isJSONRPCResponse, isRequest } from "ryskv12/models";

const main = () => {
  const pk = process.env.RYSK_SDK_PK || "...";
  const maker = "0x...";
  const sdk = new Rysk(Env.LOCAL, pk, "./ryskV12");

  const makerChan = "MAKER_CHAN";
  const makerProc = sdk.execute(sdk.connectArgs(makerChan, "maker"));
  makerProc.stdout.on("data", (d) => {
    console.log(d.toString());
  });
  makerProc.stderr.on("data", (d) => {
    console.log(d.toString());
  });

  const rfqHandler = (payload) => {
    try {
      const data = JSON.parse(payload.toString());
      if (isJSONRPCResponse(data)) {
        const { id, result } = data;
        if (isRequest(result)) {
          // replace with actual quoting logic
          const quote = {
            assetAddress: result.asset,
            chainId: result.chainId,
            expiry: result.expiry,
            isPut: result.isPut,
            isTakerBuy: false,
            maker,
            nonce: Date.now().toString(),
            price: "1000000000",
            quantity: result.quantity,
            strike: result.strike,
            validUntil: Math.ceil(Date.now() / 1000 + 30),
          };
          let proc = sdk.execute(sdk.quoteArgs(makerChan, id, quote));
          proc.stdout.on("data", (d) => {
            console.log(d.toString());
          });
          proc.stderr.on("data", (d) => {
            console.log(d.toString());
          });
        }
      }
    } catch (e) {
      console.log("error");
      console.error(e);
    }
  };

  const rfqChan = "BASE_WETH_CHAN";
  const p = sdk.execute(
    sdk.connectArgs(rfqChan, "rfqs/0xb67bfa7b488df4f2efa874f4e59242e9130ae61f")
  );

  p.stdout.on("data", rfqHandler);
};
