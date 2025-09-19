import React, { forwardRef } from "react";
import "../../pages/styles/styles.css";

const BillPrint = forwardRef((props, ref) => {
  debugger;
  const { billData } = props;

  // 🔹 Always restaurant profile as [0]
  const restaurantdata = JSON.parse(localStorage.getItem("restaurantData") || "[]");

  // 🔹 Ensure billData works for both object or array
  const bill = Array.isArray(billData) ? billData[0] : billData;

 const formatDate = (iso) => new Date(iso).toLocaleString("en-IN", {year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,});

  const calculateTotals = () => {
    const serviceamount = bill?.serviceCharge || 0.0;
    const parcelamount = bill?.parcelAmount || 0.0;
    const totalQty = (bill?.itemDetails || []).reduce((acc, item) => acc + item.qty, 0);
    const subTotal =
      (bill?.itemDetails || []).reduce((acc, item) => acc + item.price * item.qty, 0) +
      serviceamount +
      parcelamount;
    const discount = bill?.discountAmount || 0.0;
    const netTotal = subTotal - discount;
    const cgst = bill?.cgst || 0.0;
    const sgst = bill?.sgst || 0.0;
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
      totalQty,
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
    totalQty,
  } = calculateTotals();

  // ===== HELPERS =====
  const lineWidth = 32;
  const colSpacing = 1;

  const wrapText = (text, maxLen = lineWidth) => {
    if (!text) return "";
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + (currentLine ? " " : "") + word).length <= maxLen) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines.join("\n");
  };

  const padRight = (text, length) => (text + " ".repeat(length)).slice(0, length);
  const padLeft = (text, length) => (" ".repeat(length) + text).slice(-length);

  const centerText = (str, width = lineWidth) => {
    if (!str) return "";
    str = str.toString();
    const len = str.length;
    if (len >= width) return str;
    const leftPadding = Math.floor((width - len) / 2);
    return " ".repeat(leftPadding) + str;
  };

  // ===== BILL FORMATTER =====
  const formatBillText = (forRawBT = true) => {
    let text = "";

    // ===== HEADER =====
    text += centerText(restaurantdata[0]?.restaurantName || "") + "\n";

   // const addressLines = wrapText(restaurantdata[0]?.address || "", lineWidth).split("\n");
   // addressLines.forEach((line) => (text += centerText(line) + "\n"));
const fullAddress = `${restaurantdata[0]?.address || ""}, ${restaurantdata[0]?.city || ""}`;
const addressLines = wrapText(fullAddress, lineWidth).split("\n");
addressLines.forEach((line) => (text += centerText(line) + "\n"));


    text += centerText(`GSTIN: ${restaurantdata[0]?.gstNo || ""}`) + "\n";
    text += centerText(`Ph No: ${restaurantdata[0]?.phone || ""}`) + "\n";
    text += "-".repeat(lineWidth) + "\n";

    // ===== CUSTOMER INFO =====
    text += `Name: ${bill?.customerName || ""}\n`;
    text += ".".repeat(lineWidth) + "\n"; 
    text += `Date: ${formatDate(bill?.createdDate)}\n`;
    text += `Bill No: ${bill?.billId} | ${bill?.orderType || ""} ${bill?.tableCode || ""}\n`;
    text += `Token: ${bill?.tokenNumbers || ""}\n`;
    text += "-".repeat(lineWidth) + "\n";

    // ===== ITEM TABLE =====
    const itemCol = 12;
    const qtyCol = 3;
    const rateCol = 7;
    const amtCol = 7;

    text +=
      padRight("Item", itemCol) +
      " ".repeat(colSpacing) +
      padLeft("Qty", qtyCol) +
      " ".repeat(colSpacing) +
      padLeft("Rate", rateCol) +
      " ".repeat(colSpacing) +
      padLeft("Amt", amtCol) +
      "\n";
    text += "-".repeat(lineWidth) + "\n";

    (bill?.itemDetails || []).forEach((item) => {
      const nameLines = wrapText(item.itemName, itemCol).split("\n");

      nameLines.forEach((line, idx) => {
        if (idx === 0) {
          text +=
            padRight(line, itemCol) +
            " ".repeat(colSpacing) +
            padLeft(item.qty.toString(), qtyCol) +
            " ".repeat(colSpacing) +
            padLeft(item.price.toFixed(2), rateCol) +
            " ".repeat(colSpacing) +
            padLeft((item.qty * item.price).toFixed(2), amtCol) +
            "\n";
        } else {
          text += padRight(line, itemCol) + "\n";
        }
      });
    });

    text += "-".repeat(lineWidth) + "\n";

    // ===== TOTALS =====
    const currency = "Rs";

    const formatLine = (label, value, currencySymbol = "") => {
      const labelWidth = 15;
      const valueWidth = 12;
      const valText = currencySymbol ? currencySymbol + " " + value : value;
      return label.padEnd(labelWidth, " ") + ": " + valText.toString().padStart(valueWidth, " ") + "\n";
    };

    text += formatLine("Total Qty", totalQty);
    text += formatLine("Sub Total", subTotal.toFixed(2));
    text += formatLine("CGST", cgst.toFixed(2));
    text += formatLine("SGST", sgst.toFixed(2));
    text += "-".repeat(lineWidth) + "\n";

    const roundOffText = (roundOff >= 0 ? "" : "-") + Math.abs(roundOff).toFixed(2);
    text += formatLine("Round Off", roundOffText);
    text += formatLine("Grand Total", grandTotal.toFixed(2), currency);

    text += "-".repeat(lineWidth) + "\n";

    // ===== FOOTER =====
    text += centerText(`FSSAI Lic No: ${restaurantdata[0]?.fssaiLicNo || ""}`) + "\n";
    text += centerText("Thank You, Visit Again!") + "\n\n\n";

    return text;
  };

