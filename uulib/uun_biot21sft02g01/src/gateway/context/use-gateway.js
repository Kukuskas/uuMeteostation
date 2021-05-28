import { useContext } from "uu5g04-hooks";
import Context from "./gateway-context";

export function useGateway() {
  return useContext(Context);
}

export default useGateway;
