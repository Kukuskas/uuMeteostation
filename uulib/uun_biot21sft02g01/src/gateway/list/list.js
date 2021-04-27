//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";

import Config from "./config/config.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics
};

const CLASS_NAMES = {
  main: () => Config.Css.css`
    padding: 24px 0;
    max-width: 624px;
    margin: 0 auto;
  `,
  text: () => Config.Css.css`
    text-align: center;

    ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: left;`)}
  `,
  iconColumn: () => Config.Css.css`
    padding-right: 24px;
    text-align: center;
  
    ${UU5.Utils.ScreenSize.getMinMediaQueries("s", `text-align: right;`)}
  
    .uu5-bricks-icon {
      font-size: 48px;
    }
  `,
  icon: (cssMargin) => Config.Css.css`
    margin-top: ${cssMargin};
    margin-bottom: ${cssMargin};
  `,
};

export const List = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {

  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {

  },
  //@@viewOff:defaultProps

  render() {
    return (
        <UU5.Bricks.Text content="Hello world"/>
    );
  },
});

export default List;


// // export * from "./list.js";
// // export * from "./gateways-list.js";
// // import * as Context from "./context/context.js";
// // export { Context };
// // export * from "./gateways-loader.js";
// // export * from "./gateway-detail.js";
// // export * from "./gateway-edit-form.js";

// import UU5 from "uu5g04";
// import { createVisualComponent } from "uu5g04-hooks";
// // import { useSubAppData, useSubApp } from "uu_plus4u5g01-context";
// // import UuP from "uu_pg01";
// import "uu5g04-bricks";
// import GatewaysList from "./gateways-list";
// import { useGateways } from "./context/context";
// import DataListStateResolver from "../../core/data-list-state-resolver";
// import Config from "./config/config";
// // import Lsi from "./list-lsi";
// //@@viewOff:imports

// // Height of the component wrapper used to maintain
// // height of wrapper with different content
// const PLACEHOLDER_HEIGHT = 400;

// const STATICS = {
//   displayName: Config.TAG + "List",
//   nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "inline"),
// };

// const List = createVisualComponent({
//   //@@viewOn:statics
//   ...STATICS,
//   //@@viewOff:statics

//   //@@viewOn:propTypes
//   propTypes: {

//     colorSchema: UU5.PropTypes.string,
//     elevation: UU5.PropTypes.string,
//     borderRadius: UU5.PropTypes.string,
//     bgStyle: UU5.PropTypes.string,

//   },
//   //@@viewOff:propTypes

//   //@@viewOn:defaultProps
//   defaultProps: {

//     colorSchema: undefined,
//     elevation: "2",
//     borderRadius: "4px",
//     bgStyle: undefined,

//   },
//   //@@viewOff:defaultProps

//   render(props) {
//     //@@viewOn:hooks
//     let gatewaysDataList = useGateways();
//     // let { data: appDataObject } = useSubAppData();
//     // let subApp = useSubApp();

//     //@@viewOff:hooks

//     //@@viewOn:private
//     let gatewaysList = gatewaysDataList.data;
//     // let app = appDataObject.data;

//     //@@viewOff:handlers
//     function handleDelete() {

//     }

//     function handleChange() {

//     }
//     //@@viewOff:handlers

//     //@@viewOn:render
//     const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);
//     const attrs = UU5.Common.VisualComponent.getAttrs(props);

//     let child;
//     if (!currentNestingLevel || currentNestingLevel === "inline") {
//       child = (
//         <UU5.Bricks.LinkUve
//           {...attrs}
//           componentName={Config.UUECC_COMPONENT_TAG}
//         //   componentProps={{ baseUri: subApp.baseUri }}
//         >
//           {Config.UUECC_COMPONENT_TAG}
//         </UU5.Bricks.LinkUve>
//       );
//     } else {
//       child = (
//         <UU5.Bricks.ComponentWrapper
//           {...attrs}
//           colorSchema={props.colorSchema}
//           elevation={props.elevation}
//           borderRadius={props.borderRadius}
//           cardView={props.cardView}
//           copyTagFunc={props.handleCopyTag}
//         //   actionList={actionList}
//         //   header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
//         //   help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
//         >
//             <DataListStateResolver dataList={gatewaysDataList} height={PLACEHOLDER_HEIGHT}>
//               {/* modals */}
//               <GatewaysList gatewaysList={gatewaysList} baseUri="{subApp.baseUri}" onChange={handleChange} onDelete={handleDelete} />
//               {/* modals */}
//             </DataListStateResolver>
//         </UU5.Bricks.ComponentWrapper>
//       );
//     }

//     return (<UU5.Bricks.ComponentWrapper
//     {...attrs}
//     colorSchema={props.colorSchema}
//     elevation={props.elevation}
//     borderRadius={props.borderRadius}
//     cardView={props.cardView}
//     copyTagFunc={props.handleCopyTag}
//   //   actionList={actionList}
//   //   header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
//   //   help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
//   >
//       <DataListStateResolver dataList={gatewaysDataList} height={PLACEHOLDER_HEIGHT}>
//         {/* modals */}
//         <GatewaysList gatewaysList={gatewaysList} baseUri="{subApp.baseUri}" onChange={handleChange} onDelete={handleDelete} />
//         {/* modals */}
//       </DataListStateResolver>
//   </UU5.Bricks.ComponentWrapper>)
//     //@@viewOff:render
//   },
// });

// //viewOn:exports
// export { List };
// export default List;
