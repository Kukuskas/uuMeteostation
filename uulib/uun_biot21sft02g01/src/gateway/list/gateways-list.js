//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
import GatewayDetail from "./gateway-detail";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewaysList",
  //@@viewOff:statics
};

export const GatewaysList = createComponent({
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
          onDetail={onDetail}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      );
    }


    return (
      <>
      {/* <GatewayCreateForm
      // shown={showCreateModal}
      onSave={handleCreateGateway}
      onCancel={handleCloseGatewayCreateForm}!!!!!!!!!!!!!!!!!!
    /> */}
      <Uu5Tiles.ControllerProvider data={props.gatewaysList}>
      {/* <Uu5Tiles.ActionBar actions={actionList} /> */}
      <Uu5Tiles.Grid tileHeight="auto" tileMinWidth={200} tileMaxWidth={300} tileSpacing={8} rowSpacing={8}>
        {renderItem}
      </Uu5Tiles.Grid>
    </Uu5Tiles.ControllerProvider>
    </>
    )
    //@@viewOff:render
  },
});

export default GatewaysList;
