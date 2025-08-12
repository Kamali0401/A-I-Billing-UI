import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchDiscountList, deleteDiscount } from "../../app/redux/slice/discount/discountSlice";
import AddDiscountTypeModal from "../discount/adddiscount";
import Swal from "sweetalert2";
import dayjs from 'dayjs';
const DiscountList = () => {
  const dispatch = useDispatch();
  const { data: discounts, loading } = useSelector((state) => state.discountList);
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selecteddiscount, setSelecteddiscount] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const discountsPerPage = 5;

  useEffect(() => {
    dispatch(fetchDiscountList());
  }, [dispatch]);

  const handleEdit = (discount) => {
    setSelecteddiscount(discount);
    setShowModal(true);
  };

  const handleAdddiscount = () => {
    setSelecteddiscount(null);
    setShowModal(true);
  };

  const handleDelete = (discountId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteDiscount(discountId, dispatch);
        Swal.fire("Deleted!", "Discount has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelecteddiscount(null);
    dispatch(fetchDiscountList());
  };

  // Filtered discounts based on search query
  const filteredDiscounts = discounts?.filter((discount) =>
    Object.values(discount).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredDiscounts?.length / discountsPerPage);
  const indexOfLast = page * discountsPerPage;
  const indexOfFirst = indexOfLast - discountsPerPage;
  const currentDiscounts = filteredDiscounts?.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <div className="list-container">
        <div className="list-header">
          <h4>Discount</h4>
{(roleId !== "2" && roleId !== "3") && (
  <button onClick={handleAdddiscount}>+ Add Discount</button>
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

        {/* Discount list table */}
        <table className="list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Discount Code</th>
              <th>Discount Type</th>
              <th>Amount/Percentage</th>
               <th>Valid UpTo</th>
                {(roleId !== "2" && roleId !== "3") && (
  <th>Actions</th>
)}

            </tr>
          </thead>
          <tbody>
            {currentDiscounts?.length > 0 ? (
              currentDiscounts.map((discount,index) => (
                <tr key={discount.id}>
                  <td data-label="Id">{index+1}</td>
                  <td data-label="Discount Code">{discount.discountCode}</td>
                  <td data-label="Discount Count" >{discount.discountType}</td>
                  <td data-label="Amount/Percentage">{discount.percentage}</td>
                 <td data-label="Valid Up To">
              {dayjs(discount.validUpto).format("YYYY-MM-DD")}
            </td>
             {(roleId !== "2" && roleId !== "3") && (

                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(discount)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(discount.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
             )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                  No discounts found.
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
      </div>

      <AddDiscountTypeModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        discount={selecteddiscount}
      />
    </>
  );
};

export default DiscountList;
