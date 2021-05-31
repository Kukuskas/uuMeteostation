//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import "uu5chartg01";
import Config from "./config/config";
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

    return (
    <>
    {/* <DatasetLoader> */}
    <UU5.SimpleChart.AreaChart
    series={[{
      valueKey: "value",
      name: "T",
      colorSchema: "red",
      chartType: "monotone"
    },
      {
        valueKey: "value2",
        name: "H",
        colorSchema: "blue",
        chartType: "monotone"
      }]}
      data={props.graphData}
/>
    {/* </DatasetLoader> */}
    </>
    );
    //@@viewOff:render
  },
});

export default Graph;
