//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu5g04-bricks";

import { useGateway } from "./context/context";
import DataListStateResolver from "../core/data-list-state-resolver";
import DataObjectStateResolver from "../core/data-object-state-resolver";
import Current from "./current"
import Graph from "./data-set/graph"
import Config from "./config/config";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayData",
  //@@viewOff:statics
};

export const GatewayData = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    // let gatewaysDataList = useGateways();
    let gatewayDataInfo = useGateway();
    // let dataDataSet = useDataSet();
    let gatewayInfo = gatewayDataInfo.data;
    // console.log("gatewayDataInfo",gatewayDataInfo );
    // let dataSet = dataSet.data;

    //@@viewOff:hooks

    //@@viewOn:private
    // let gatewaysList = gatewaysDataList.data;
    // let app = appDataObject.data;

    //@@viewOff:handlers

      return (
<>
<DataListStateResolver dataList={gatewayDataInfo}>
<Current></Current>
<Graph  data={gatewayInfo}></Graph>
</DataListStateResolver>
</>
  )
    //@@viewOff:render
},
});

export default GatewayData;
