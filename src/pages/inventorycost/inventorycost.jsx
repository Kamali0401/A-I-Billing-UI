import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryCostList, deleteInventoryCost } from "../../app/redux/slice/inventoryCost/inventoryCostSlice";
import AddInventoryCostModal from "../inventorycost/addinventorycost";
import Swal from "sweetalert2";

const InventoryCost = () => {
  const dispatch = useDispatch();

  const { data: inventorycosts = [], loading = false } = useSelector((state) => state.inventoryCostList || {});
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selectedinventorycost, setSelectedinventorycost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const inventoryCostsPerPage = 5;

  useEffect(() => {
    dispatch(fetchInventoryCostList());
  }, [dispatch]);

  const handleEdit = (inventorycost) => {
    setSelectedinventorycost(inventorycost);
    setShowModal(true);
  };

  const handleAddinventorycost = () => {
    setSelectedinventorycost(null);  // Clear any selected inventorycost for add mode
    setShowModal(true);
  };

  const handleDelete = (inventorycostId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteInventoryCost(inventorycostId, dispatch);
        Swal.fire("Deleted!", "Inventory cost has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelectedinventorycost(null);
    dispatch(fetchInventoryCostList());
  };

  // Filtered inventory costs based on search query
  const filteredInventoryCosts = inventorycosts?.filter((inventorycost) =>
    Object.values(inventorycost).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredInventoryCosts?.length / inventoryCostsPerPage);
  const indexOfLast = page * inventoryCostsPerPage;
  const indexOfFirst = indexOfLast - inventoryCostsPerPage;
  const currentInventoryCosts = filteredInventoryCosts?.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h5>Inventory Cost Details</h5>
         {(roleId !== "2" && roleId !== "3") && (

        <button onClick={handleAddinventorycost}>+ Add Inventory Cost</button>
         )}
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1); // Reset to first page on search query change
        }}
        style={{
          padding: "0.5rem 1rem",
          marginBottom: "1rem",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />

      {/* Inventory cost list table */}
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Cost</th>
             {(roleId !== "2" && roleId !== "3") && (
  <th>Actions</th>
)}

          </tr>
        </thead>
        <tbody>
          {currentInventoryCosts?.length > 0 ? (
            currentInventoryCosts.map((inventorycost,index) => (
              <tr key={inventorycost.id}>
                <td data-label="Id">{index+1}</td>
                <td data-label="ItemName">{inventorycost.itemName}</td>
                <td data-label="Cost">{inventorycost.cost}</td>
{(roleId !== "2" && roleId !== "3") && (
                <td  data-label="Actions"className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(inventorycost)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(inventorycost.id)}>
                    Delete
                  </button>
                </td>
                 )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No inventory costs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>&lt;</button>
            <span>Page <strong>{page}</strong> of {totalPages}</span>
            <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&raquo;</button>
          </div>
        </div>
      )}

      <AddInventoryCostModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        inventorycost={selectedinventorycost}
      />
    </div>
  );
};

export default InventoryCost;
