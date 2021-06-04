//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState, useEffect } from "uu5g04-hooks";
import "uu_pg01-bricks";
import "uu5g04-bricks";
import { useGateway } from "./context/context";
import MinMax from "./min-max";
import Calls from "calls";
import Config from "./config/config";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Current",
  //@@viewOff:statics
};

export const Current = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    gatewayId: UU5.PropTypes.string,
    gatewayCode: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(gatewayId, gatewayCode) {
    //@@viewOn:hooks
    const testData = useGateway().data;
    const [actualDate, setActualDate] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setActualDate(new Date()), 60000);
      return function cleanup() {
        clearInterval(timer);
      };
    });

    const [gatewayData, setGatewayData] = useState(testData);
    useEffect(() => {
      const id = setInterval(() => {
        const fetchData = async () => {
          try {
            const code = gatewayData.code;
            const id = gatewayData.id;
            const uuEe = gatewayData.uuEe;
            setGatewayData(await Calls.gatewayGet("https://uuapp.plus4u.net/uun-biot21sft02-maing01/44701e7183e94852859303f2bfca9a7f/",{gatewayId:id, gatewayCode:code, uuEe:uuEe}));
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, 600000);
      return () => clearInterval(id);
    }, []);

    //@@viewOff:hooks

    //@@viewOn:private

    //@@viewOff:handlers

    return (
      <UU5.Bricks.Box style="display: flex;">
        <UU5.Bricks.Section style="padding:10px; min-width:200px; max-width:49%; flex:1">
          <UU5.Bricks.Row>
              <UU5.Bricks.Header style="margin-top:0px">{gatewayData.name}</UU5.Bricks.Header>
          </UU5.Bricks.Row>
          <UU5.Bricks.Row display="flex" style="margin:10px">
            <UU5.Bricks.Text style="margin-right:10px">
              <UU5.Bricks.Icon style="color:darkorange;" icon="glyphicon-fire" /> {gatewayData.current.temperature}°C
            </UU5.Bricks.Text>

            <UU5.Bricks.Text style="margin-right:10px">
              <UU5.Bricks.Icon style="color:darkblue;" icon="glyphicon-tint" /> {gatewayData.current.humidity}%
            </UU5.Bricks.Text>
          </UU5.Bricks.Row>
          <UU5.Bricks.Row display="flex" style="margin:10px">
            <UU5.Bricks.Text style="margin-right:10px">{actualDate.toLocaleDateString()}</UU5.Bricks.Text>
            <UU5.Bricks.Text style="margin-right:10px">
              <b>{actualDate.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}</b>
            </UU5.Bricks.Text>
          </UU5.Bricks.Row>
          <UU5.Bricks.Row style="margin:10px">
            <UU5.Bricks.Text style="margin-right:10px">{gatewayData.locationDesc}</UU5.Bricks.Text>
          </UU5.Bricks.Row>
        </UU5.Bricks.Section>
        {/* <MinMax gatewayData={gatewayData} ></MinMax> */}
      </UU5.Bricks.Box>
    );
    //@@viewOff:render
  },
});

export default Current;
