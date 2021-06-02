//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import Config from "./config/config";
import DataPending from "./data-pending";
import DataError from "./data-error";
import Lsi from "./error-lsi";
//@@viewOff:imports

export const DataListStateResolver = createComponent({
  displayName: Config.TAG + "DataListStateResolver",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    dataList: UU5.PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    dataList: {},
  },

  render(props) {
    let child = null;
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
