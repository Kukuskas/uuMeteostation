//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
import DataPending from "./data-pending";
import DataError from "./data-error";
import Lsi from "./error-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "DataListStateResolver",
  //@@viewOff:statics
};

export const DataListStateResolver = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) { let child = null;
    switch (props.dataList.state) {
      case "ready":
      case "error":
      case "pending":
      case "itemPending": {
        child = props.children;
        break;
      }
      case "readyNoData": {
        // ready no data
        child = <UU5.Bricks.Block background colorSchema="warning" content="noData" />;
        break;
      }
      case "errorNoData": {
        child = <DataError height={props.height} moreInfo errorData={props.dataList.errorData} />;
        break;
      }
      case "pendingNoData": {
        child = <DataPending height={props.height} />;
        break;
      }
      default: {
        child = <DataError height={props.height} errorLsi={Lsi.contextError} />;
      }
    }

    return child;
  },
});

export default DataListStateResolver;
