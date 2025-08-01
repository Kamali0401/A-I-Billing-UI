import React from "react";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";

const RestaurantProfileForm = ({ data, onEdit }) => {
  const {
    restaurantName,
    email,
    phone,
    address,
    city,
    state,
    country,
    zipCode,
    gstNo,
    cgst,
    sgst,
    
  } = data;
const roleId = localStorage.getItem("roleid");
  return (
    <CardContainer className="card shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-item-baseline">
          <div>
          <h4 className="card-title section-title">Restaurant Profile</h4>

          <p
  style={{
    fontSize: "1.1rem",
    fontWeight: "500",
    marginTop: "0rem",
    marginBottom: "1.5rem",
    color: "#495057",
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
  }}
>
  Welcome <strong>{restaurantName}</strong>, here is the restaurant profile information.
</p>


          </div>
           {roleId !== "5" && (
          <div>
            <button className="btn btn-dark text-white" onClick={() => onEdit(data)}>
              <FaEdit color="#fff" size={14} /> Edit
            </button>
          </div>
           )}
        </div>
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <tbody>
              <tr>
                <th scope="row">Restaurant Name:</th>
                <td>{restaurantName || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Email:</th>
                <td>{email || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Phone:</th>
                <td>{phone || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Address:</th>
                <td>{address || "-"}</td>
              </tr>
              <tr>
                <th scope="row">City:</th>
                <td>{city || "-"}</td>
              </tr>
              <tr>
                <th scope="row">State:</th>
                <td>{state || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Country:</th>
                <td>{country || "-"}</td>
              </tr>
              <tr>
                <th scope="row">Zip Code:</th>
                <td>{zipCode || "-"}</td>
              </tr>
              <tr>
                <th scope="row">GSTNo:</th>
                <td>{gstNo || "-"}</td>
              </tr>
              <tr>
                <th scope="row">CGST%:</th>
                <td>{cgst || "-"}</td>
              </tr>
              <tr>
                <th scope="row">SGST%:</th>
                <td>{sgst || "-"}</td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>
    </CardContainer>
  );
};

export default RestaurantProfileForm;

const CardContainer = styled.div`
  font-family: "GT-Walsheim" !important;
  p,
  th,
  td {
    font-family: "GT-Walsheim" !important;
  }
    .section-title {
  font-weight: 500;
  font-size: 2rem;
  color:rgb(236, 137, 25);
  padding-bottom: 0.1rem;
  margin-bottom: 0.1rem;
}
.d-flex {
  display: flex;
}  
.justify-content-between {
  justify-content: space-between;
}

.align-items-center {
  align-items: center;
}
`;
