//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
import GatewayDetail from "./gateway-detail";
import Uu5Tiles from "uu5tilesg02";
import GatewayCreateForm from "./gateway-create-form";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Gateways",
  //@@viewOff:statics
};

export const Gateways = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    baseUri: UU5.PropTypes.string,
    gatewaysList: UU5.PropTypes.array,
    colorSchema: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes
  
  //@@viewOn:defaultProps
  defaultProps: {
    baseUri: undefined,
    gatewaysList: [],
    colorSchema: undefined,
    bgStyle: undefined,
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
      function renderItem(item) {
        return (
          <GatewayDetail
            gateway={item.data.data}
            onDetail={props.onDetail}
            onDelete={props.onDelete}
          />
          
      );
    }


    return (
      <>
            <GatewayCreateForm  
            onCreate={props.onCreate}
            onSaveFail={props.onSaveFail}></GatewayCreateForm>
      <Uu5Tiles.ControllerProvider data={props.gatewaysList}>
      <Uu5Tiles.Grid tileMinWidth={250} tileMaxWidth={250} tileSpacing={8} rowSpacing={8}>
        {renderItem}
      </Uu5Tiles.Grid>
    </Uu5Tiles.ControllerProvider>
    </>
    )
    //@@viewOff:render
  },
});

export default Gateways;