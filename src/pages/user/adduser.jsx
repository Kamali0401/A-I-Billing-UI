// components/User/AddUserModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewUser, updateUser } from "../../app/redux/slice/user/userSlice";
import Swal from "sweetalert2";
import { fetchRoleReq, fetchRoleListReq } from "../../api/roleApi/role";

const AddUserModal = ({ show, handleClose, onSubmit, user }) => {
  const dispatch = useDispatch();
  const [RoleList, setRoleList] = useState([]);
  // const roleId = (e) => {
  //   const selectedValue = e.target.value;
  //   setForm((prevForm) => ({ ...prevForm, RoleId: selectedValue }));
  // };
  
  const resetForm = () => {
  setForm({
    
    name: "",
    RoleId: 0,
    phoneNo: "",
    address: "",
    locality: "",
    info: "",
    userName: "",
    password: "",
    createdBy: localStorage.getItem("username") || "",
  });
};
const handleModalClose = () => {
  resetForm(); 
  handleClose(); 
};
  useEffect(() => {
    debugger;
    fetchRoleReq() 
      .then((res) => {
        if (!res.error) {
          setRoleList(res.data); // Set role list if no error
       //   console.log(res.data, "role");
        } else {
          console.log("Error fetching roles:", res.errorMsg);
        }
      })
      .catch((err) => {
        console.log(err); // Log any errors that occur
      });
  }, []);
  

  const [form, setForm] = useState({
    name: "",
    RoleId: 0,
    phoneNo: "",
    address: "",
    locality: "",
    info: "",
    userName: "",
    password: "",
    createdBy:localStorage.getItem("username") || "",
    
  });

  
 useEffect(() => {
  if (show) {
    if (user) {
      setForm({
        id: user.id || 0,
        name: user.name || "",
        RoleId: user.roleId || 0,
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        locality: user.locality || "",
        info: user.info || "",
        userName: user.userName || "",
        password: user.password || "",
        createdBy: user.createdBy || "",
      });
    } else {
      resetForm();
    }
  }
}, [user, show]);
    

  const handleChange = (e) => {
    debugger;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    debugger;
    // Simple form validation
    if (
      
      !form.name ||
      !form.RoleId||
      !form.phoneNo ||
      !form.userName ||
      !form.password
      
    ) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }
  
    try {
   //   console.log("Submitting user form:", form);
  
      if (user) {
        await updateUser({ ...form, _id: user._id }, dispatch);
      } else {
        await addNewUser(form, dispatch);
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
        <Modal.Title>{user ? "Edit User" : "Add New User"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2">
          <label>
          Name<span style={{ color: 'red' }}>*</span>
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
       
       
        <div className="mb-2">
  <label>
  Role<span style={{ color: 'red' }}>*</span>
  </label>
  {user ? (
    // 🔒 In edit mode — show role as readonly
    <input
      type="text"
      className="form-control"
      value={
        RoleList.find((r) => r.id === form.RoleId)?.role || "Unknown"
      }
      readOnly
    />
  ) : (
    // ✅ In add mode — allow role selection
    <select
      className="form-select form-control"
      onChange={handleChange}
      aria-label="Select role"
      value={form.RoleId}
      name="RoleId"
    >
      <option value="">--Select Role--</option>
      {RoleList?.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.role}
        </option>
      ))}
    </select>
  )}
</div>

        
        <div className="mb-2">
          <label>
          Phone Number<span style={{ color: 'red' }}>*</span>
        </label>
          <input
            type="text"
            className="form-control"
            name="phoneNo"
            value={form.phoneNo}
            onChange={handleChange}
            maxLength={10}
          />
        </div>
        

        <div className="mb-2">
          <label>Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={form.address}
            onChange={handleChange}
            maxLength={2000}
          />
        </div>
        <div className="mb-2">
          <label>Locality</label>
          <input
            type="text"
            className="form-control"
            name="locality"
            value={form.locality}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Info</label>
          <input
            type="text"
            className="form-control"
            name="info"
            value={form.info}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>
          Username<span style={{ color: 'red' }}>*</span>
        </label>
          <input
            type="text"
            autoComplete="off"
            className="form-control"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            maxLength={250}
          />
        </div>
        <div className="mb-2">
          <label>
          Password<span style={{ color: 'red' }}>*</span>
        </label>
          <input
            type="password"
            autoComplete="new-password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            maxLength={250}
            readOnly={!!user}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {user ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
