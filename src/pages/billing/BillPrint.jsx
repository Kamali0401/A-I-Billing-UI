import React, { forwardRef } from "react";
import "../../pages/styles/styles.css";
const BillPrint = forwardRef((props, ref) => {

    const { billData} = props;
   // console.log(billData,"billData");
    const restaurantdata = JSON.parse(localStorage.getItem("restaurantData"));

    const formatDate = (iso) => new Date(iso).toLocaleString();
  const calculateTotals = () => {
   const serviceamount = billData?.serviceCharge ||0.00;
   const parcelamount= billData?.parcelAmount ||0.00;

    const subTotal = (billData?.itemDetails || []).reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ) + serviceamount + parcelamount; 
    
    
    const discount = billData?.discountAmount || 0.00;
    const netTotal = subTotal - discount;
    const cgst = billData?.cgst || 0.00;
    const sgst = billData?.sgst || 0.00;
    const totalBeforeRound = netTotal + cgst + sgst;
    const grandTotal = Math.round(totalBeforeRound);
    const roundOff = (grandTotal - totalBeforeRound).toFixed(2);

    return { serviceamount,parcelamount,subTotal, discount, netTotal, cgst, sgst, roundOff, grandTotal };
  };

  const {serviceamount,parcelamount, subTotal, discount, netTotal, cgst, sgst, roundOff, grandTotal } = calculateTotals();

  return (
    <div ref={ref}>
      <div style={{ fontFamily: "monospace", width: "300px", padding: "10px", border: "1px solid black" }}>
      <h3 style={{ textAlign: "center", marginBottom: "0" }}>{restaurantdata[0]?.restaurantName || ""}</h3>
      <p style={{ textAlign: "center", margin: 0 }}>{restaurantdata[0]?.address || ""}</p>
      <p style={{ textAlign: "center", margin: 0 }}>{restaurantdata[0]?.phone || ""}</p>
      <p style={{ textAlign: "center", margin: 0 }}>TAX INVOICE</p>
      <p style={{ textAlign: "center", margin: 0 }}>{billData.orderType}</p>
      <hr />
      <p>Date:{formatDate(billData.createdDate)} &nbsp; Bill No.: {billData?.billId|| 0}</p>
      <p>Waiter: {billData?.waiterName || ""}</p>
      <table width="100%">
        <thead>
          <tr>
            <th align="left">Particulars</th>
            <th align="right">Qty</th>
            <th align="right">Rate</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(billData?.itemDetails || []).map((item, index) => (
          <tr key={index}>
            <td align="left">{item.itemName}</td>
            <td align="right">{item.qty}</td>
            <td align="right">{item.price}</td>
            <td align="right">{(item.qty * item.price).toFixed(2)}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <hr />
      <table style={{ width: "100%", fontSize: "14px" }}>
  <tbody>
  <tr>
      <td align="right">Service Charge</td>
      <td align="right">₹ {serviceamount.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">Parcel Amount</td>
      <td align="right">₹ {parcelamount.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">Sub Total</td>
      <td align="right">₹ {subTotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">Dis. @{billData?.discountAmount || 0}%</td>
      <td align="right">₹ -{discount.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">Net Total</td>
      <td align="right">₹ {netTotal.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">{`CGST ${restaurantdata[0]?.cgst || ""}%`}</td>
      <td align="right">₹ {cgst.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">{`SGST ${restaurantdata[0]?.sgst || ""}%`}</td>
      <td align="right">₹ {sgst.toFixed(2)}</td>
    </tr>
    <tr>
      <td align="right">Round Off</td>
      <td align="right">₹ {roundOff}</td>
    </tr>
  </tbody>
</table>

      <hr />
      <p align="right"> Grand Total : <strong>₹ {grandTotal.toFixed(2)}</strong></p>
      <hr />
      <p>{`GST No ${restaurantdata[0]?.gSTNo || ""}`}</p>
      <p>Thank you &nbsp;&nbsp;&nbsp;&nbsp; Visit Again</p>
     
    </div></div>
  );
});

export default BillPrint;
