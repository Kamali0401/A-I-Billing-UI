import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventoryList, deleteInventory } from "../../app/redux/slice/inventory/inventorySlice";
import AddInventoryModal from "../inventory/addinventory";
import Swal from "sweetalert2";

const Inventory = () => {
  const dispatch = useDispatch();

  const { data: Inventories = [], loading = false } = useSelector((state) => state.inventoryList || {});
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selectedinventory, setSelectedinventory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const inventoriesPerPage = 5;

  useEffect(() => {
    dispatch(fetchInventoryList());
  }, [dispatch]);

  const handleEdit = (inventory) => {
    setSelectedinventory(inventory);
    setShowModal(true);
  };

  const handleAddinventory = () => {
    setSelectedinventory(null);  // Clear any selected inventory for add mode
    setShowModal(true);
  };

  const handleDelete = (inventoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteInventory(inventoryId, dispatch);
        Swal.fire("Deleted!", "Inventory has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelectedinventory(null);
    dispatch(fetchInventoryList());
  };

  // Filtered inventories based on search query
  const filteredInventories = Inventories?.filter((inventory) =>
    Object.values(inventory).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredInventories?.length / inventoriesPerPage);
  const indexOfLast = page * inventoriesPerPage;
  const indexOfFirst = indexOfLast - inventoriesPerPage;
  const currentInventories = filteredInventories?.slice(indexOfFirst, indexOfLast);

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
        <h4>Inventory Details</h4>
{(roleId !== "2" && roleId !== "3") && (
        <button onClick={handleAddinventory}>+ Add Inventory</button>
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

      {/* Inventory list table */}
      <table className="list-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Sub-Category</th>
            <th>Item</th>
            <th>Veg/Non-Veg</th>
            {(roleId !== "2" && roleId !== "3") && (
  <th>Actions</th>
)}

          </tr>
        </thead>
        <tbody>
          {currentInventories?.length > 0 ? (
            currentInventories.map((inventory,index) => (
              <tr key={inventory.id}>
                <td data-label="Id">{index+1}</td>
                <td data-label="Category">{inventory.category}</td>
                <td data-label="Subcategory">{inventory.subCategory}</td>
                <td data-label="Item Name">{inventory.itemName}</td>
                <td data-label="Type" style={{ color: inventory.isVeg ? "green" : "red", fontWeight: "bold" }}>
                  {inventory.isVeg ? "Veg" : "Non-Veg"}
                </td>
{(roleId !== "2" && roleId !== "3") && (
                <td data-label="Actions" className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(inventory)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(inventory.id)}>
                    Delete
                  </button>
                </td>
                 )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                No inventories found.
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
      
      <AddInventoryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        inventory={selectedinventory}
      />
    </div>
  );
};

export default Inventory;
