import Rysk, { Env } from "./src";

(function () {
  const r = new Rysk(Env.LOCAL, "");
  r.newConnection("ts_test", "ws/rfqs/0xb5a30b0fdc5ea94a52fdc42e3e9760cb8449fb37", console.log)
})();
