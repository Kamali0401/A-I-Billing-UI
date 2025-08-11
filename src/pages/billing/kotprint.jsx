import React, { forwardRef } from "react";
import "../../pages/styles/styles.css";
const KotPrint = forwardRef((props, ref) => {
debugger;
  const { billData, currentKotPrintId } = props;
//console.log(billData,"billDatas");
//console.log(currentKotPrintId,"currentKotPrintId");
  const formatDate = (iso) => new Date(iso).toLocaleString();
  const calculateTotals = () => {

    //  console.log(billData,".........billData");
    const subTotal = (billData?.itemDetails || []).reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ); const discount = billData?.discountAmount || 0.00;
    const netTotal = subTotal - discount;
    const cgst = billData?.cgst || 0.00;
    const sgst = billData?.sgst || 0.00;
    const totalBeforeRound = netTotal + cgst + sgst;
    const grandTotal = Math.round(totalBeforeRound);
    const roundOff = (grandTotal - totalBeforeRound).toFixed(2);

    return { subTotal, discount, netTotal, cgst, sgst, roundOff, grandTotal };
  };

  const { subTotal, discount, netTotal, cgst, sgst, roundOff, grandTotal } = calculateTotals();

  return (
    <div ref={ref}>
      <div style={{ fontFamily: "monospace", width: "300px", padding: "10px", border: "1px solid black" }}>
        <h3 style={{ textAlign: "center", marginBottom: "0" }}>{"KOT"}</h3>
        <p style={{ textAlign: "center", margin: 0 }}>
          {`Table: ${billData?.tableCatagory}/${billData?.tableCode}`}
        </p>
         
        <hr />
<p>Waiter: {billData?.waiterName || ""}</p>
        <table width="100%">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Particulars</th>
              <th style={{ textAlign: "right" }}>Qty</th>

            </tr>
          </thead>
          <tbody>
             {(billData?.itemDetails || [])
              .filter(
                (item) =>
                  item.status === "KOT Generated" &&
                   currentKotPrintId.includes(item.itemId)
              )
               // Keep only the latest item per itemId (highest id)
    .reduce((acc, item) => {
      const existing = acc.find((x) => x.itemId === item.itemId);
      if (!existing || existing.id < item.id) {
        return [...acc.filter((x) => x.itemId !== item.itemId), item];
      }
      return acc;
    }, [])
              .map((item, index) => (
                <tr key={index}>
          <td style={{ textAlign: "left" }}>
            {item.itemName}
            {item.itemComment && (
              <div style={{ fontSize: "12px", color: "#555" }}>
                ({item.itemComment})
              </div>
            )}
          </td>
                  <td style={{ textAlign: "right" }}>{item.qty}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <hr />






      </div></div>
  );
});

export default KotPrint;
