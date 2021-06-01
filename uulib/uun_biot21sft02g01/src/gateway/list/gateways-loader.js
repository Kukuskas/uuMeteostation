import UU5 from "uu5g04";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import Config from "../config/config";
import Calls from "calls";
import { GatewaysContext } from "./context/context";
//@@viewOff:imports

export const GatewaysLoader = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "GatewaysLoader",
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

  render({ baseUri, children }) {
    //@@viewOn:hooks
    const gatewaysList = useDataList({
      handlerMap: {
        load: handleLoad,
        create: handleCreate,
      },
      initialDtoIn: {},
    });
    //@@viewOff:hooks

    //@@viewOn:handlers
    async function handleLoad() {
      return await Calls.gatewayList(baseUri);
    }

    async function handleCreate(dtoIn) {
      return await Calls.gatewayCreate(baseUri, dtoIn);
    }


    //@@viewOff:handlers

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <GatewaysContext.Provider value={gatewaysList}>{children}</GatewaysContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default GatewaysLoader;
