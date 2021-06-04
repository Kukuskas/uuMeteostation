//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useEffect } from "uu5g04-hooks";
import "uu5chartg01";
import Config from "./config/config";
import useDataset from "./context/use-dataset";
import DataListStateResolver from "../../core/data-list-state-resolver";
import GraphLoaded from "./graph-loaded";
import GraphForm from "./graph-form";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Graph",
  //@@viewOff:statics
};

export const GraphData = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const datasetDataList = useDataset();

    // console.log("graph-data props", datasetDataList);

    async function _handleChange(opt) {
      let startDate;
      let endDate;
      if (opt.values.date) {
        startDate = opt.values.date.toISOString().slice(0, 10);
        endDate = opt.values.date.toISOString().slice(0, 10);
      } else {
        startDate = opt.values.dateInterval[0].toISOString().slice(0, 10);
        endDate = opt.values.dateInterval[1].toISOString().slice(0, 10);
      }

      // console.log("Loooooooooooooooooooooooog", opt.values);
      try {
        await datasetDataList?.handlerMap.reload(props.gatewayCode, "hourly", startDate, endDate);
      } catch (e) {
        console.log("Will work later on error of  delete");
        return;
      }
    }

    return (
      <>
        <DataListStateResolver dataList={datasetDataList}>
          <GraphForm change={_handleChange} date={props.date} interval={props.interval} />
          <GraphLoaded datasetDataList={datasetDataList.data}></GraphLoaded>
        </DataListStateResolver>
      </>
    );
  },
});

export default GraphData;
