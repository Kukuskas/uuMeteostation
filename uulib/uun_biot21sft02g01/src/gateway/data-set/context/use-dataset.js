import { useContext } from "uu5g04-hooks";
import Context from "./dataset-context";

export function useDataset() {
  return useContext(Context);
}

export default useDataset;
