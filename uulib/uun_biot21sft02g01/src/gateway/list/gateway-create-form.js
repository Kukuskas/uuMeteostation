import UU5 from "uu5g04";
//import { createVisualComponentWithRef, useLsiValues, useContext, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
//import Lsi from "./config/lsi";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5richtextg01";
import { createVisualComponent, useRef } from "uu5g04-hooks";

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayCreateForm",
  //@@viewOff:statics
};

export const GatewayCreateForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onCreate: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onCreate: () => {},
  },

  render(props) {
    const modalRef = useRef();

    function handleClose() {
      modalRef.current.close();
    }

    return (
      <UU5.Bricks.Container>
        <UU5.Forms.Form>
          {/*@@viewOn:modal*/}
          <UU5.Forms.ContextModal ref_={modalRef} />
          <UU5.Bricks.Button
            colorSchema="blue"
            content="Create new gateway"
            onClick={() =>
              modalRef.current.open({
                header: <Header />,
                content: <Form onSave={props.onCreate} onCancel={handleClose} onSaveFail={props.onSaveFail} onSaveDone={handleClose}/>,
                footer: <Controls />,
              })
            }
          />
          {/*@@viewOff:modal*/}
        </UU5.Forms.Form>
        <br></br>
      </UU5.Bricks.Container>
    );
  },
});

function Header() {
  return (
    <UU5.Forms.ContextHeader
      content={<UU5.Bricks.Lsi lsi={{ en: "Create new gateway" }} />}
      info={<UU5.Bricks.Lsi lsi={{ en: "More info..." }} />}
    />
  );
}

function Form({ onSave, onSaveDone, onSaveFail, onCancel }) {
  return (
    <UU5.Forms.ContextForm onSave={onSave} onSaveDone={onSaveDone} onSaveFail={onSaveFail} onCancel={onCancel}>
      <UU5.Forms.Text name="code" label="Code" placeholder="" />
      <UU5.Forms.Text name="name" label="Name" placeholder="" />
      <UU5.Forms.Text name="location" label="Location" placeholder="gps location" />
      <UU5.Forms.Text name="locationDesc" label="Location/city" placeholder=""  />
      <UU5.Forms.Text name="timezone" label="Timezone" placeholder="" />
      <UU5.Forms.Text name="uuEe" label="uuID of uuEE worker" placeholder="" required/>
    </UU5.Forms.ContextForm>
  );
}

function Controls() {
  return (
    <UU5.Forms.ContextControls
      buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Create" }} /> }}
      buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Cancel" }} /> }}
    />
  );
}

export default GatewayCreateForm;
