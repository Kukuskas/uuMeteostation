//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu5g04-bricks";

import GatewayData from "./gateway-data.js";
export {GatewayData}
import GatewayLoader from "./gateway-loader"
import Config from "./config/config";

//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Data",
  //@@viewOff:statics
};

export const Data = createVisualComponent({
  ...STATICS,

  propTypes: {

    colorSchema: UU5.PropTypes.string,
    elevation: UU5.PropTypes.string,
    borderRadius: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.string,

  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {

    colorSchema: undefined,
    elevation: "2",
    borderRadius: "4px",
    bgStyle: undefined,

  },
  //@@viewOff:defaultProps

  render(props) {


      return (
     <UuP.Bricks.ComponentWrapper
    colorSchema={props.colorSchema}
    elevation={props.elevation}
    borderRadius={props.borderRadius}
    cardView={true}
    // header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
    // help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
   >  
      <GatewayLoader>
        <GatewayData/>
      </GatewayLoader>
      
  </UuP.Bricks.ComponentWrapper>
  )
    //@@viewOff:render
},
});

export default Data;
