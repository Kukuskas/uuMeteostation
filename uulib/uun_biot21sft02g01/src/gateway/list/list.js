
// import * as Context from "./context/context.js";
// export { Context };
// export * from "./gateway-edit-form.js";

import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import UuP from "uu_pg01";
import "uu_pg01-bricks";
import "uu5g04-bricks";

import GatewaysList from "./gateways-list.js";
export {GatewaysList}
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


    //@@viewOff:handlers
    function handleDelete(id) {

    }

    function handleChange(gateway) {
console.log(gateway);
    }

    function handleDetail(id) {
console.log("Id of a gateway is: ", id);
    }

    function handleAdd(gateway) {
      console.log("null");
    }

      return (
     <UuP.Bricks.ComponentWrapper
    colorSchema={props.colorSchema}
    elevation={props.elevation}
    borderRadius={props.borderRadius}
    cardView={true}
    // header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
    // help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
   >  
      <GatewaysLoader>
        <GatewaysList onUpdate={handleChange} onDelete={handleDelete} onCreate={handleAdd} onDetail={handleDetail}/>
      </GatewaysLoader>
      
  </UuP.Bricks.ComponentWrapper>
  )
    //@@viewOff:render
},
});

//viewOn:exports
export { List };
export default List;
