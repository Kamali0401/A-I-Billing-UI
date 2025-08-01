import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import {
  addNewTableDetails,
  updateTableDetails,
} from "../../app/redux/slice/tabledetails/tabledetailSlice";
import Swal from "sweetalert2";
import { fetchTableTypeListReq } from "../../api/tabletypeApi/tabletype";

// Custom Hook for Fetching Table Types
const useFetchTableTypes = () => {
  const [tableTypes, setTableTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTableTypes = async () => {
      try {
        const response = await fetchTableTypeListReq();
        if (response.error) {
          setError(response.errorMsg);
        } else {
          setTableTypes(response.data);
        }
      } catch (err) {
        setError("Error fetching table types");
      } finally {
        setLoading(false);
      }
    };

    fetchTableTypes();
  }, []);

  return { tableTypes, loading, error };
};

// Add Table Modal Component
const AddTableModal = ({ show, handleClose, onSubmit, table }) => {
  //console.log(table,"table");
  const dispatch = useDispatch();
  const { tableTypes, loading, error } = useFetchTableTypes();
  const username = localStorage.getItem("username") || "System";

  const [form, setForm] = useState({
    tableCode: "",
    noofSeats:"",
    tablename: "",
    createdBy: "",
  });

  useEffect(() => {
    if (table) {
      debugger;
      const matchedTableType = tableTypes.find(
      (type) => type.name === table.tablename
    );
      setForm({
        id: table.id || 0,
        noofSeats:table.noofSeats ||"",
        tableCode: table.tableCode || "",
        tablename: String(matchedTableType?.id || ""),
        createdBy: username,
      });
    } else {
      setForm({
        id: 0,
        noofSeats:"",
        tableCode: "",

        tablename: "",
        createdBy: username,
      });
    }
  }, [table, username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
   // console.log("Submitting form:", form);

    if (!form.tableCode || !form.noofSeats || !form.tablename || !form.createdBy) {
      Swal.fire({
        text: "Please fill in all required fields.",
        icon: "error",
      });
      return;
    }

    const tableId = parseInt(form.tablename, 10);
    if (isNaN(tableId)) {
      Swal.fire({ text: "Invalid Table Type selected.", icon: "error" });
      return;
    }

    const parameters = {
      tableCode: form.tableCode,
      noofSeats:form.noofSeats,
      tableId, 
      ...(table ? { modifiedBy: username } : { createdBy: username }),
    };

    //console.log("Payload being submitted:", parameters);

    try {
      if (table) {
        await updateTableDetails({ ...parameters, id: table.id }, dispatch);
      } else {
        await addNewTableDetails(parameters, dispatch);
      }

      onSubmit();
      handleClose();
    } catch (err) {
      console.error("Error in submit:", err);
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
        <Modal.Title>{table ? "Edit Table Details" : "Add New Table"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        

        <div className="mb-2">
          <label>Table Type</label>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
            <select
              className="form-select form-control"
              name="tablename"
              value={form.tablename}
              onChange={handleChange}
            >
              
              <option value="">--Select Table Type--</option>
              {tableTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-2">
          <label>Table Code</label>
          <input
            type="text"
            className="form-control"
            name="tableCode"
            value={form.tableCode}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>No of Seats</label>
          <input
            type="text"
            className="form-control"
            name="noofSeats"
            value={form.noofSeats}
            onChange={handleChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {table ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTableModal;
