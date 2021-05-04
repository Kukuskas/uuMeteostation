//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "DataPending",
  //@@viewOff:statics
};

export const DataPending = createVisualComponent({
  ...STATICS,
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    height: UU5.PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    height: undefined,
  },
  //@@viewOff:defaultProps

  render(props) {
    let attrs = UU5.Common.VisualComponent.getAttrs(props);
    const className = props.height ? Css.placeholder(props.height) : "";
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);
    let child;

    if (!currentNestingLevel || currentNestingLevel === "inline") {
      child = <UU5.Bricks.Loading inline />;
    } else {
      child = (
        <UU5.Bricks.Div {...attrs} className={className}>
          <UU5.Bricks.Loading />
        </UU5.Bricks.Div>
      );
    }

    return child;
  },
});

export default DataPending;
