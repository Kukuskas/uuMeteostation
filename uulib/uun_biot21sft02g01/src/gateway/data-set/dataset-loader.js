import UU5 from "uu5g04";
import { createComponent, useDataObject } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import Config from "../config/config";
import Calls from "calls";
import { DatasetContext } from "./context/context";
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

  render({ baseUri, children }) {
    //@@viewOn:hooks
    const datasetDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
      },
      initialDtoIn: {},
    });
    //@@viewOff:hooks

    //@@viewOn:handlers
    async function handleLoad(dtoIn) {
      return await Calls.datasetGet(baseUri, dtoIn);
    }

    //@@viewOff:handlers

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <DatasetContext.Provider value={datasetDataObject}>{children}</DatasetContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default GatewayLoader;