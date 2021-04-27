//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
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

    if (!props.gateway) {
      return null;
    }

    return (
      <>
        <UU5.Bricks.Card  colorSchema={props.colorSchema} >
          <UU5.Bricks.Button content="Edit" onClick={() => {
            onEdit(props.gateway);
          }}/>
          <UU5.Bricks.Button content="Delete" onClick={() => {
            onDelete(props.gateway.id);
          }}/>
          <UU5.Bricks.Section onClick={() => {
            onDetail(props.gateway);
          }}>
            <UU5.Bricks.Section content={<UU5.Bricks.Lsi lsi={props.gateway.name} />} />
            <UU5.Bricks.Text content={<UU5.Bricks.Lsi lsi={props.gateway.location} />} />
            <UU5.Bricks.Text content={props.gateway.current} />
          </UU5.Bricks.Section>
        </UU5.Bricks.Card>
      </>
    );
    //@@viewOff:render
  },
});

export default GatewayDetail;
