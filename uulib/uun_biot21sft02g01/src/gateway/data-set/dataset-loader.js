import UU5 from "uu5g04";
import { createComponent, useDataList } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import Config from "../config/config";
import Calls from "calls";
import { DatasetContext } from "./context/context";
//@@viewOff:imports

export const DatasetLoader = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "DatasetLoader",
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

  render({ baseUri, children, gatewayCode, type, startDate, endDate }) {
    //@@viewOn:hooks
    const datasetDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        reload: handleReload,
      },
      initialDtoIn: {},
    });
    //@@viewOff:hooks

    //@@viewOn:handlers
    async function handleLoad() {
      const dtoIn = {
        gatewayCode,
        type,
        startDate,
        endDate,
      };
      console.log("dtoIn", dtoIn);
      baseUri = "https://uuapp.plus4u.net/uun-biot21sft02-maing01/44701e7183e94852859303f2bfca9a7f/";
      return await Calls.datasetListByDates(baseUri, dtoIn);
    }

    async function handleReload(gatewayCode, type, startDate, endDate, date) {
      if (date) {
        startDate = date;
        endDate = date;
      }
      const dtoIn = {
        gatewayCode,
        type,
        startDate,
        endDate,
      };
      // console.log("dtoIn of RELOAD", dtoIn);
      baseUri = "https://uuapp.plus4u.net/uun-biot21sft02-maing01/44701e7183e94852859303f2bfca9a7f/";
      return await Calls.datasetListByDates(baseUri, dtoIn);
    }

    //@@viewOff:handlers

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <DatasetContext.Provider value={datasetDataList}>{children}</DatasetContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default DatasetLoader;
