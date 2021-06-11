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
    const [selected, setSelected] = useState("hourly");
    const [datePicked, setDatePicked] = useState(null);
    const [datePick, setDatePick] = useState(currentDate);
    const [stepSelected, setStepSelected] = useState("days");

    function handleType(params) {
      setSelected(params);
      if (params=="monthly") {
        setStepSelected("months")
      }else if (params=="yearly") {
        setStepSelected("years")
      }
      
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
        step={stepSelected}
        required
        onChange={(value) => setDatePicked(value.value)}
      />
    );
    let datePicker;
    let type = oneDate;

    if (selected === "hourly") {
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
                <UU5.Forms.Select.Option name="Hourly" value="hourly" />
                <UU5.Forms.Select.Option name="Daily" value="daily" />
                <UU5.Forms.Select.Option name="Monthly" value="monthly"  />
                <UU5.Forms.Select.Option name="Yearly" value="yearly"  />
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
