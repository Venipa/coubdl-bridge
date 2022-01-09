import createApp from "./app";
import windowExtend from "./window-extend";

const context = COUB_DL_CONTEXT;
windowExtend();
(() => {
  createApp({ env: { dev: !context.production, ...context } });
})();