return (
<div
  ref={ref}
  style={{
    fontFamily: "monospace", // thermal printer style
      width: "230px",          // ~58mm roll
    fontSize: "11.5px",        // uniform font
    lineHeight: "1.3",
    //textTransform: "uppercase", // ✅ Force all text to uppercase
  }}
>
  {/* Header */}
  <div style={{ textAlign: "center" }}>
    <strong style={{ fontSize: "13px" }}>
      {restaurantdata[0]?.restaurantName || ""}
    </strong>
    <div style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "100%"
          }}>{restaurantdata[0]?.address || ""}</div>
    <div>GSTIN: {restaurantdata[0]?.gstNo || ""}</div>
    <div>Ph No: {restaurantdata[0]?.phone || ""}</div>
  </div>

  <div style={{ borderTop: "1px solid black", margin: "4px 0" }} />
  {/*
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

  */}
   <p style={{ margin: 0 }}>Name: {billData?.customerName || ""}</p>
  
  {/* Customer / Bill Info */}
  <div style={{ borderTop: "1px solid black", margin: "4px 0" }} />
  <div>Date: {formatDate(billData.createdDate)}</div>
  <div>
    Bill No: {billData?.billId} | {billData?.orderType} {billData?.tableCode}
  </div>
  <div>Token: {billData?.tokenNumbers || ""}</div>

  <div style={{ borderTop: "1px solid black", margin: "4px 0" }} />

  {/* Items */}
  {/* <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
    <span>Item</span>
    <span>Qty Rate Amt</span>
  </div>

  {(billData?.itemDetails || []).map((item, index) => (
    <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ maxWidth: "110px", wordWrap: "break-word" }}>{item.itemName}</span>
      <span>
        {item.qty} {item.price.toFixed(2)} {(item.qty * item.price).toFixed(2)}
      </span>
    </div>
  ))} */}

<table
  style={{
    width: "100%",
    fontSize: "12px",
    fontFamily: "monospace", // ✅ better for thermal printers
  }}
>
  <thead>
    <tr style={{ borderBottom: "1px solid #000" }}>
      <th align="left">Item</th>
      <th align="right">Qty</th>
      <th align="right">Rate</th>
      <th align="right">Amt</th>
    </tr>
  </thead>
  <tbody>
    {(billData?.itemDetails || []).map((item, index) => (
      <tr key={index}>
        
        <td
          align="left"
          style={{
            maxWidth: "98px", // ✅ adjusted for 58mm
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        >
          {item.itemName}
        </td>
        <td align="right" style={{ width: "30px" }}>{item.qty}</td>
        <td align="right" style={{ width: "45px" }}>{item.price.toFixed(2)}</td>
        <td align="right" style={{ width: "55px" }}>
          {(item.qty * item.price).toFixed(2)}
        </td>
      </tr>
    ))}
  </tbody>
</table>
  <div style={{ borderTop: "1px solid black", margin: "4px 0" }} />

  {/* Totals */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>Total Qty: {totalQty}</span>
    <span>SubTotal: {subTotal.toFixed(2)}</span>
  </div>
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>CGST</span>
    <span>{cgst.toFixed(2)}</span>
  </div>
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <span>SGST</span>
    <span>{sgst.toFixed(2)}</span>
  </div>
  <div style={{ display: "flex", justifyContent: "space-between" ,borderTop:"1px solid black"}}>
    <span>Round Off</span>
    <span>{roundOff}</span>
  </div>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      fontWeight: "bold",
      fontSize: "13px",
    }}
  >
    <span>Grand Total</span>
    <span>₹ {grandTotal.toFixed(2)}</span>
  </div>

  <div style={{ borderTop: "1px solid black", margin: "4px 0" }} />

  {/* Footer */}
  <div style={{ textAlign: "center", fontSize: "11px" }}>
    FSSAI Lic No. {restaurantdata[0]?.fssaiLicNo || ""}
  </div>
  <div style={{ textAlign: "center", fontSize: "12px", marginTop: "4px" }}>
    Thank You, Visit Again!
  </div>
  <div className="bill-plain-text" style={{ display: "none" }}>
  {formatBillText()}
</div>
</div>

  ); // or your actual printing logic
});


export default BillPrint;
