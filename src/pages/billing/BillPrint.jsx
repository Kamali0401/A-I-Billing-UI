import React, { forwardRef } from "react";
import "../../pages/styles/styles.css";

const BillPrint = forwardRef((props, ref) => {
  const { billData } = props;
  const restaurantdata = JSON.parse(localStorage.getItem("restaurantData") || "[]");

  const formatDate = (iso) => new Date(iso).toLocaleString("en-IN");

  const calculateTotals = () => {
    const serviceamount = billData?.serviceCharge || 0.0;
    const parcelamount = billData?.parcelAmount || 0.0;
    const totalQty = (billData?.itemDetails || []).reduce((acc, item) => acc + item.qty, 0);

    const subTotal =
      (billData?.itemDetails || []).reduce((acc, item) => acc + item.price * item.qty, 0) +
      serviceamount +
      parcelamount;

    const discount = billData?.discountAmount || 0.0;
    const netTotal = subTotal - discount;
    const cgst = billData?.cgst || 0.0;
    const sgst = billData?.sgst || 0.0;
    const totalBeforeRound = netTotal + cgst + sgst;
    const grandTotal = Math.round(totalBeforeRound);
    const roundOff = (grandTotal - totalBeforeRound).toFixed(2);

    return {
      serviceamount,
      parcelamount,
      subTotal,
      discount,
      netTotal,
      cgst,
      sgst,
      roundOff,
      grandTotal,
      totalQty
    };
  };

  const {
    serviceamount,
    parcelamount,
    subTotal,
    discount,
    netTotal,
    cgst,
    sgst,
    roundOff,
    grandTotal,
    totalQty
  } = calculateTotals();

  return (
    <div ref={ref}>
      <div
        style={{
          fontFamily: "monospace",
          width: "300px",
          padding: "10px",
          border: "1px solid black"
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "0",
            textTransform: "uppercase"
          }}
        >
          {restaurantdata[0]?.restaurantName || ""}
        </h3>
        <p style={{ textAlign: "center", margin: 0 }}>{restaurantdata[0]?.address || ""}</p>
        <p style={{ textAlign: "center", margin: 0 }}>GSTIN: {restaurantdata[0]?.gstNo || ""}</p>
        <p style={{ textAlign: "center", margin: 0 }}>Ph No: {restaurantdata[0]?.phone || ""}</p>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <p style={{ margin: 0 }}>Name: {billData?.customerName || ""}</p>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <p style={{ margin: 0 }}>
          Date: {formatDate(billData.createdDate)} 
        </p>
        <p style={{ margin: 0 }}>Bill No.: {billData?.billId}&nbsp;&nbsp;
          {`${billData?.orderType || ""} : ${billData?.tableCode || ""}`}</p>
        <p style={{ margin: 0 }}>Token No: {billData?.tokenNumbers || ""}</p>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <table width="100%">
          <thead>
            <tr>
              <th align="left">Item</th>
              <th align="right">Qty</th>
              <th align="right">Price</th>
              <th align="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* Horizontal line after header */}
            <tr>
              <td colSpan="4">
                <div
                  style={{
                    width: "100%",
                    height: "3px",
                    backgroundColor: "black",
                    margin: "10px 0"
                  }}
                />
              </td>
            </tr>

            {/* Item rows */}
            {(billData?.itemDetails || []).map((item, index) => (
              <tr key={index}>
                <td align="left">{item.itemName}</td>
                <td align="right">{item.qty}</td>
                <td align="right">{item.price.toFixed(2)}</td>
                <td align="right">{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td align="left">Total Qty: {totalQty}</td>
              <td align="right">Sub Total ₹ {subTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td align="right">{`CGST ${restaurantdata[0]?.cgst || ""}%`}</td>
              <td align="right">₹ {cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td align="right">{`SGST ${restaurantdata[0]?.sgst || ""}%`}</td>
              <td align="right">₹ {sgst.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td align="right">Round Off &nbsp;&nbsp; {roundOff}</td>
            </tr>
            <tr>
              <td align="right" style={{ fontWeight: "bold", fontSize: "20px" }}>
                Grand Total : ₹ {grandTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "black",
            margin: "10px 0"
          }}
        ></div>

        <p style={{ textAlign: "center", fontSize: "17px", fontWeight: "bold", margin: 0 }}>
          FSSAI Lic No. {restaurantdata[0]?.fssaiLicNo || ""}
        </p>
        <p style={{ textAlign: "center", fontSize: "16px", margin: 0 }}>
          Thank You. Visit Again !!
        </p>
      </div>
    </div>
  );
});

export default BillPrint;
