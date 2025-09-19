import React, { useState, useEffect, useRef } from "react";
import { FaPrint } from "react-icons/fa";
import { fetchOrderDetailsReq } from "../../api/billlingApi/billing";
import BillPrint from "../../pages/billing/BillPrint";

export default function ReportTable({ data, onPrint }) {
  const [loadingId, setLoadingId] = useState(null);
  const [billData, setBillData] = useState([]);
  const billRef = useRef(null);

  // ✅ Add dynamic columns
  let baseColumns = Object.keys(data[0] || {});
  let columns = [];
  baseColumns.forEach((col) => {
    debugger;
    if (col.toLowerCase().includes("mode of payment")) {
      columns.push("Cash", "Card", "UPI"); // replace with split columns
    } else {
      columns.push(col);
    }
  });

const formatValue = (val, col, row) => {
  // ✅ Handle Payment Split
  if (["cash", "card", "upi"].includes(col.toLowerCase())) {
    let paymentStr = row["Mode of Payment"];

    // if empty or {}, return "-"
    if (!paymentStr || (typeof paymentStr === "object" && Object.keys(paymentStr).length === 0)) {
      return "-";
    }

    // ensure string
    paymentStr = String(paymentStr).trim();
    let amount = 0;

    if (paymentStr.includes(":")) {
      // case: "Cash: '100', Card: '100', Upi: '20'"
      const parts = paymentStr.split(",").map((p) => p.trim());
      parts.forEach((p) => {
        let [type, value] = p.split(":").map((s) => s.trim());
        if (value) value = value.replace(/['"]+/g, ""); // remove quotes
        if (type && type.toLowerCase() === col.toLowerCase()) {
          amount = Number(value || 0);
        }
      });
    } else {
      // case: only "Cash" / "Card" / "Upi"
      if (paymentStr.toLowerCase() === col.toLowerCase()) {
        amount = Number(row["Sub Total"] || 0); // ✅ use Sub Total
      }
    }

    return amount > 0 ? amount.toFixed(2) : "-";
  }

  // ✅ Format Bill Date
  /*if (col.toLowerCase().includes("date")) {
    const d = new Date(val);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }*/
 // ✅ Format Bill Date to 12-hour format
  if (col.toLowerCase().includes("date")) {
    const d = new Date(val);
    if (!isNaN(d)) {
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // ✅ 12-hour format with AM/PM
      });
    }
    return val ?? "-";
  }

  // ✅ Format currency fields
  if (
    col.toLowerCase().includes("total") ||
    col.toLowerCase().includes("amount") ||
    col.toLowerCase().includes("subtotal") ||
    col.toLowerCase().includes("net")
  ) {
    return Number(val).toFixed(2);
  }

  // fallback
  return val ?? "-";
};




  const handlePrint = async (row) => {
    try {
      const orderNo = row["Order No"];
      setLoadingId(orderNo);
      const res = await fetchOrderDetailsReq(orderNo);
      setBillData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Print failed", err);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    if (billData && billData.length > 0) {
      handleBillPrintSave();
    }
  }, [billData]);

  const handleBillPrintSave = () => {
    if (!billRef.current) return;
    const billTextDiv = billRef.current.querySelector(".bill-plain-text");
    const billText = billTextDiv ? billTextDiv.innerText : "";
    if (!billText) return;

    const encoded = btoa(unescape(encodeURIComponent(billText)));

    if (/android/i.test(navigator.userAgent)) {
      const link = document.createElement("a");
      link.href = `rawbt:base64,${encoded}`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      printBillIframe(billText);
    }
  };

  const printBillIframe = (billText) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.top = "-10000px";
    iframe.style.left = "-10000px";
    document.body.appendChild(iframe);

    iframe.contentDocument.open();
    iframe.contentDocument.write(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            @page { margin: 0; }

            @media print {
            body { width: 225px; margin: 0; padding: 0; }
          }
         body {
            font-family: monospace;
            font-size: 11.5px;
            line-height: 1.4;
          }
          pre { margin: 0; white-space: pre-wrap; }
          </style>
        </head>
        <body><pre>${billText}</pre></body>
      </html>
    `);
    iframe.contentDocument.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    iframe.contentWindow.onafterprint = () => {
      document.body.removeChild(iframe);
    };
  };

  return (
    <div className="mt-6">
      {data && data.length > 0 ? (
        <div className="overflow-x-auto border rounded-xl shadow p-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="border px-3 py-2 bg-gray-100 text-sm font-medium text-left"
                  >
                    {col}
                  </th>
                ))}
                <th className="border px-3 py-2 bg-gray-100 text-sm font-medium text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2 text-sm">
                      {formatValue(row[col], col, row)}
                    </td>
                  ))}
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => handlePrint(row)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {loadingId === row["Order No"] ? "..." : <FaPrint size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
      <div style={{ display: "none" }}>
        <BillPrint ref={billRef} billData={billData || []} />
      </div>
    </div>
  );
}
