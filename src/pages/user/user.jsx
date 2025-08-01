import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList, deleteUser } from "../../app/redux/slice/user/userSlice";
import AddUserModal from "./../../pages/user/adduser";
import Swal from "sweetalert2";

const UserList = () => {
  const dispatch = useDispatch();
  const { data: users, loading } = useSelector((state) => state.userList);
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // <-- Search input

  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchUserList());
  }, [dispatch]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(userId, dispatch);
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelectedUser(null);
    dispatch(fetchUserList());
  };

  // Global search filter
  const filteredUsers = users?.filter((user) =>
    Object.values(user).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);
  const startIndex = (page - 1) * usersPerPage;
  const paginatedUsers = filteredUsers?.slice(startIndex, startIndex + usersPerPage);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <div className="list-container user-list">
   
  <div className="list-header">
    <h4>User Details</h4>
     {roleId !== "5" && (
    <button onClick={handleAddUser}>+ Add User</button>
     )}
  </div>

  {/* 🔍 Search box */}
  <div className="list-search">
    <input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setPage(1);
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
  </div>

  <table className="list-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Locality</th>
        <th>Role</th>
         {roleId !== "5" && (
        <th>Actions</th>
         )}
      </tr>
    </thead>
    <tbody>
      {paginatedUsers?.map((user,index) => (
        <tr key={user.id}>
          <td data-label="Id">{index + 1}</td>
          <td data-label="Name">{user.name}</td>
          <td data-label="Locality">{user.locality}</td>
          <td data-label="Role">{user.role}</td>
           {roleId !== "5" && (
          <td data-label="Actions" className="action-buttons">
            <button className="btn-edit" onClick={() => handleEdit(user)}>Edit</button>
            <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
          </td>)}
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination */}
  {/* Pagination */}
<div className="pagination-container">
  <div className="pagination">
    <button onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>&lt;</button>
    <span>Page <strong>{page}</strong> of {totalPages}</span>
    <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&raquo;</button>
  </div>
</div>

</div>


      <AddUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        user={selectedUser}
      />
    </>
  );
};

export default UserList;
