import UU5 from "uu5g04";
import UunBiot21sft02 from "uun_biot21sft02g01";

const { shallow } = UU5.Test.Tools;

describe(`UunBiot21sft02.Gateway.List.GatewaysList`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UunBiot21sft02.Gateway.List.GatewaysList />);
    expect(wrapper).toMatchSnapshot();
  });
});
