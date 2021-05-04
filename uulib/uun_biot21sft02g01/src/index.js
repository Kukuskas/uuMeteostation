import UU5 from "uu5g04";
import * as Gateway from "./gateway/gateway.js";
export { Gateway };
import * as Core from "./core/core.js";
export { Core };
export default { Gateway, Core };

if (process.env.NODE_ENV !== "test") {
  console.log(
    `${process.env.NAME}-${process.env.VERSION} © Unicorn\nTerms of Use: https://unicorn.com/tou/${process.env.NAME}`
  );
}
UU5.Environment.addRuntimeLibrary({
  name: process.env.NAME,
  version: process.env.VERSION,
  namespace: process.env.NAMESPACE,
});
