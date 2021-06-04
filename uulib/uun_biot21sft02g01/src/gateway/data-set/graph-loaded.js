//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import "uu5chartg01";
import Config from "./config/config";
import useDataset from "./context/use-dataset";
import DataListStateResolver from "../../core/data-list-state-resolver";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GraphLoaded",
  //@@viewOff:statics
};

export const GraphLoaded = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    console.log("graph-loaded props", props.datasetDataList);
    if (!props.datasetDataList[0]) {
      return (
        <UU5.Bricks.Box colorSchema="orange" style="display:flex, justify-content: center">
          <UU5.Bricks.Header style="text-align: center">
            No data avaible.
          </UU5.Bricks.Header>
          <br/>
        </UU5.Bricks.Box>
      );
    }
    let datasetArray = props.datasetDataList[0].data.data;
    if (props.datasetDataList.length > 1) {
      let itemListLength = props.datasetDataList[props.datasetDataList.length - 1].data.itemList;
      let allData = [];
      let count = 0
      for (let i = 0; i < itemListLength.length; i++) {
        const element = itemListLength[i];
        for (let i = 0; i < element.data.length; i++) {
          const x = element.data[i];
            if (x.avg.temperature == null) {
count=+1
              }
          allData.push(x);
          //   }
        }
      }
      if (count==allData.length) {
        return (
          <UU5.Bricks.Box  style="display:flex, justify-content: center">
          <UU5.Bricks.Header style="text-align: center">
            Sorry, we miss data for this period of time.
          </UU5.Bricks.Header>
          <br/>
        </UU5.Bricks.Box>
        )
      }
      datasetArray = allData;
    }
    let min = { temp: 100, hum: 100 };
    let max = { temp: -100, hum: -100 };
    for (let i = 0; i < datasetArray.length - 1; i++) {
      const x = datasetArray[i];
      if (x.avg.humidity !== null && x.avg.humidity !== 0) {
        if (min.temp > x.avg.temperature) {
          min.temp = x.avg.temperature;
        }
        if (min.hum > x.avg.humidity) {
          min.hum = x.avg.humidity;
        }
        if (max.temp < x.avg.temperature) {
          max.temp = x.avg.temperature;
        }
        if (max.hum < x.avg.humidity) {
          max.hum = x.avg.humidity;
        }
      }
    }
    console.log(min, max);
    // let dataset =[]

    // for (let i = 0; i < datasetArray.length; i++) {
    //   const element = datasetArray[i];

    // }
    let graphData;
    if (datasetArray.length < 25) {
      graphData = datasetArray.map((item) => {
        return {
          label: item.timestamp.match(/\d\d:\d\d/),
          value: item.avg.temperature,
          value2: item.avg.humidity,
        };
      });
    } else {
      graphData = datasetArray.map((item) => {
        return {
          label: item.timestamp.slice(0, 10),
          value: item.avg.temperature,
          value2: item.avg.humidity,
        };
      });
    }
    console.log("FUUUUUUUUUUUH", graphData);

    return (
      <>
        <UU5.SimpleChart.AreaChart
          series={[
            {
              valueKey: "value",
              name: "T",
              colorSchema: "red",
              chartType: "monotone",
            },
            {
              valueKey: "value2",
              name: "H",
              colorSchema: "blue",
              chartType: "monotone",
            },
          ]}
          data={graphData}
        />
        hello
      </>
    );
  },
});

export default GraphLoaded;
