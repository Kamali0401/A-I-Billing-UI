import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewRole, updateRole } from "../../app/redux/slice/role/roleSlice";
import Swal from "sweetalert2";

const AddRoleModal = ({ show, handleClose, onSubmit, role }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    role: "",
    createdBy: "",
  });

  
  useEffect(() => {
    if (role) {
      setForm({
        id: role.id || 0,
        role: role.role || "",
        createdBy: role.createdBy || "",
      });
    } else {
      setForm({
        id: 0,
        role: "",
        createdBy: localStorage.getItem("username") || "",
      });
    }
  }, [role]);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form validation
  const handleSubmit = async () => {
  
    if (!form.role || !form.createdBy) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }

    try {
      //console.log("Submitting role form:", form);

      if (role) {
        // Updating an existing role
        await updateRole({ ...form, _id: role._id }, dispatch);
      } else {
        // Adding a new role
        await addNewRole(form, dispatch);
      }

      onSubmit();
      handleClose();
    } catch (err) {
        console.error("Error in submit:", err);
        console.error("Error message:", err?.errorMsg || err?.message || "No error message");
        console.error("Full response:", err?.response?.data || "No response data");
        
      console.log("Full error object:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      Swal.fire({
        title: "Submission Failed",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong",
        icon: "error",
      });
      
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{role ? "Edit Role" : "Add New Role"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <label>Role Name</label>
          <input
            type="text"
            className="form-control"
            name="role"
            value={form.role}
            onChange={handleChange}
            maxLength={25}
            required
          />
        </div>
        {/* Optionally, you could display 'createdBy' or make it editable */}
        {/* <div className="mb-2">
          <label>Created By</label>
          <input
            type="text"
            className="form-control"
            name="createdBy"
            value={form.createdBy}
            onChange={handleChange}
            maxLength={25}
            required
          />
        </div> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {role ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRoleModal;
