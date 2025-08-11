import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";  // Import useDispatch hook
import { updateProfile } from "../../app/redux/slice/profile/profileSlice";

const RestaurantProfileModal = ({ isOpen, onClose, data, onSave }) => {
  const [formState, setFormState] = useState({});
  const dispatch = useDispatch(); // Get dispatch function from useDispatch

  useEffect(() => {
    if (data) {
      setFormState(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleUpdate = (formState) => {
    debugger;
    dispatch(updateProfile(formState)); // Dispatch async action
  };

  const handleSubmit = (e) => {
    debugger;
    e.preventDefault();
    onSave(formState); // Call the onSave callback passed as prop
    handleUpdate(formState); // Dispatch the updateProfile action
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Restaurant Profile</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {[
            
            "restaurantName",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "country",
            "zipCode",
            "gstNo",
            "cgst",
            "sgst",
            "fssaiLicNo"
          ].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field}</Form.Label>
              <Form.Control
                type={field === "cgst" || field === "sgst" ? "number" : "text"}
                name={field}
                value={formState[field] || ""}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RestaurantProfileModal;
