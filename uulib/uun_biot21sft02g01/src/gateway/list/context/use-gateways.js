import { useContext } from "uu5g04-hooks";
import Context from "./gateways-context";

export function useGateways() {
  return useContext(Context);
}

export default useGateways;
