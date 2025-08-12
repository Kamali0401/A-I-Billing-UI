// components/Discount/AddDiscountModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { addNewDiscount, updateDiscount } from "../../app/redux/slice/discount/discountSlice";
import Swal from "sweetalert2";
import dayjs from 'dayjs';

const AddDiscountModal = ({ show, handleClose, onSubmit, discount }) => {
  const dispatch = useDispatch();
  const username = localStorage.getItem("username") || "";
const maxDate = dayjs().format('YYYY-MM-DD');
const resetForm = () => {
  setForm({
     validUpto:"",
    discountCode: "",
    percentage: "",
    discountType: "",
    createdBy: "",
  });
};
const handleModalClose = () => {
  resetForm(); 
  handleClose(); 
};
  const [form, setForm] = useState({
    validUpto:"",
    discountCode: "",
    percentage: "",
    discountType: "",
    createdBy: "",
  });

  useEffect(() => {
    if (discount) {
      setForm({
        id: discount.id || 0,
        validUpto:discount.validUpto ||"",
        discountCode: discount.discountCode || "",
        percentage: discount.percentage?.toString() || "", // keep as string, e.g. "10%" or "10"
        discountType: discount.discountType || "",
        createdBy: username,
      });
    } else {
      setForm({
        id: 0,
        validUpto:"",
        discountCode: "",
        percentage: "",
        discountType: "",
        createdBy: username,
      });
    }
  }, [discount, username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate percentage format: either a number or a number ending with '%'
  const isValidDiscount = (val) => {
    if (!val) return false;
    const trimmed = val.toString().trim();
    if (trimmed.endsWith("%")) {
      const num = parseFloat(trimmed.slice(0, -1));
      return !isNaN(num) && num >= 0;
    } else {
      const num = parseFloat(trimmed);
      return !isNaN(num) && num >= 0;
    }
  };

  const handleSubmit = async () => {
    const { discountCode, percentage, discountType,validUpto} = form;
    const trimmedPercentage = percentage.toString().trim();

    if (!discountCode || !percentage || !discountType || !validUpto || !isValidDiscount(percentage)) {
      Swal.fire({
        text: "Please fill in all required fields correctly.",
        icon: "error",
      });
      return;
    }

    // Send percentage as string exactly as input (e.g. "10%" or "10")
    const parameters = {
      validUpto,
      discountCode,
      percentage: trimmedPercentage,
      discountType,
      ...(discount ? { modifiedBy: username } : { createdBy: username }),
    };

    try {
      let res;
      if (discount) {
        res = await updateDiscount({ ...parameters, id: discount.id }, dispatch);
      } else {
        res = await addNewDiscount(parameters, dispatch);
      }

      // Check for API failure manually
      if (res?.error) {
        throw new Error(res?.errorMsg || res?.message || "Unknown error");
      }

      onSubmit();
      handleClose();
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
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{discount ? "Edit Discount" : "Add New Discount"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <div className="mb-2">
          <label>Valid UpTo</label>
          <input
            type="date"
            className="form-control"
            name="validUpto"
           // value={form.date}
            onChange={handleChange}
           value={dayjs(form.validUpto).format("YYYY-MM-DD")}
                  //max={Moment().subtract(15, "year").format("YYYY-MM-DD")}
                  min={dayjs().format("YYYY-MM-DD")}
          />
        </div>
        <div className="mb-2">
          <label>Discount Code</label>
          <input
            type="text"
            className="form-control"
            name="discountCode"
            value={form.discountCode}
            onChange={handleChange}
          />
        </div>

        <div className="mb-2">
          <label>Discount Type</label>
          <input
            type="text"
            className="form-control"
            name="discountType"
            value={form.discountType}
            onChange={handleChange}
           
          />
        </div>

        <div className="mb-2">
          <label>
            Discount Value{" "}
            <small className="text-muted">(e.g., "10%" for percent or "10" for fixed amount)</small>
          </label>
          <input
            type="text"
            className="form-control"
            name="percentage"
            value={form.percentage}
            onChange={handleChange}
            placeholder='e.g., "10%" or "10"'
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {discount ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDiscountModal;
