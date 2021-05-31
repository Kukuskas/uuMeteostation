//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import GraphData from "./graph-data"
import GraphForm from "./graph-form"
import Config from "./config/config";
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
    
    const [currentDatasetDate, setCurrentDatasetDate] = useState("")
    const [currentDatasetInterval, setCurrentDatasetInterval] = useState("daily")
    if (currentDatasetDate== "") {
      let date = new Date
      date = date.toISOString().slice(0,10)
      setCurrentDatasetDate(date);
    }

    function _handleChange(params){
      setCurrentDatasetDate(params.values)
      console.log(params.values);
    }
    let graphData2=  {
      "awid": "44701e7183e94852859303f2bfca9a7f",
      "gatewayId": "607ae102ce50a00027c742fc",
      "startDate": "2021-05-28T00:00:00.000Z",
      "endDate": "2021-05-28T00:00:00.000Z",
      "type": "detailed",
      "data": [
        {
          "temperature": 10.4,
          "humidity": 68.5,
          "timestamp": "2021-05-28T00:00:00+02:00"
        },
        {
          "temperature": 10.3,
          "humidity": 68.59,
          "timestamp": "2021-05-28T00:10:00+02:00"
        },
        {
          "temperature": 10.19,
          "humidity": 69.7,
          "timestamp": "2021-05-28T00:20:00+02:00"
        },
        {
          "temperature": 10.19,
          "humidity": 70.4,
          "timestamp": "2021-05-28T00:30:00+02:00"
        },
        {
          "temperature": 10.19,
          "humidity": 71.3,
          "timestamp": "2021-05-28T00:40:00+02:00"
        },
        {
          "temperature": 10.1,
          "humidity": 71.7,
          "timestamp": "2021-05-28T00:50:00+02:00"
        },
        {
          "temperature": 10.1,
          "humidity": 71.9,
          "timestamp": "2021-05-28T01:00:00+02:00"
        },
        {
          "temperature": 10.1,
          "humidity": 71.8,
          "timestamp": "2021-05-28T01:10:00+02:00"
        },
        {
          "temperature": 10,
          "humidity": 72.2,
          "timestamp": "2021-05-28T01:20:00+02:00"
        },
        {
          "temperature": 10,
          "humidity": 72.59,
          "timestamp": "2021-05-28T01:30:00+02:00"
        },
        {
          "temperature": 10,
          "humidity": 72.8,
          "timestamp": "2021-05-28T01:40:00+02:00"
        },
        {
          "temperature": 9.9,
          "humidity": 73.3,
          "timestamp": "2021-05-28T01:50:00+02:00"
        },
        {
          "temperature": 9.9,
          "humidity": 73.8,
          "timestamp": "2021-05-28T02:00:00+02:00"
        },
        {
          "temperature": 9.8,
          "humidity": 74.09,
          "timestamp": "2021-05-28T02:10:00+02:00"
        },
        {
          "temperature": 9.69,
          "humidity": 74.4,
          "timestamp": "2021-05-28T02:20:00+02:00"
        },
        {
          "temperature": 9.69,
          "humidity": 74.45,
          "timestamp": "2021-05-28T02:30:00+02:00"
        },
        {
          "temperature": 9.5,
          "humidity": 74.9,
          "timestamp": "2021-05-28T02:40:00+02:00"
        },
        {
          "temperature": 9.4,
          "humidity": 75.59,
          "timestamp": "2021-05-28T02:50:00+02:00"
        },
        {
          "temperature": 9.5,
          "humidity": 75.5,
          "timestamp": "2021-05-28T03:00:00+02:00"
        },
        {
          "temperature": 9.4,
          "humidity": 75.8,
          "timestamp": "2021-05-28T03:10:00+02:00"
        },
        {
          "temperature": 9.4,
          "humidity": 75.8,
          "timestamp": "2021-05-28T03:20:00+02:00"
        },
        {
          "temperature": 9.4,
          "humidity": 75.9,
          "timestamp": "2021-05-28T03:30:00+02:00"
        },
        {
          "temperature": 9.3,
          "humidity": 76.2,
          "timestamp": "2021-05-28T03:40:00+02:00"
        },
        {
          "temperature": 9.3,
          "humidity": 76.2,
          "timestamp": "2021-05-28T03:50:00+02:00"
        },
        {
          "temperature": 9.3,
          "humidity": 76.4,
          "timestamp": "2021-05-28T04:00:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 76.59,
          "timestamp": "2021-05-28T04:10:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 77.5,
          "timestamp": "2021-05-28T04:20:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 77.3,
          "timestamp": "2021-05-28T04:30:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 77.4,
          "timestamp": "2021-05-28T04:40:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 77.59,
          "timestamp": "2021-05-28T04:50:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 77.8,
          "timestamp": "2021-05-28T05:00:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 78.3,
          "timestamp": "2021-05-28T05:10:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 78.09,
          "timestamp": "2021-05-28T05:20:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 78.3,
          "timestamp": "2021-05-28T05:30:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 78.7,
          "timestamp": "2021-05-28T05:40:00+02:00"
        },
        {
          "temperature": 9.1,
          "humidity": 78.9,
          "timestamp": "2021-05-28T05:50:00+02:00"
        },
        {
          "temperature": 9.19,
          "humidity": 79.09,
          "timestamp": "2021-05-28T06:00:00+02:00"
        },
        {
          "temperature": 9.3,
          "humidity": 79.5,
          "timestamp": "2021-05-28T06:10:00+02:00"
        },
        {
          "temperature": 9.4,
          "humidity": 79.4,
          "timestamp": "2021-05-28T06:20:00+02:00"
        },
        {
          "temperature": 9.6,
          "humidity": 79.5,
          "timestamp": "2021-05-28T06:30:00+02:00"
        },
        {
          "temperature": 9.6,
          "humidity": 78.8,
          "timestamp": "2021-05-28T06:40:00+02:00"
        },
        {
          "temperature": 9.69,
          "humidity": 78.7,
          "timestamp": "2021-05-28T06:50:00+02:00"
        },
        {
          "temperature": 9.8,
          "humidity": 78.9,
          "timestamp": "2021-05-28T07:00:00+02:00"
        },
        {
          "temperature": 10,
          "humidity": 79.2,
          "timestamp": "2021-05-28T07:10:00+02:00"
        },
        {
          "temperature": 10.19,
          "humidity": 79,
          "timestamp": "2021-05-28T07:20:00+02:00"
        },
        {
          "temperature": 10.3,
          "humidity": 78.5,
          "timestamp": "2021-05-28T07:30:00+02:00"
        },
        {
          "temperature": 10.5,
          "humidity": 77.8,
          "timestamp": "2021-05-28T07:40:00+02:00"
        },
        {
          "temperature": 10.6,
          "humidity": 77,
          "timestamp": "2021-05-28T07:50:00+02:00"
        },
        {
          "temperature": 10.8,
          "humidity": 76.25,
          "timestamp": "2021-05-28T08:00:00+02:00"
        },
        {
          "temperature": 10.9,
          "humidity": 76.2,
          "timestamp": "2021-05-28T08:10:00+02:00"
        },
        {
          "temperature": 11.7,
          "humidity": 75.5,
          "timestamp": "2021-05-28T08:20:00+02:00"
        },
        {
          "temperature": 12.1,
          "humidity": 73.3,
          "timestamp": "2021-05-28T08:30:00+02:00"
        },
        {
          "temperature": 12.1,
          "humidity": 72.3,
          "timestamp": "2021-05-28T08:40:00+02:00"
        },
        {
          "temperature": 12.4,
          "humidity": 71.2,
          "timestamp": "2021-05-28T08:50:00+02:00"
        },
        {
          "temperature": 12.5,
          "humidity": 71.09,
          "timestamp": "2021-05-28T09:00:00+02:00"
        },
        {
          "temperature": 12.7,
          "humidity": 70.2,
          "timestamp": "2021-05-28T09:10:00+02:00"
        },
        {
          "temperature": 13.5,
          "humidity": 67.9,
          "timestamp": "2021-05-28T09:20:00+02:00"
        },
        {
          "temperature": 13.5,
          "humidity": 67.65,
          "timestamp": "2021-05-28T09:30:00+02:00"
        },
        {
          "temperature": 14.4,
          "humidity": 64.5,
          "timestamp": "2021-05-28T09:40:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 63,
          "timestamp": "2021-05-28T09:50:00+02:00"
        },
        {
          "temperature": 15.5,
          "humidity": 60.3,
          "timestamp": "2021-05-28T10:00:00+02:00"
        },
        {
          "temperature": 15.4,
          "humidity": 61.9,
          "timestamp": "2021-05-28T10:10:00+02:00"
        },
        {
          "temperature": 15.3,
          "humidity": 61.5,
          "timestamp": "2021-05-28T10:20:00+02:00"
        },
        {
          "temperature": 15.3,
          "humidity": 60.2,
          "timestamp": "2021-05-28T10:30:00+02:00"
        },
        {
          "temperature": 15.3,
          "humidity": 57.8,
          "timestamp": "2021-05-28T10:40:00+02:00"
        },
        {
          "temperature": 15.6,
          "humidity": 58.5,
          "timestamp": "2021-05-28T10:50:00+02:00"
        },
        {
          "temperature": 16,
          "humidity": 58.1,
          "timestamp": "2021-05-28T11:00:00+02:00"
        },
        {
          "temperature": 16.2,
          "humidity": 57.1,
          "timestamp": "2021-05-28T11:10:00+02:00"
        },
        {
          "temperature": 16.5,
          "humidity": 56.2,
          "timestamp": "2021-05-28T11:20:00+02:00"
        },
        {
          "temperature": 16.5,
          "humidity": 55.3,
          "timestamp": "2021-05-28T11:30:00+02:00"
        },
        {
          "temperature": 16,
          "humidity": 62.3,
          "timestamp": "2021-05-28T11:40:00+02:00"
        },
        {
          "temperature": 15.6,
          "humidity": 68.4,
          "timestamp": "2021-05-28T11:50:00+02:00"
        },
        {
          "temperature": 15.3,
          "humidity": 68.8,
          "timestamp": "2021-05-28T12:00:00+02:00"
        },
        {
          "temperature": 15.1,
          "humidity": 69.4,
          "timestamp": "2021-05-28T12:10:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 68.8,
          "timestamp": "2021-05-28T12:20:00+02:00"
        },
        {
          "temperature": 15.1,
          "humidity": 68.55,
          "timestamp": "2021-05-28T12:30:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 66.8,
          "timestamp": "2021-05-28T12:40:00+02:00"
        },
        {
          "temperature": 14.9,
          "humidity": 65.7,
          "timestamp": "2021-05-28T12:50:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 66.59,
          "timestamp": "2021-05-28T13:00:00+02:00"
        },
        {
          "temperature": 15.2,
          "humidity": 66.9,
          "timestamp": "2021-05-28T13:10:00+02:00"
        },
        {
          "temperature": 14.7,
          "humidity": 63.2,
          "timestamp": "2021-05-28T13:20:00+02:00"
        },
        {
          "temperature": 14.5,
          "humidity": 64.59,
          "timestamp": "2021-05-28T13:30:00+02:00"
        },
        {
          "temperature": 14.2,
          "humidity": 67.59,
          "timestamp": "2021-05-28T13:40:00+02:00"
        },
        {
          "temperature": 14,
          "humidity": 71.3,
          "timestamp": "2021-05-28T13:50:00+02:00"
        },
        {
          "temperature": 14,
          "humidity": 71.59,
          "timestamp": "2021-05-28T14:00:00+02:00"
        },
        {
          "temperature": 14,
          "humidity": 71.55,
          "timestamp": "2021-05-28T14:10:00+02:00"
        },
        {
          "temperature": 14.3,
          "humidity": 72.9,
          "timestamp": "2021-05-28T14:20:00+02:00"
        },
        {
          "temperature": 14.45,
          "humidity": 71.75,
          "timestamp": "2021-05-28T14:30:00+02:00"
        },
        {
          "temperature": 14.6,
          "humidity": 71.8,
          "timestamp": "2021-05-28T14:40:00+02:00"
        },
        {
          "temperature": 14.7,
          "humidity": 70.7,
          "timestamp": "2021-05-28T14:50:00+02:00"
        },
        {
          "temperature": 14.7,
          "humidity": 69.9,
          "timestamp": "2021-05-28T15:00:00+02:00"
        },
        {
          "temperature": 14.7,
          "humidity": 69.3,
          "timestamp": "2021-05-28T15:10:00+02:00"
        },
        {
          "temperature": 14.8,
          "humidity": 69.7,
          "timestamp": "2021-05-28T15:20:00+02:00"
        },
        {
          "temperature": 14.9,
          "humidity": 68.2,
          "timestamp": "2021-05-28T15:30:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 67.4,
          "timestamp": "2021-05-28T15:40:00+02:00"
        },
        {
          "temperature": 15,
          "humidity": 66.2,
          "timestamp": "2021-05-28T15:50:00+02:00"
        },
        {
          "temperature": 15.2,
          "humidity": 66.3,
          "timestamp": "2021-05-28T16:00:00+02:00"
        },
        {
          "temperature": 15.2,
          "humidity": 64.2,
          "timestamp": "2021-05-28T16:10:00+02:00"
        },
        {
          "temperature": 15.2,
          "humidity": 64,
          "timestamp": "2021-05-28T16:20:00+02:00"
        },
        {
          "temperature": 15.2,
          "humidity": 64.7,
          "timestamp": "2021-05-28T16:30:00+02:00"
        }]}
        let graphData = graphData2.data.map(item=>{
          return {
            label: item.timestamp.match(/\d\d:\d\d/),
            value: item.temperature,
            value2: item.humidity
          }
        })

    return (
    <>
    {/* <DatasetLoader> */}
    <GraphForm change={_handleChange} date={currentDatasetDate} interval={currentDatasetInterval}></GraphForm>
<GraphData graphData={graphData} ></GraphData>
    {/* </DatasetLoader> */}
    </>
    );
    //@@viewOff:render
  },
});

export default Graph;
