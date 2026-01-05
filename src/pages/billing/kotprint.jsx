import React, { forwardRef, useImperativeHandle } from "react";
//import qz from "qz-tray";
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


// --- Helper to create plain text for RawBT (Android) ---
  /*const formatKotText = () => {
    const header = `KOT\n`;
    const tableLine = `Table: ${billData?.tableCatagory || ""}/${billData?.tableCode || ""}\n`;
    const waiterLine = `Waiter: ${billData?.waiterName || ""}\n`;
    const line = "-----------------------------\n";

    const itemsText = (billData?.itemDetails || [])
      .filter((item) => item.isKotPrint)
      .map((item) => {
        // Left align name (max 20 chars), right align qty (3 chars)
        const name = item.itemName.padEnd(20, " ");
        const qty = item.qty.toString().padStart(3, " ");
        const comment = item.itemComment ? `\n(${item.itemComment})` : "";
        return `${name}${qty}${comment}\n`;
      })
      .join("");

    return header + tableLine + waiterLine + line + itemsText + line;
  };*/
const formatKotText = () => {
  const itemWidth = 22; // fixed width for item name
  const qtyWidth = 3;   // fixed width for qty
  const totalWidth = itemWidth + qtyWidth;
  const line = "-".repeat(totalWidth) + "\n";

  const header = "           KOT\n"; // ~centered

  const wrapText = (text, width) => {
    const words = text.split(" ");
    let result = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + (currentLine ? " " : "") + word).length <= width) {
        currentLine += (currentLine ? " " : "") + word;
      } else {
        if (currentLine) result.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) result.push(currentLine);

    return result;
  };

  const tableRaw = `Table: ${billData?.tableCatagory || ""}/${billData?.tableCode || ""}`;
  const tableWrapped = wrapText(tableRaw, totalWidth)
    .map((line, idx) => (idx === 0 ? line : "       " + line))
    .join("\n") + "\n";

  const waiterLine = `Waiter: ${billData?.waiterName || ""}\n`;

  const columnHeader = "Item".padEnd(itemWidth, " ") + "Qty".padStart(qtyWidth, " ") + "\n";

  const itemsText = (billData?.itemDetails || [])
    .filter((item) => item.isKotPrint)
    .map((item) => {
      const lines = wrapText(item.itemName, itemWidth);

      // First line → item name + qty
      const firstLine =
        lines[0].padEnd(itemWidth, " ") +
        item.qty.toString().padStart(qtyWidth, " ");

      // Wrapped lines → only item name (no qty)
      const wrapped = lines
        .slice(1)
        .map((l) => l.padEnd(itemWidth, " ") + " ".repeat(qtyWidth))
        .join("\n");

      // Comments → wrap in parentheses, handle multi-line
      /*let commentText = "";
      if (item.itemComment) {
        const commentLines = wrapText(item.itemComment, itemWidth - 2);
        commentText = commentLines
          .map((l, idx) =>
            idx === 0
              ? "(" + l.padEnd(itemWidth - 2, " ") + ")" + " ".repeat(qtyWidth)
              : " " + l.padEnd(itemWidth - 2, " ") + " ".repeat(qtyWidth)
          )
          .join("\n");
      }*/
      // Comments → wrap inside a single pair of parentheses
      let commentText = "";
      if (item.itemComment) {
        const commentLines = wrapText(item.itemComment, itemWidth - 2);
        commentText = commentLines
          .map((l, idx) =>
            idx === 0
              ? "(" + l // first line starts with (
              : " " + l  // subsequent lines indented
          )
          .join("\n");
        // Add closing ')' at the end of last line
        const lastIdx = commentText.lastIndexOf("\n");
        if (lastIdx !== -1) {
          commentText =
            commentText.substring(0, lastIdx + 1) +
            commentText.substring(lastIdx + 1) +
            ")";
        } else {
          commentText += ")";
        }
      }
      return [firstLine, wrapped, commentText].filter(Boolean).join("\n") + "\n";
    })
    .join("\n");

  return header + tableWrapped + waiterLine + line + columnHeader + line + itemsText + line;
};









 return (
  <div ref={ref}>
  <div
    style={{
      fontFamily: "monospace",   // ✅ better alignment
      width: "165px",            // ✅ safe printable width for 58mm roll
      fontSize: "12px",          // ✅ small but readable
      lineHeight: "1.2em",       // ✅ compact lines
    }}
  >
   
    <h3 style={{ textAlign: "center", margin: "0 0 2px 0" }}>KOT</h3>
    <p style={{ textAlign: "center", margin: "0 0 2px 0" }}>
      Table: {billData?.tableCatagory}/{billData?.tableCode}
    </p>

    <hr style={{ borderTop: "1px dashed black", margin: "4px 0" }} />

    <p style={{ margin: "0 0 4px 2px" }}>
      Waiter: {billData?.waiterName || ""}
    </p>

    
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: "0.5px solid #999" }}>
          <th style={{ textAlign: "left" }}>Item</th>
          <th style={{ textAlign: "right", width: "40px" }}>Qty</th>
        </tr>
      </thead>
      <tbody>
        {(billData?.itemDetails || [])
          .filter(
            (item) =>
              item.isKotPrint === true
             // item.status === "KOT Generated" 
            //&&
            //  currentKotPrintId.includes(item.itemId)
          )
          .reduce((acc, item) => {
            const existing = acc.find((x) => x.itemId === item.itemId);
            if (!existing || existing.id < item.id) {
              return [...acc.filter((x) => x.itemId !== item.itemId), item];
            }
            return acc;
          }, [])
          .map((item, index) => (
            <tr key={index}>
             
              <td
                style={{
                  textAlign: "left",
                  maxWidth: "120px",     // ✅ ensures text fits inside
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {item.itemName}
                {item.itemComment && (
                  <div style={{ fontSize: "11px", color: "#555" }}>
                    ({item.itemComment})
                  </div>
                )}
              </td>
              <td
                style={{
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  width: "40px",
                }}
              >
                {item.qty}
              </td>
            </tr>
          ))}
      </tbody>
    </table>

    <hr style={{ borderTop: "1px solid black", margin: "6px 0" }} />

     {/* ---------- Hidden plain text for RawBT ---------- */}
     {/* <div style={{ display: "none" }}>{formatKotText()}</div>*/}
      <div className="kot-plain-text" style={{ display: "none" }}>
          {formatKotText()}
        </div>
  </div>
</div>

  );
});

export default KotPrint;
