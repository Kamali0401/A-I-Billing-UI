import React, { useEffect, useState, useRef } from "react";
import "../../pages/styles/styles.css";
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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalPopup, setShowModalPopup] = useState(false);
  const [selectedTable, setSelectedTable] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [personCounts, setPersonCounts] = useState({});
  const [OrderDetails, setOrderDetails] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState("");

  const navigate = useNavigate();
  const roleId = localStorage.getItem("roleid");
  const billprintRef = useRef();

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await publicAxios.get(ApiKey.MappingDetails);
      setTableDetails(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCheckboxChange = (tableId) => {
    setSelectedCheckboxes((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const triggerPrint = useReactToPrint({
    documentTitle: "A&IS Cafe Bill",
    contentRef: billprintRef,
  });

  const handlePrint = async (data) => {
    try {
      const response = await publicAxios.get(`orderDetail/${data?.orderId}`);
      setOrderDetails(response.data);
      triggerPrint();
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const groupedTables = tableDetails.reduce((acc, table) => {
    const { tableCatagory } = table;
    if (!acc[tableCatagory]) acc[tableCatagory] = [];
    acc[tableCatagory].push(table);
    return acc;
  }, {});

  const handleTableClick = async (tables) => {
    if (tables.length === 0) return;
    const totalPersons = tables.length;

    const tablesWithOrders = tables.filter(t => t.orderId !== 0);
    const tablesWithoutOrders = tables.filter(t => t.orderId === 0);

    if (tablesWithoutOrders.length > 0) {
      const seatIds = tablesWithoutOrders.map(t => t.seatId).join(",");
      setSelectedSeatIds(seatIds);
      tablesWithoutOrders.forEach((table) => {
        navigate(`${routePath.main}/${routePath.billing}`, {
          state: {
            tableId: table.tableId,
            tableCode: table.tableCode,
            tableCatagory: table.tableCatagory,
            seatId: seatIds,
            orderDetails: [],
          },
        });
      });
    } else if (tablesWithOrders.length > 0) {
      for (const table of tablesWithOrders) {
        try {
          const response = await publicAxios.get(`orderDetail/${table.orderId}`);
          navigate(`${routePath.main}/${routePath.billing}`, {
            state: {
              orderDetails: response.data,
              seatId: totalPersons,
            },
          });
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    }
  };

  /*const handleOpenModal = (tableGroup) => {
    debugger;
  setSelectedTable(tableGroup);

  /*setPersonCounts(() => {
    const newCounts = {};

    tableGroup.forEach((table) => {
      if (table.orderId !== 0) {
        // Increment count for each seat with the same orderId
        newCounts[table.orderId] = (newCounts[table.orderId] || 0) + 1;
      } else {
        // Seats without orderId are counted individually
        newCounts[`seat-${table.id}`] = 1;
      }
    });

    return newCounts;
  });*/
/*  setPersonCounts(prev => {
    const newCounts = { ...prev };

    tableGroup.forEach(table => {
      if (table.orderId !== 0) {
        // Increment count for each seat with the same orderId
        newCounts[table.orderId] = (newCounts[table.orderId] || 0) + 1;
      } else {
        // Seats without orderId are counted individually
        newCounts[`seat-${table.id}`] = 1;
      }
    });

    return newCounts;
  });

  // Reset selected checkboxes for seats
  setSelectedCheckboxes([]);
  setShowModalPopup(true);
};*/
const handleOpenModal = (tableGroup) => {
  debugger;
  setSelectedTable(tableGroup);

  const newCounts = { ...personCounts }; // start with previous counts

  // Count seats for each orderId in the current table group
  const orderIdMap = {};
  tableGroup.forEach(table => {
    if (table.orderId !== 0) {
      orderIdMap[table.orderId] = (orderIdMap[table.orderId] || 0) + 1;
    } else {
      newCounts[`seat-${table.id}`] = 1; // seats without order
    }
  });

  // Update global counts for this group
  Object.keys(orderIdMap).forEach(orderId => {
    newCounts[orderId] = orderIdMap[orderId]; // overwrite instead of increment
  });

  setPersonCounts(newCounts);

  setSelectedCheckboxes([]);
  setShowModalPopup(true);
};



  const handleCloseModal = () => {
    setShowModalPopup(false);
    setSelectedTable([]);
    setSelectedCheckboxes([]);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Move KOT Items": return "bg-gray";
      case "Paid Table": return "bg-gray";
      case "Printed Table": return "bg-lightgreen";
      case "Running KOT Table": return "bg-pink";
      case "Running Table": return "bg-boldorgange";
      case "Order Closed Table": return "bg-blue";
      default: return "bg-blank";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="table-container px-3 py-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
        <h4 className="card-title">Table View</h4>
        <div className="d-flex gap-2">
          {roleId !== "2" && roleId !== "3" && (
            <button className="t_btn" onClick={() => setShowModal(true)}>+ Add Table</button>
          )}
        </div>
      </div>

      {Object.entries(groupedTables).map(([category, tables]) => {
        const groupedByTableId = tables.reduce((acc, table) => {
          if (!acc[table.tableId]) acc[table.tableId] = [];
          acc[table.tableId].push(table);
          return acc;
        }, {});

        return (
          <div key={category} className="mb-4">
            <h5 className="fw-bold text-uppercase mb-2">{category}</h5>
            <div className="d-flex flex-wrap gap-2">
              {Object.values(groupedByTableId).map((tableGroup) => {
                const representativeTable = tableGroup[0];
                const availableSeats = tableGroup.filter(t => t.orderId === 0).length;

                const displayLabel = (
                  <>
                    {representativeTable.tableCode}
                    {availableSeats > 0 && <br />}
                    {availableSeats > 0 && `Avail: ${availableSeats}`}
                  </>
                );

                return (
                  <div key={representativeTable.id} className="table-card-wrapper position-relative"
                    style={{ backgroundColor: availableSeats > 0 ? "#e0e0e0" : "rgb(206, 76, 76)" }}>
                    <div className="table-card text-center p-2"
                      onClick={() => handleOpenModal(tableGroup)}
                      style={{ cursor: "pointer" }}>
                      <strong>{displayLabel}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <AddTableModal show={showModal} handleClose={() => setShowModal(false)} onSubmit={fetchTables} />

    <Modal show={showModalPopup} onHide={handleCloseModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Table Details - {selectedTable?.[0]?.tableCode}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedTable.length > 0 ? (
      <Form>
        {(() => {
          const orderGroups = {};
          const seatGroups = [];

          // Separate orders and seats
          selectedTable.forEach((table) => {
            if (table.orderId !== 0) {
              if (!orderGroups[table.orderId]) orderGroups[table.orderId] = [];
              orderGroups[table.orderId].push(table);
            } else {
              seatGroups.push(table);
            }
          });

          // Render orders with correct total persons
          /*const orderElements = Object.entries(orderGroups).map(([orderId, tables]) => {
            const totalPersons = tableDetails.filter(t => t.orderId === parseInt(orderId)).length;

            return (
              <div
                key={`order-${orderId}`}
                className={`selectable ${getStatusColorClass(tables[0].status)}`}
                onClick={() => handleTableClick(tables)}
                style={{ cursor: "pointer", padding: "10px", marginBottom: "10px" }}
              >
                {`Order ID: ${orderId} - Total Person: ${totalPersons}`}
              </div>
            );
          });*/
const orderElements = Object.entries(orderGroups).map(([orderId, tables]) => {
  debugger;
  const totalPersons = personCounts[orderId] || tables.length;

  return (
    <div
      key={`order-${orderId}`}
      className={`selectable ${getStatusColorClass(tables[0].status)}`}
      onClick={() => handleTableClick(tables)}
      style={{ cursor: "pointer", padding: "10px", marginBottom: "10px" }}
    >
      {`Order ID: ${orderId} - Total Person: ${totalPersons}`}
    </div>
  );
});

          // Render seats with unchecked checkboxes by default
          const seatElements = seatGroups.map((table) => (
            <Form.Group key={`seat-${table.id}`} className="mb-3">
              <Form.Check
                type="checkbox"
                label={`Seat No: ${table.seatId || "N/A"}`}
                checked={selectedCheckboxes.includes(table.id)}
                onChange={() => handleCheckboxChange(table.id)}
                className={getStatusColorClass(table.status)}
              />
            </Form.Group>
          ));

          return [...orderElements, ...seatElements];
        })()}
      </Form>
    ) : (
      <p>No table selected</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    {selectedTable.length > 0 && selectedTable.some(table => table.orderId === 0) && (
      <Button
        variant="primary"
        onClick={() => {
          const selectedSeats = selectedTable.filter((table) =>
            selectedCheckboxes.includes(table.id)
          );
          handleTableClick(selectedSeats);
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
