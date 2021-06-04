
// import * as Context from "./context/context.js";
// export { Context };
// export * from "./gateway-edit-form.js";

import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu5g04-bricks";
import Data from "../data"
import GatewaysList from "./gateways-list.js";
import GatewaysLoader from "./gateways-loader"
import Config from "./config/config";
// import Lsi from "./list-lsi";
//@@viewOff:imports

const STATICS = {
  displayName: Config.TAG + "List",
};

const List = createVisualComponent({
  //@@viewOn:statics
  ...STATICS,
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {

    colorSchema: UU5.PropTypes.string,
    elevation: UU5.PropTypes.string,
    borderRadius: UU5.PropTypes.string,

  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {

    colorSchema: undefined,
    elevation: "2",
    borderRadius: "4px",

  },
  //@@viewOff:defaultProps

  render(props) {
// console.log("propsss", props);
    const [whichComponent, setWhichComponent] = useState(false);
    const [dtoInGateway, setDtoInGateway] = useState();
    //@@viewOff:handlers
    function handleDelete(id) {

    }

    function handleChange(gateway) {

    }
    function openDetail(params) {

      setDtoInGateway(params);
      setWhichComponent(true);
    }


    if (!whichComponent) {
      return (
     <UuP.Bricks.ComponentWrapper
    colorSchema={props.colorSchema}
    elevation={props.elevation}
    borderRadius={props.borderRadius}
    cardView={true}
    // header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
    // help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
   >  
      <GatewaysLoader baseUri={props.baseUri}>
        <GatewaysList onUpdate={handleChange} onDelete={handleDelete} onDetail={openDetail}/>
      </GatewaysLoader>
      
  </UuP.Bricks.ComponentWrapper>
  )    } else {
    return (<>
    <UU5.Bricks.Button onClick={()=>setWhichComponent(false)} >Back</UU5.Bricks.Button>
    <Data baseUri={props.baseUri} dtoInGateway={dtoInGateway}></Data>
  </>)}
    //@@viewOff:render
},
});

//viewOn:exports
export { List };
export default List;
