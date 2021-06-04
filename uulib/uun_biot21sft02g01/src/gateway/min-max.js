//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent} from "uu5g04-hooks";
import "uu_pg01-bricks";
import "uu5g04-bricks";
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
    gatewayData: UU5.PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    gatewayData: null
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks

    //@@viewOff:hooks
// console.log("minMax", props);
    //@@viewOn:private

    //@@viewOff:handlers
    return (
      <>
        <UU5.Bricks.Section  display="inline" style="padding:10px; min-width:200px; max-width:50%" >
          <UU5.Bricks.Row display="flex" style="margin:10px">
          <UU5.Bricks.Text style="margin-right:10px"><b>Min:</b> </UU5.Bricks.Text>
          <UU5.Bricks.Text style="margin-right:10px">{props.gatewayData.min.temperature}°C</UU5.Bricks.Text>
          <UU5.Bricks.Text style="margin-right:10px">{props.gatewayData.min.humidity}%</UU5.Bricks.Text>
          </UU5.Bricks.Row>

          <UU5.Bricks.Row display="flex" style="margin:10px">
          <UU5.Bricks.Text style="margin-right:10px"><b>Max:</b> </UU5.Bricks.Text>
          <UU5.Bricks.Text style="margin-right:10px">{props.gatewayData.max.temperature}°C</UU5.Bricks.Text>
          <UU5.Bricks.Text style="margin-right:10px">{props.gatewayData.max.humidity}%</UU5.Bricks.Text>
          </UU5.Bricks.Row>
        </UU5.Bricks.Section>
      </>
    );
    //@@viewOff:render
  },
});

export default Current;