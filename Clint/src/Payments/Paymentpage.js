import React from "react";
import { useParams } from "react-router-dom";
const PaymentPage = () => {
  const { showPaymentFormParam  } = useParams();
    console.log(showPaymentFormParam)
  return (
    <div>
      <h4 className="Headtext">Post Payment of customers</h4>
      {showPaymentFormParam}
    </div>
  );
};
export default PaymentPage;