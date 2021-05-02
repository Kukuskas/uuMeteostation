
// import * as Context from "./context/context.js";
// export { Context };
// export * from "./gateway-edit-form.js";

import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu5g04-bricks";

import Gateways from "./gateways.js";
import { useGateways } from "./context/context";
import DataListStateResolver from "../../core/data-list-state-resolver";
import Config from "./config/config";
// import Lsi from "./list-lsi";
//@@viewOff:imports

const STATICS = {
  displayName: Config.TAG + "GatewaysList",
};

const GatewaysList = createVisualComponent({
  //@@viewOn:statics
  ...STATICS,
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {

    colorSchema: UU5.PropTypes.string,
    elevation: UU5.PropTypes.string,
    borderRadius: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.string,

  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {

    colorSchema: undefined,
    elevation: "2",
    borderRadius: "4px",
    bgStyle: undefined,

  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    // let gatewaysDataList = useGateways();
    let gatewaysDataList = useGateways();
    console.log("000000000000000000000000000000000");
    console.log(gatewaysDataList);
    let gatewaysList = gatewaysDataList.data;

    //@@viewOff:hooks

    //@@viewOn:private
    // let gatewaysList = gatewaysDataList.data;
    // let app = appDataObject.data;

    //@@viewOff:handlers
    function handleDelete(id) {

    }

    function handleChange(gateway) {
console.log(gateway);
    }

    function handleDetail(id) {
console.log("Id of a gateway is: ", id);
    }

    function handleAdd(gateway) {
      console.log("null");
    }

      return (
      <DataListStateResolver dataList={gatewaysDataList}>
        <Gateways gatewaysList={gatewaysList} onUpdate={handleChange} onDelete={handleDelete} onCreate={handleAdd} onDetail={handleDetail}/>
      </DataListStateResolver>
  )
    //@@viewOff:render
},
});

//viewOn:exports
export { GatewaysList };
export default GatewaysList;

