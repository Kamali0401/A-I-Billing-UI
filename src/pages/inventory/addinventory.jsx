import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewInventory, updateInventory } from "../../app/redux/slice/inventory/inventorySlice";
import Swal from "sweetalert2";

const AddInventoryModal = ({ show, handleClose, onSubmit, inventory }) => {
  const dispatch = useDispatch();
  const username = localStorage.getItem("username") || "";

  const [form, setForm] = useState({
    itemCode: "",
    category: "",
    subCategory: "",
    itemName: "",
    isVeg: false,
    description: "",
    createdBy: "",
  });

  useEffect(() => {
    if (inventory) {
      setForm({
        id: inventory.id || 0,
        itemCode: inventory.itemCode || "",
        category: inventory.category || "",
        subCategory: inventory.subCategory || "",
        itemName: inventory.itemName || "",
        isVeg: inventory.isVeg || false,
        description: inventory.description || "",
        createdBy: inventory.createdBy || username,
      });
    } else {
      setForm({
        id: 0,
        itemCode: "",
        category: "",
        subCategory: "",
        itemName: "",
        isVeg: false,
        description: "",
        createdBy: username,
      });
    }
  }, [inventory, username]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const { itemCode, category, subCategory, itemName, description, createdBy } = form;

    if ( !category || !subCategory || !itemName || !createdBy) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }

    try {
      const parameters = {
       // itemCode: form.itemCode,
        category: form.category,
        subCategory: form.subCategory,
        itemName: form.itemName,
        description: form.description,
        isVeg: form.isVeg,
        ...(inventory ? { modifiedBy: username } : { createdBy: username }),
      };

      if (inventory) {
        // Update inventory
        await updateInventory({ ...parameters, id: inventory.id ,itemCode:inventory.itemCode}, dispatch);
      } else {
        // Add new inventory
        await addNewInventory(parameters, dispatch);
      }

      onSubmit(); // This will trigger the parent component to refresh the list or take other actions
      handleClose(); // Close the modal
    } catch (err) {
      console.error("Error in submit:", err?.message || err);
      Swal.fire({
        title: "Submission Failed",
        text: err?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{inventory ? "Edit Inventory" : "Add New Inventory"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <label>Item Code</label>
          <input
            type="text"
            className="form-control"
            name="itemCode"
            value={form.itemCode}
            placeholder="Non editable"
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="mb-2">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Sub Category</label>
          <input
            type="text"
            className="form-control"
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Item Name</label>
          <input
            type="text"
            className="form-control"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input me-2"
              name="isVeg"
              checked={form.isVeg}
              onChange={handleChange}
            />
            Is Veg
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {inventory ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddInventoryModal;
