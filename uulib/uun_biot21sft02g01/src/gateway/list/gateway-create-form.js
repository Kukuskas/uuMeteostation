import UU5 from "uu5g04";
import { createVisualComponentWithRef, useLsiValues, useContext, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./lsi";
//import uunWeatherStationIntanceContext from "./uunweatherstation-instance-context";

const GatewayCreateForm = createVisualComponentWithRef({
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayCreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onSave: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSave: () => {}
  },
  //@@viewOff:defaultProps

  render({ onSave }, ref) {
    //@@viewOn:hooks
    const inputLsi = useLsiValues(Lsi);
    const imageRef = useRef();
    const modalRef = useRef();
    const gatewayRef = useRef();

    const {
      data: { GatewaysList }
    } = useContext(GatewayIntanceContext);

    useImperativeHandle(ref, () => ({
      open: gateway => {
        gatewayRef.current = gateway;
        modalRef.current.open({
          header: renderHeader(),
          content: renderForm(gateway), //GatewayDetail?
          footer: renderControls()
        });
      }
    }));
    //@@viewOn:hooks

    //@@viewOn:private
    function validateText(opt) {
      let result = { feedback: "initial", value: opt.value };
      // when there is no event, validation comes from "isValid" method
      if (opt.event === undefined) {
        // text is empty, check file
        if (!opt.value && !imageRef.current.getValue()) {
          result.feedback = "error";
          result.message = <UU5.Bricks.Lsi lsi={Lsi.textOrFile} />;
          opt.component.setFeedback(result.feedback, result.message);
        }
      }
      return result;
    }

    function handleSave(opt) {
      modalRef.current.close(true, () => {
        onSave(gatewayRef.current, opt.values);
      });
    }

    function handleCancel() {
      modalRef.current.close();
    }
    //@@viewOff:private

    //@@viewOn:render
    function renderHeader() {
      return (
        <UU5.Forms.ContextHeader
          content={<UU5.Bricks.Lsi lsi={Lsi.header} />}
          info={<UU5.Bricks.Lsi lsi={Lsi.info} />}
        />
      );
    }

    function renderControls() {
      return <UU5.Forms.ContextControls buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.submit} /> }} />;
    }

    function renderForm(gateway) {
      return (
        <UU5.Forms.ContextForm onSave={handleSave} onCancel={handleCancel}>
          <UU5.Forms.Text
            label={inputLsi.name}
            name="name"
            value={gateway.name}
            inputAttrs={{ maxLength: 255 }}
            controlled={false}
            required
          />

          <UU5.Bricks.Row>
            <UU5.Bricks.Column colWidth="m-6">
              <UU5.Forms.Select
                label={inputLsi.GatewayDetail}
                name="GatewaysList"
                value={gateway.GatewaysList}
                controlled={false}
                multiple
              >
                {renderGateways()}
              </UU5.Forms.Select>
            </UU5.Bricks.Column>
            <UU5.Bricks.Column colWidth="m-6">
              <UU5.Forms.File ref_={imageRef} label={inputLsi.image} name="image" controlled={false} />
            </UU5.Bricks.Column>
          </UU5.Bricks.Row>

          <UU5.Forms.TextArea
            label={inputLsi.text}
            name="text"
            value={gateway.text}
            inputAttrs={{ maxLength: 4000 }}
            onValidate={validateText}
            controlled={false} //!!
            autoResize
          />
        </UU5.Forms.ContextForm>
      );
    }

    function renderGateways() {
      return GatewaysList.map(GatewayDetail => (
        <UU5.Forms.Select.Option value={GatewayDetail.id} key={GatewayDetail.id}>
          {GatewayDetail.name}
        </UU5.Forms.Select.Option>
      ));
    }

    return <UU5.Forms.ContextModal ref_={modalRef} overflow />;
    //@@viewOff:render
  }
});

export default GatewayCreateForm;