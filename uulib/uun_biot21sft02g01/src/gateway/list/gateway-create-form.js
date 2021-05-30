import UU5 from "uu5g04";
//import { createVisualComponentWithRef, useLsiValues, useContext, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
//import Lsi from "./config/lsi";
import "uu5g04-bricks";
import "uu5g04-forms";
import "uu5richtextg01";
import { createComponent } from "uu5g04-hooks";

  const STATICS = {
    //@@viewOn:statics
    displayName: Config.TAG + "GatewayCreateForm",
    //@@viewOff:statics
  };
  
  export const GatewayCreateForm = createComponent({
    ...STATICS,
  
    //@@viewOn:propTypes
    propTypes: {
     
    },
    //@@viewOff:propTypes
    
    //@@viewOn:defaultProps
    defaultProps: {
      
    },
   getHeader() {
      return (
          <UU5.Forms.ContextHeader
            content={<UU5.Bricks.Lsi lsi={{ en: "Create new gateway" }} />}
            info={<UU5.Bricks.Lsi lsi={{ en: "More info..." }} />}
          />
        )
   },
  
   getForm(modal) {
      return (
      <UU5.Forms.ContextForm
        onSave={opt => {
          // TODO saving
          console.log(opt.values);
          modal && modal.close();
        }}
        onCancel={() => {
          modal && modal.close();
        }}
      >
        <UU5.Forms.Form
          onSave={(opt) => alert(`opt.values:\n${JSON.stringify(opt.values, null, 2)}`)}
          header={<UU5.Bricks.Box content='' colorSchema='blue' className='font-size-m' />}
          footer={<UU5.Bricks.Box content='' colorSchema='blue' className='font-size-xs' />}>
          <UU5.Forms.Text name="name" label="Name" placeholder="" required />
          <UU5.Forms.Text name="location" label="Location" placeholder="" required />
          <UU5.Forms.Text name="code" label="Code" placeholder=""  />
          <UU5.Forms.Text name="uuEEuuID" label="uuID of uuEE worker" placeholder=""  />
        </UU5.Forms.Form>
      </UU5.Forms.ContextForm>
      )
   },
   getControls() {
      return(
       <UU5.Forms.ContextControls
        buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Create" }} /> }}
        buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={{ en: "Cancel" }} /> }}
       />
      )
  },
  render() {
     return(
      <UU5.Bricks.Container>
       <UU5.Forms.Form>
                {/*@@viewOn:modal*/}
                 <UU5.Forms.ContextModal ref_={modal => GatewayCreateForm.modal = modal} />
                  <UU5.Bricks.Button
                    colorSchema="blue"
                    content="Create new gateway"
                    onClick={() => GatewayCreateForm.modal.open({
                     header: GatewayCreateForm.getHeader(),
                     content: GatewayCreateForm.getForm(),
                     footer: GatewayCreateForm.getControls()
                    })}
                  />
                  {/*@@viewOff:modal*/}
       </UU5.Forms.Form>
       <br></br>
      </UU5.Bricks.Container>
     )
   }
});
export default GatewayCreateForm;


    