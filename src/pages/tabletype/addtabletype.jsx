// components/TableType/AddTableTypeModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewTableType, updateTableType } from "../../app/redux/slice/tabletype/tabletypeSlice";
import Swal from "sweetalert2";

const AddTabModal = ({ show, handleClose, onSubmit, table }) => {
  const dispatch = useDispatch();
   const resetForm = () => {
  setForm({
     name: "",
     createdBy: localStorage.getItem("username") || "",
   
  });
};
const handleModalClose = () => {
  resetForm(); 
  handleClose(); 
};

  const [form, setForm] = useState({
    name : "",
    createdBy: "",
    
  });

  
  useEffect(() => {
    if (table) {
      setForm({
        id: table.id || 0,
        name: table.name || "",
        createdBy: table.createdBy || "",
        
      });
    } else {
      setForm({
        id: 0,
        name: "",
        createdBy: localStorage.getItem("username") || "",
       
        
      });
    }
  }, [table]);
  
  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Simple form validation
    if (
      
      !form.name ||!form.createdBy
      
      
    ) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }
  
    try {
     // console.log("Submitting table form:", form);
  
      if (table) {
        await updateTableType({ ...form, _id: table._id }, dispatch);
      } else {
        await addNewTableType(form, dispatch);
      }
  
      onSubmit();
      handleClose();
    } catch (err) {
      console.error("Error in submit:", err?.message || err);
      console.log("Full error object:", err);
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
        <Modal.Title>{table ? "Edit Table Type" : "Add New Table Type"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <label>
          Table Type<span style={{ color: 'red' }}>*</span>
         </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            maxLength={150}
          />
        </div>
       
       
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {table ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTabModal;
