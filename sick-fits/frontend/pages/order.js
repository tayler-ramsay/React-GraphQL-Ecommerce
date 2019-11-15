import PleaseSignIn from "../components/PleaseSignin";
import Order from "../components/Order";

const OrderPage = props => (
  <div>
    <PleaseSignIn>
      <OrderPage id={props.query.id} />
    </PleaseSignIn>
  </div>
);

export default Order;
