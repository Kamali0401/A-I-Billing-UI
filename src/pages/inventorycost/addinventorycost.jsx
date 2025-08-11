import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewInventoryCost, updateInventoryCost } from "../../app/redux/slice/inventoryCost/inventoryCostSlice";
import Swal from "sweetalert2";
import { fetchInventoryListReq } from "../../api/inventoryApi/inventoryReq";
import { fetchInventoryCostListReq } from "../../api/inventoryCostApi/inventoryCostReq";

const AddInventoryCostModal = ({ show, handleClose, onSubmit, inventorycost }) => {
  const dispatch = useDispatch();
  const username = localStorage.getItem("username") || "";
const resetForm = () => {
  setForm({
      id: 0,
    itemId: 0,
    cost: "",
    createdBy: "",
  });
};
const handleModalClose = () => {
  resetForm(); 
  handleClose(); 
};
  const [form, setForm] = useState({
    id: 0,
    itemId: 0,
    cost: "",
    createdBy: "",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items that don't already have a cost
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [inventoryResponse, costResponse] = await Promise.all([
          fetchInventoryListReq(),
          fetchInventoryCostListReq(),
        ]);
  
        const allItems = inventoryResponse.data;
        const allCosts = costResponse.data;
  
        const itemsWithCost = new Set(allCosts.map((c) => c.itemId));
        const itemsWithoutCost = allItems.filter((item) => !itemsWithCost.has(item.id));
  
        setItems(itemsWithoutCost);
      } catch (err) {
        setError("Error fetching items or costs.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchItems();
  }, []);
  
  // Set form for edit/create
  useEffect(() => {
    if (inventorycost) {
      setForm({
        id: inventorycost.id || 0,
        itemId: inventorycost.itemId || 0,
        cost: inventorycost.cost || "",
        createdBy: inventorycost.createdBy || username,
      });
    } else {
      setForm({
        id: 0,
        itemId: 0,
        cost: "",
        createdBy: username,
      });
    }
  }, [inventorycost, username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setForm((prev) => ({
      ...prev,
      [name]: name === "itemId" ? Number(value) : value,
    }));
  };
  

  const handleSubmit = async () => {
    const { itemId, cost, createdBy } = form;
  
    if (!itemId || !cost || !createdBy) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }
  
    try {
      const payload = {
        id: form.id, 
        itemId: parseInt(form.itemId),
        cost: parseFloat(form.cost),
        createdBy: username,
      };
  
     // console.log("Payload to submit:", payload);
  
      const result = inventorycost
        ? await updateInventoryCost(payload, dispatch) 
        : await addNewInventoryCost(payload, dispatch); 
  
      if (result?.error) {
        console.error("Backend responded with error:", result);
        throw new Error(result.errorMsg || "Submission failed");
      }
  
      onSubmit();
      handleClose();
    } catch (err) {
      console.error("Error in submit:\n", err);
      Swal.fire({
        title: "Submission Failed",
        text: err?.message || "Something went wrong",
        icon: "error",
      });
    }
  };
  
  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{inventorycost ? "Edit Inventory Cost" : "Add New Inventory Cost"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : (
          <>
            <div className="mb-2">
  <label>Item Name</label>
  {inventorycost ? (
    <input
      type="text"
      className="form-control"
      value={inventorycost.itemName || ""}
      readOnly
    />
  ) : (
    <select
      className="form-control"
      name="itemId"
      value={form.itemId}
      onChange={handleChange}
    >
      <option value="">Select an item</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.itemName}
        </option>
      ))}
    </select>
  )}
</div>

            <div className="mb-2">
              <label>Cost</label>
              <input
                type="number"
                className="form-control"
                name="cost"
                value={form.cost}
                onChange={handleChange}
              />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {inventorycost ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddInventoryCostModal;
