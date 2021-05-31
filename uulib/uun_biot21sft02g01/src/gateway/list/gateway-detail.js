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
    // if (!props.gateway) {
    //   return null;
    // }
function propsToDetail() {
  props.onDetail({id: props.gateway.id, code: props.gateway.code})
}
    return (
      <>
        <UU5.Bricks.Card colorSchema={props.colorSchema} >
          <UU5.Bricks.Box display="flex">
          <UU5.Bricks.Button style="float:left"
                  bgStyle="transparent"
                  onClick={propsToDetail}
                ><UU5.Bricks.Icon  icon="glyphicon-info-sign" /></UU5.Bricks.Button>
                                <UU5.Bricks.Button
                  bgStyle="transparent"
                  onClick={() => {
                    props.onDelete(props.gateway.id, props.gateway.name);
                  }}
                ><UU5.Bricks.Icon style="float:right" icon="glyphicon-trash" /></UU5.Bricks.Button>
          <GatewayEditForm 
            onDetail={props.onDetail}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}></GatewayEditForm>

                

          </UU5.Bricks.Box>
          <UU5.Bricks.Box display="flex" >
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
