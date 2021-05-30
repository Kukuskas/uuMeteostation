//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
import GatewayEditForm from "./gateway-edit-form";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayDetail",
  //@@viewOff:statics
};

export const GatewayDetail = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    gateway: UU5.PropTypes.object,
    baseUri: UU5.PropTypes.string,
    colorSchema: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    baseUri: undefined,
    gateway: {},
    colorSchema: undefined,
    bgStyle: undefined,
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
console.log(props);
    if (!props.gateway) {
      return null;
    }

    return (
      <>
        <UU5.Bricks.Card colorSchema={props.colorSchema}>
          <UU5.Bricks.Box display="flex">

          <GatewayEditForm></GatewayEditForm>

                

          </UU5.Bricks.Box>
          <UU5.Bricks.Box display="flex">
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth="s-3 s-5" content={"Název:"} />
              <UU5.Bricks.Column colWidth="s-3 s-5" content={props.gateway.name} />
            </UU5.Bricks.Row>
            <br />
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth="s-3 s-5" content={"Umístění:"} />
              <UU5.Bricks.Column colWidth="s-3 s-5" content={props.gateway.location} />
            </UU5.Bricks.Row>
            <br />
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth="s-3 s-5" content={"Teplota:"} />
              <UU5.Bricks.Column colWidth="s-3 s-5" content={props.gateway.current.temperature} />
            </UU5.Bricks.Row>
          </UU5.Bricks.Box>
        </UU5.Bricks.Card>
      </>
    );
    //@@viewOff:render
  },
});

export default GatewayDetail;
