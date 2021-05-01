import GatewaysList from "./gateways-list.js";
import * as Context from "./context/context.js";
export { Context };
export * from "./gateway-detail.js";
export * from "./gateway-edit-form.js";

import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
// import { useSubAppData, useSubApp } from "uu_plus4u5g01-context";
import UuP from "uu_pg01";
import "uu5g04-bricks";
import "uu_pg01-bricks";
import { useGateways } from "./context/context";
// import DataListStateResolver from "../../core/data-list-state-resolver";
import Config from "./config/config";
// import Lsi from "./list-lsi";
//@@viewOff:imports

// Height of the component wrapper used to maintain
// height of wrapper with different content
// const PLACEHOLDER_HEIGHT = 400;

const STATICS = {
  displayName: Config.TAG + "List",
  nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "inline"),
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
    //@@viewOn:hooks
    // let gatewaysDataList = useGateways();
    let gatewaysDataList = {
      "itemList": [
        {
          "code": "gw01",
          "name": "Gateway nr. 1",
          "location": "Praha 2",
          "uuEe": "26-1986-1",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": null,
            "humidity": null,
            "timestamp": "2021-04-17T14:00:00+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-13T16:58:29.451Z",
            "mts": "2021-04-17T12:10:00.551Z",
            "rev": 54
          },
          "id": "6075cdb589914000278109ac"
        },
        {
          "code": "gwmnpbout1",
          "name": "MnpB - outside",
          "location": "Praha 10",
          "uuEe": "4101-908-1",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": 12.9,
            "humidity": 64.2,
            "timestamp": "2021-05-01T19:50:00+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-17T13:22:10.797Z",
            "mts": "2021-05-01T18:00:02.056Z",
            "rev": 1340
          },
          "id": "607ae102ce50a00027c742fc"
        },
        {
          "name": "uuThing2 Meteostation",
          "location": "Praha 8",
          "uuEe": "26-1987-1",
          "code": "uut2l",
          "awid": "44701e7183e94852859303f2bfca9a7f",
          "state": "active",
          "current": {
            "temperature": 24.3,
            "humidity": 39.7,
            "timestamp": "2021-04-20T17:03:12+02:00"
          },
          "min": {
            "temperature": null,
            "humidity": null
          },
          "max": {
            "temperature": null,
            "humidity": null
          },
          "sys": {
            "cts": "2021-04-20T15:14:37.827Z",
            "mts": "2021-04-20T15:17:16.559Z",
            "rev": 2
          },
          "id": "607eefdd0d7c640027601db2"
        }
      ],
      "pageInfo": {
        "pageIndex": 0,
        "pageSize": 100,
        "total": 3
      },
      "uuAppErrorMap": {}
    }
    // let { data: appDataObject } = useSubAppData();
    // let subApp = useSubApp();

    //@@viewOff:hooks

    //@@viewOn:private
    // let gatewaysList = gatewaysDataList.data;
    // let app = appDataObject.data;

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
    //@@viewOff:handlers

    //@@viewOn:render
    // const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);
    // const attrs = UU5.Common.VisualComponent.getAttrs(props);

    // let child;
    // child ="Hello"
    // if (!currentNestingLevel || currentNestingLevel === "inline") {
    //   child = (
    //     <UU5.Bricks.LinkUve
    //       {...attrs}
    //       componentName={Config.UUECC_COMPONENT_TAG}
    //     //   componentProps={{ baseUri: subApp.baseUri }}
    //     >
    //       {Config.UUECC_COMPONENT_TAG}
    //     </UU5.Bricks.LinkUve>
    //   );
    // } else {
    //   child = (
    //     <UU5.Bricks.ComponentWrapper
    //       {...attrs}
    //       colorSchema={props.colorSchema}
    //       elevation={props.elevation}
    //       borderRadius={props.borderRadius}
    //       cardView={props.cardView}
    //       copyTagFunc={props.handleCopyTag}
    //     //   actionList={actionList}
    //     //   header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
    //     //   help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
    //     >
    //         {/* <DataListStateResolver dataList={gatewaysDataList} height={PLACEHOLDER_HEIGHT}> */}
    //           {/* modals */}
    //           Hello
    //           {/* <GatewaysList gatewaysList={gatewaysList} baseUri="{subApp.baseUri}" onChange={handleChange} onDelete={handleDelete} /> */}
    //           {/* modals */}
    //         {/* </DataListStateResolver> */}
    //     </UU5.Bricks.ComponentWrapper>
    //   );
    // }

    return (
     <UuP.Bricks.ComponentWrapper
    colorSchema={props.colorSchema}
    elevation={props.elevation}
    borderRadius={props.borderRadius}
    cardView={true}
    // copyTagFunc={props.handleCopyTag}
    // actionList={actionList}
    // header={<UU5.Bricks.Lsi lsi={Lsi.listHeader} />}
    // help={<UU5.Bricks.Lsi lsi={Lsi.listHelp} params={[Config.SQUARE_DOC]} />}
   >  
      {/* <DataListStateResolver dataList={gatewaysList}> */}
        <GatewaysList gatewaysList={gatewaysDataList.itemList} onUpdate={handleChange} onDelete={handleDelete} onCreate={handleAdd} onDetail={handleDetail}/>

      {/* </DataListStateResolver> */}
  </UuP.Bricks.ComponentWrapper>
  )
    //@@viewOff:render
  },
});

//viewOn:exports
export { List };
export default List;
