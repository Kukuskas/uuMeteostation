// import * as Context from "./context/context.js";
// export { Context };
// export * from "./gateway-edit-form.js";

import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
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
    //@@viewOff:hooks

    //@@viewOn:private
    let gatewaysList = gatewaysDataList.data;
    // let app = appDataObject.data;
    async function handleAdd(opt) {
      const input = {
          code: opt.code,
          name: opt.name, 
          location: opt.location, 
          locationDesc: opt.locationDesc, 
          timezone: opt.timezone, 
          uuEe: opt.uuEe, 
        };
      
      try {
        await gatewaysDataList?.handlerMap.create(input);
      } catch (e) {
        opt.component.saveFail(e)
        "Will work later on error of  delete";
        return;
      }
      opt.component.saveDone()
    }

    function handleAddFail({component, dtoOut, e}){
    
    component.getAlertBus().addAlert({
      content: <UU5.Bricks.Error errorData="error"/>,
      colorSchema: "danger"}
    )}


    //@@viewOff:handlers
      return (
        <DataListStateResolver dataList={gatewaysDataList}>
          <Gateways
            gatewaysList={gatewaysList}
            onDelete={props.onDelete}
            onCreate={handleAdd}
            onDetail={props.onDetail}
            onSaveFail={handleAddFail}
          />
        </DataListStateResolver>
      );

    //@@viewOff:render
  },
});

//viewOn:exports
export { GatewaysList };
export default GatewaysList;
