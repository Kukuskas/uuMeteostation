//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Graph",
  //@@viewOff:statics
};

export const GraphForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    let currentDate = new Date();
    currentDate = currentDate.toISOString();
    const [selected, setSelected] = useState("Hourly");
    const [datePicked, setDatePicked] = useState(null);
    const [datePick, setDatePick] = useState(currentDate);

    function handleType(params) {
      setSelected(params);
    }
    let oneDate = (
      <UU5.Forms.DatePicker
        label="Date"
        name="date"
        value={datePick}
        required
        onChange={(value) => setDatePick(value.value)}
      />
    );
    let moreDate = (
      <UU5.Forms.DateRangePicker
        label="Date"
        name="dateInterval"
        value={datePicked}
        placeholder="From - To"
        required
        onChange={(value) => setDatePicked(value.value)}
      />
    );
    let datePicker;
    let type = oneDate;

    if (selected === "Hourly") {
      type = oneDate;
    } else {
      type = moreDate;
    }

    if (type) {
      datePicker = type;
    }

    return (
      <>
        <UU5.Forms.Form onSave={props.change}>
          <UU5.Bricks.Row>
            <UU5.Bricks.Column colWidth="s-4">
              <UU5.Forms.Select
                label="Frequency"
                name="type"
                borderRadius="8px"
                value={selected}
                onChange={(value) => handleType(value.value)}
              >
                <UU5.Forms.Select.Option name="hourly" value="Hourly" />
                <UU5.Forms.Select.Option name="daily" value="Daily" />
                <UU5.Forms.Select.Option name="monthly" value="Monthly" disabled />
                <UU5.Forms.Select.Option name="yearly" value="Yearly" disabled />
              </UU5.Forms.Select>
            </UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="s-4">{datePicker}</UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="s-4">
              <UU5.Forms.Controls
                buttonSubmitProps={{ content: "Submit", colorSchema: "default" }}
                buttonCancelProps={{ hidden: true, disabled: true }}
              />
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>
        </UU5.Forms.Form>
      </>
    );
    //@@viewOff:render
  },
});

export default GraphForm;
