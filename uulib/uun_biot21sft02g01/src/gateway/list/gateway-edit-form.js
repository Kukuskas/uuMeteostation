//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "GatewayEditForm",
  //@@viewOff:statics
};

export const GatewayEditForm = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps
  getHeader() {
    return (
        <UU5.Forms.ContextHeader
          content={<UU5.Bricks.Lsi lsi={{ en: "Edit gateway" }} />}
          info={<UU5.Bricks.Lsi lsi={{ en: "More info..." }} />}
        />
      )
 },

 getForm(modal) {
    return (
    <UU5.Forms.ContextForm
      onSave={opt => {
        // TODO saving
        // console.log(opt.values);
        modal && modal.close();
      }}
      onCancel={() => {
        modal && modal.close();
      }}
    >
      <UU5.Forms.Form
        onSave={(opt) => alert(`opt.values:\n${JSON.stringify(opt.values, null, 2)}`)}
        header={<UU5.Bricks.Box content='' className='font-size-m' />}
        footer={<UU5.Bricks.Box content='' className='font-size-xs' />}>
        <UU5.Forms.Text name="name" label="Name" placeholder=""  />
        <UU5.Forms.Text name="location" label="Location" placeholder=""  />
        <UU5.Forms.Text name="code" label="Code" placeholder=""  />
        <UU5.Forms.Text name="uuEEuuID" label="uuID of uuEE worker" placeholder=""  />
        <UU5.Forms.Text name="state" label="State" placeholder=""  />
      </UU5.Forms.Form>
    </UU5.Forms.ContextForm>
    )
 },
 getControls() {
    return(
     <UU5.Forms.ContextControls
      buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Save changes" }} /> }}
      buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Cancel" }} /> }}
     />
    )
},

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <UU5.Bricks.Section>
        {/*<div {...attrs}>
          <div>Component {STATICS.displayName}</div>
          {UU5.Utils.Content.getChildren(props.children, props, STATICS)}
        </div>*/}
        <UU5.Forms.ContextModal ref_={modal => GatewayEditForm.modal = modal} />
        
     
        <UU5.Bricks.Button
        style="position: absolute;right:52px;top:16px"
                  bgStyle="transparent"
                  onClick={() => GatewayEditForm.modal.open({
                    header: GatewayEditForm.getHeader(),
                    content: GatewayEditForm.getForm(),
                    footer: GatewayEditForm.getControls()
                   })}
                ><UU5.Bricks.Icon  icon="glyphicon-pencil" /></UU5.Bricks.Button>

</UU5.Bricks.Section>
                
    ) : null;
    //@@viewOff:render
  },
});

export default GatewayEditForm;
