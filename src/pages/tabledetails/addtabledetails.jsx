// components/AddTableModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ApiKey } from "../../api/endpoints";
import { publicAxios } from "../../api/config";
import { addNewTableDetails } from "../../app/redux/slice/tabledetails/tabledetailSlice";
const AddTableModal = ({ show, handleClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [tableOptions, setTableOptions] = useState([]);
  const dispatch = useDispatch();
  const closeAndReset = () => {
    reset(); // Clear form
    handleClose(); // Close modal
  };
  const submitHandler = async (data) => {
    try {
      debugger;
      const userName = localStorage.getItem("username");
      const payload = {
        tableId: parseInt(data.table), // static or generate dynamically if needed
        tableCode: data.tableCode,
        noofSeats:data.noofSeats,
        createdBy: userName,
      };
      const response = await addNewTableDetails(payload, dispatch);
      //publicAxios.post(ApiKey.TableDetails, payload);
      Swal.fire({
        title: "Awesome!",
        text: `New Table Added`,
        icon: "success",
      });

      onSubmit(response);
      reset();
      handleClose();
    } catch (error) {
      console.error("Error inserting table:", error);
      // Optionally show an error toast/message here
    }
  };
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await publicAxios.get(ApiKey.Table); // Assuming TableDetails contains section info
        setTableOptions(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchTables();
  }, []);
  return (
    <Modal show={show} onHide={closeAndReset} centered>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
            Table Type<span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Select
              {...register("table", { required: "Table name is required" })}
            >
              <option value="">Select table type</option>
              {tableOptions.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </Form.Select>
            {errors.table && (
              <p className="text-danger">{errors.table.message}</p>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
            Table Code<span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter table code"
              maxLength={50}
              {...register("tableCode", {
                required: "Table code is required",
                maxLength: {
                  value: 50,
                  message: "Table code must be at most 50 characters",
                },
              })}
            />
            {errors.tableCode && (
              <p className="text-danger">{errors.tableCode.message}</p>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
            No of Seats<span style={{ color: 'red' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter No of seats"
              maxLength={4}
              {...register("noofSeats", {
                required: "No of Seats is required",
                maxLength: {
                  value: 4,
                 // message: "Table code must be at most 50 characters",
                },
              })}
            />
            {errors.noofSeats && (
              <p className="text-danger">{errors.noofSeats.message}</p>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAndReset}>
            Cancel
          </Button>
          <Button variant="danger" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTableModal;
