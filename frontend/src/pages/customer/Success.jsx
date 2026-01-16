import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  return <div> Đã thanh toán thành công cho đơn hàng ${orderId}</div>;
};
export default Success;
