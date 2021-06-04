//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import GraphData from "./graph-data";
import GraphForm from "./graph-form";
import Config from "./config/config";
import DatasetLoader from "./dataset-loader";
// import DatasetLoader from "./dataset-loader"
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Graph",
  //@@viewOff:statics
};

export const Graph = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentDatasetInterval, setCurrentDatasetInterval] = useState("hourly");
    const [rerenderGraph, setRerenderGraph] = useState(false);

    if (startDate == "") {
      let date = new Date();
      date = date.toISOString().slice(0, 10);
      endDate == ""
        ? (setStartDate("2021-06-01"), setEndDate("2021-06-01"))
        : console.log("Impossible! Or any Bug happens :O ?");
    }

    // function _handleChange(params){
    //   console.log("Loooooooooooooooooooooooog",params);
    //   // setStartDate()
    //   setCurrentDatasetInterval(params.values.types)
    // }

    return (
      <>
        <DatasetLoader
          gatewayCode={props.data.code}
          type={currentDatasetInterval}
          startDate={startDate}
          endDate={endDate}
        >
          <GraphData gatewayCode={props.data.code} />
        </DatasetLoader>
      </>
    );
    //@@viewOff:render
  },
});

export default Graph;
