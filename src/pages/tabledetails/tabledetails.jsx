import React, { useEffect, useState, useRef } from "react";
import "../../pages/styles/styles.css"; // assuming styles are defined here
import { ApiKey } from "../../api/endpoints";
import { publicAxios } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { routePath } from "../../app/routes/routepath";
import AddTableModal from "./addtabledetails";
import { useReactToPrint } from "react-to-print";
import BillPrint from "./../billing/BillPrint";
import { Modal, Button, Form } from "react-bootstrap";
const TableDetails = () => {
  const [tableDetails, setTableDetails] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [printloading, setPrintLoading] = useState(true);
  const [OrderDetails, setOrderDetails] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState("");
const roleId = localStorage.getItem("roleid");
  const fetchTables = async () => {
    try {
      debugger;
      setLoading(true);
      const response = await publicAxios.get(ApiKey.MappingDetails);
      setTableDetails(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (tableId) => {
    setSelectedCheckboxes(
      (prev) =>
        prev.includes(tableId)
          ? prev.filter((id) => id !== tableId) // Remove if already selected
          : [...prev, tableId] // Add if not selected
    );
  };

  useEffect(() => {
    fetchTables();
  }, []);
  const billprintRef = useRef();

  // 2. Handle new table addition
  const handleAddTable = () => {
    debugger;
    fetchTables(); // Re-fetch to update the UI with the new table
  };

  const triggerPrint = useReactToPrint({
    documentTitle: "A&IS Cafe Bill",
    contentRef: billprintRef,
  });

  const handlePrint = async (data) => {
    debugger;
    try {
      setPrintLoading(true);

      const response = await publicAxios.get(`orderDetail/${data?.orderId}`);
      setOrderDetails(response.data);
      triggerPrint(); // ✅ trigger print

      // Wait for state to update/render before printing (optional: use delay or callback)
      // setTimeout(() => {
      //   triggerPrint(); // ✅ trigger print
      // }, 100);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setPrintLoading(false);
    }
  };
  const groupedTables = tableDetails.reduce((acc, table) => {
    const { tableCatagory } = table;
    if (!acc[tableCatagory]) acc[tableCatagory] = [];
    acc[tableCatagory].push(table);
    return acc;
  }, {});
  const handleTableClick = async (table) => {
    debugger;
const tablesWithNoOrders = table.filter((table) => table.orderId === 0);
  const tablesWithOrders = table.filter((table) => table.orderId !== 0);

  // Declare seatIds outside so it's accessible in both blocks
  const seatIds = table.map((t) => t.seatId).join(",");
  setSelectedSeatIds(seatIds); // Store it in state if needed globally
  //console.log(seatIds, "seat");

  if (tablesWithNoOrders.length > 0) {
    tablesWithNoOrders.forEach((table) => {
      navigate(`${routePath.main}/${routePath.billing}`, {
        state: {
          tableId: table.tableId,
          tableCode: table.tableCode,
          tableCatagory: table.tableCatagory,
          seatId: seatIds, // ✅ Use here
          orderDetails: [],
        },
      });
    });
  } else if (tablesWithOrders.length > 0) {
    for (const table of tablesWithOrders) {
      try {
        debugger;
        const response = await publicAxios.get(`orderDetail/${table.orderId}`);
        const data = response.data;

        navigate(`${routePath.main}/${routePath.billing}`, {
          state: {
            orderDetails: data,
            seatId: seatIds, // ✅ Use here also
          },
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  }
    //if (table.orderId === 0) {
    //const tablesWithNoOrders = table.filter((table) => table.orderId === 0);

 /* if (tablesWithNoOrders.length > 0) {
    debugger;
    // Handle tables with no orders
    const seatIds = tablesWithNoOrders.map((table) => table.seatId).join(',');
   setSelectedSeatIds(seatIds); // ⬅️ Save to state
    console.log(seatIds,"seat");
    tablesWithNoOrders.forEach((table) => {
      navigate(`${routePath.main}/${routePath.billing}`, {
        state: {
          tableId: table.tableId,
          tableCode: table.tableCode,
          tableCatagory: table.tableCatagory,
           seatId:seatIds,
          orderDetails: [],
          // orderId:table.orderId
        },
      });
    })
    } else {
      //if (table.orderId === 1) {
      const tablesWithOrders = table.filter((table) => table.orderId !== 0);

  for (const table of tablesWithOrders) {
  
      try {
        debugger;
        const response = await publicAxios.get(`orderDetail/${table.orderId}`);

        const data = response.data;

        // Navigate to /orderDetail/:id and pass the order details
        navigate(`${routePath.main}/${routePath.billing}`, {
          state: { orderDetails: data, seatId:seatIds },
        });
        // Optionally navigate or update state/modal here
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    }
  }*/
  };

  const [showModalPopup, setshowModalPopup] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleOpenModal = (table) => {
    debugger;
    setSelectedTable(table);
    setshowModalPopup(true);
  };

  const handleCloseModal = () => {
    setshowModalPopup(false);
    setSelectedTable(null);
  };
  /*const seatCountByOrderAndTable = selectedTable.reduce((acc, table) => {
    const key = `${table.orderId}-${table.tableId}`;
    if (!acc[key]) {
      acc[key] = { orderId: table.orderId, tableId: table.tableId, count: 0 };
    }
    acc[key].count += 1; // Increment seat count for the group
    return acc;
  }, {});*/
  // const getElapsedTime = (createdDate) => {
  //   if (!createdDate) return "0m";

  //   const start = new Date(createdDate);
  //   const now = new Date();

  //   const diffMs = now - start;
  //   const diffMinutes = Math.floor(diffMs / (1000 * 60));

  //   const hours = Math.floor(diffMinutes / 60);
  //   const minutes = diffMinutes % 60;

  //   if (hours > 0) {
  //     return `${hours}h ${minutes}m`;
  //   } else {
  //     return `${minutes}m`;
  //   }
  // };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Move KOT Items":
        return "bg-gray";
      case "Paid Table":
        return "bg-gray";
      case "Printed Table":
        return "bg-lightgreen";
      case "Running KOT Table":
        return "bg-pink";
      case "Running Table":
        return "bg-boldorgange";
      case "Order Closed Table":
        return "bg-blue";
      default:
        return "bg-blank"; // Blank Table
    }
  };
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }
  return (
    <div className="table-container px-3 py-3">
      {/* Top Section: Header and Action Buttons */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h4 className="card-title">Table View</h4>
        <div className="d-flex gap-2">
          {/* <button className="t_btn">Delivery</button>
          <button className="t_btn">Pick Up</button> */}
           {roleId !== "5" && (
          <button className="t_btn" onClick={() => setShowModal(true)}>
            + Add Table
          </button>
           )}
        </div>
      </div>

      {/* Secondary Buttons */}
      <div
        className="d-flex justify-content-between align-items-center mb-3 flex-wrap "
        align="left"
      >
        {/* <button className="btn btn-danger">+ Contactless</button> */}
        <div>
          <div className="d-flex align-items-center flex-wrap gap-3">
            {/* <button className="btn btn-outline-dark me-3">Move KOT / Items</button> */}

            {/* Table Status Legend with clickable items   d-flex align-items-center gap-2 border border-dark rounded px-3 py-1 bg-transparent */}
            <div className="d-flex align-items-center flex-wrap gap-3">
              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-blank"></span>
                <span>Blank Table</span>
              </button>
              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-boldorgange"></span>
                <span>Running Table</span>
              </button>

              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-pink"></span>
                <span>Running KOT Table</span>
              </button>
              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-gray"></span>
                <span>Move KOT / Items</span>
              </button>
              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-blue"></span>
                <span>Order Closed Table</span>
              </button>

              <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-lightgreen"></span>
                <span>Ready To Print</span>
              </button>
               <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle " style={{ backgroundColor: "rgb(206, 76, 76)" }}></span>
                <span>Filled Tables</span>
              </button>
              {/* <button className="legend-btn d-flex align-items-center gap-2 px-3 py-1 bg-transparent">
                <span className="legend-circle bg-yellow"></span>
                <span>Paid Table</span>
              </button> */}

              {/*d-flex align-items-center gap-1 border-0 bg-transparent p-0*/}
              {/* <button className="d-flex align-items-center gap-2 border border-dark rounded-3 px-3 py-1 bg-transparent">
      <span className="legend-circle bg-orange"></span>
      <span>Running KOT Table</span>
    </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Table Sections */}
{Object.entries(groupedTables).map(([category, tables]) => {
  //console.log(`Category: ${category}`, tables);

  // Group tables by `tableId`
  const groupedByTableId = tables.reduce((acc, table) => {
    if (!acc[table.tableId]) {
      acc[table.tableId] = [];
    }
    acc[table.tableId].push(table);
    return acc;
  }, {});
 // console.log(groupedByTableId, "groupedByTableId");

  return (
    <div key={category} className="mb-4">
      <h5 className="fw-bold text-uppercase mb-2">{category}</h5>
      <div className="d-flex flex-wrap gap-2">
        {Object.values(groupedByTableId).map((tableGroup) => {
          const representativeTable = tableGroup[0]; // Pick the first table as a representative
          const totalSeats = tableGroup.length;
          const availableSeats = tableGroup.filter((t) => t.orderId === 0).length;

          // Determine the label
          const displayLabel = (
            <>
              {representativeTable.tableCode}
              {availableSeats > 0 && <br />}
              {availableSeats > 0 && `Avail: ${availableSeats}`}
            </>
          );

          return (
            <div
              key={representativeTable.id}
              className={`table-card-wrapper position-relative `}
               style={{
          backgroundColor: availableSeats > 0 ? " #e0e0e0" :" rgb(206, 76, 76)",
        }}
            >
              <div
                className="table-card text-center p-2"
                onClick={() => handleOpenModal(tableGroup)} // Open modal on click
                style={{ cursor: "pointer" }}
              >
                <strong>{displayLabel}</strong>

                {representativeTable.status !== "Blank Table" &&
                  OrderDetails?.itemDetails?.length > 0 && (
                    <div className="price-time">
                      ₹ {OrderDetails?.subTotal?.toFixed(2) || ""}
                    </div>
                  )}
              </div>
              {OrderDetails?.itemDetails?.length > 0 && (
                <div style={{ display: "none" }}>
                  <BillPrint
                    ref={billprintRef}
                    billData={OrderDetails || { itemDetails: [] }}
                  />
                </div>
              )}
              {representativeTable.status !== "Blank Table" && (
                <div className="table-icons">
                  <i
                    className="fa fa-print me-2 clickable-icon"
                    title="Print"
                    onClick={() => handlePrint(representativeTable)}
                    disable={printloading}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
})}


      <AddTableModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleAddTable}
      />
      <Modal show={showModalPopup} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Table Details - {selectedTable?.[0]?.tableCode}
          </Modal.Title>
        </Modal.Header>
     <Modal.Body>
  {selectedTable ? (
    <Form>
      {Object.values(
        selectedTable.reduce((acc, table) => {
          const key = table.orderId !== 0 ? `${table.orderId}-${table.tableId}` : `${table.id}`;
          if (!acc[key]) {
            acc[key] = { ...table, count: 0 }; // Keep the first occurrence
          }
          acc[key].count += 1; // Increment count for this group
          return acc;
        }, {})
      )
        // Sort the grouped data to ensure `orderId !== 0` comes first
        .sort((a, b) => (a.orderId === 0 ? 1 : b.orderId === 0 ? -1 : 0))
        .map((groupedTable) => {
          // Prepare the label for display
          const displayLabel =
            groupedTable.orderId !== 0
              ? `Order ID: ${groupedTable.orderId} - Total Person: ${groupedTable.count}`
              : `Seat No: ${groupedTable.seatId || "N/A"}`;

          /*return (
            <Form.Group key={groupedTable.id} className="mb-3">
              <Form.Check
                type="checkbox"
                label={displayLabel}
                checked={
                  groupedTable.orderId !== 0 || selectedCheckboxes.includes(groupedTable.id)
                }
                onChange={() => handleCheckboxChange(groupedTable.id)}
                className={getStatusColorClass(groupedTable.status)} // Highlight checkbox
              />
            </Form.Group>
          );
        })}*/
        if (groupedTable.orderId !== 0) {
          // Render as a selectable div for rows with orderId !== 0
          return (
            <div
              key={groupedTable.id}
              className={`selectable ${getStatusColorClass(groupedTable.status)}`}
              onClick={() => handleTableClick([groupedTable])}
              style={{ cursor: "pointer", padding: "10px", marginBottom: "10px" }}
            >
              {displayLabel}
            </div>
          );
        } else {
          // Render as a checkbox for rows with orderId === 0
          return (
            <Form.Group key={groupedTable.id} className="mb-3">
              <Form.Check
                type="checkbox"
                label={displayLabel}
                checked={selectedCheckboxes.includes(groupedTable.id)}
                onChange={() => handleCheckboxChange(groupedTable.id)}
                className={getStatusColorClass(groupedTable.status)} // Highlight checkbox
              />
            </Form.Group>
          );
        }
      })}
    </Form>
  ) : (
    <p>No table selected</p>
  )}
</Modal.Body>
<Modal.Footer>
 { /*<Button
    variant="primary"
    onClick={() => {
     if (selectedTable) {
        console.log(selectedTable,"SELECTTABLE");
        const selectedTables = selectedTable.filter((table) =>
          selectedCheckboxes.includes(table.id)
        );
        handleTableClick(selectedTables);
      }
    }}
  >
    Go to Order Page
  </Button>*/}
   {selectedTable &&
    selectedTable
      
      .some((table) => table.status === "Blank Table") && (
        <Button
          variant="primary"
          onClick={() => {
            const selectedTables = selectedTable.filter((table) =>
              selectedCheckboxes.includes(table.id)
            );
            handleTableClick(selectedTables);
          }}
        >
          Go to Order Page
        </Button>
      )}
</Modal.Footer>



      </Modal>
    </div>
  );
};
export default TableDetails;
