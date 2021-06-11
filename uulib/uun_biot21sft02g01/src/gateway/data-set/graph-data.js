//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
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
    const [dates, setDates]= useState()

    console.log("graph-data props", dates);

    async function _handleChange(opt) {
      console.log(opt.values);
      let startDate;
      let endDate;
      let type;
      if (opt.values.type== "daily") {
        type = "hourly"
      }else{
        type =opt.values.type
      }
      if (opt.values.date) {
        startDate = opt.values.date.toISOString().slice(0, 10);
        endDate = opt.values.date.toISOString().slice(0, 10);
       
      } else if(opt.values.dateInterval[0].length<5){
        startDate = opt.values.dateInterval[0]+"-01-01"
        endDate = opt.values.dateInterval[1]+"-12-20"
      } else if(opt.values.dateInterval[0].length<8){
        startDate = opt.values.dateInterval[0]+"-01"
        endDate = opt.values.dateInterval[1]+"-20"
      }else{
        startDate = opt.values.dateInterval[0].toISOString().slice(0, 10);
        endDate = opt.values.dateInterval[1].toISOString().slice(0, 10);
      }
      setDates([startDate,endDate])

      console.log("Loooooooooooooooooooooooog", opt.values);
      try {
        await datasetDataList?.handlerMap.reload(props.gatewayCode, type, startDate, endDate);
      } catch (e) {
        console.log("Will work later on error of  delete");
        return;
      }
    }

    return (
      <>
        <DataListStateResolver dataList={datasetDataList}>
          <GraphForm change={_handleChange} date={props.date} interval={props.interval} />
          <GraphLoaded datasetDataList={datasetDataList.data} dates={dates}></GraphLoaded>
        </DataListStateResolver>
      </>
    );
  },
});

export default GraphData;
