import UU5 from "uu5g04";
import { createComponent, useDataObject } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import Config from "../config/config";
import Calls from "calls";
import { GatewayContext } from "./context/context";
//@@viewOff:imports

export const GatewayLoader = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayLoader",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    baseUri: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    baseUri: undefined,
  },
  //@@viewOff:defaultProps

  render({ baseUri, children, dtoIn }) {
    //@@viewOn:hooks
    const gatewayDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
      },
      initialDtoIn: {},
    });
    //@@viewOff:hooks

    //@@viewOn:handlers
    async function handleLoad() {
      console.log(dtoIn);
     // console.log("ddtoOut dataInfo", await Calls.gatewayGet(baseUri,dtoIn));
      return await Calls.gatewayGet(baseUri,dtoIn);
    }

    //@@viewOff:handlers

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <GatewayContext.Provider value={gatewayDataObject}>{children}</GatewayContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
  //@@viewOff:helpers

  export default GatewayLoader;