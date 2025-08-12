import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoleList, deleteRole } from "../../app/redux/slice/role/roleSlice";
import AddroleModal from "../../pages/role/addrole";
import Swal from "sweetalert2";

const RoleList = () => {
  const dispatch = useDispatch();
  const { data: roles, loading } = useSelector((state) => state.roleList);
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rolesPerPage = 5;

  useEffect(() => {
    dispatch(fetchRoleList());
  }, [dispatch]);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowModal(true);
  };

  const handleDelete = (roleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteRole(roleId, dispatch);
        Swal.fire("Deleted!", "Role has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelectedRole(null);
    dispatch(fetchRoleList());
  };

  const filteredRoles = roles?.filter((role) =>
    Object.values(role).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRoles?.length / rolesPerPage);
  const indexOfLast = page * rolesPerPage;
  const indexOfFirst = indexOfLast - rolesPerPage;
  const currentRoles = filteredRoles?.slice(indexOfFirst, indexOfLast);

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
          <h4>Role Details</h4>
{(roleId !== "2" && roleId !== "3") && (
          <button onClick={handleAddRole}>+ Add Role</button>
              )}
        </div>

        {/* Updated search bar */}
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

        <table className="list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
                  {(roleId !== "2" && roleId !== "3") && (
  <th>Actions</th>
)}

            </tr>
          </thead>
          <tbody>
            {currentRoles?.length > 0 ? (
              currentRoles.map((role,index) => (
                <tr key={role.id}>
                  <td data-label="Id">{index + 1}</td>
                  <td data-label="Name">{role.role}</td>
{(roleId !== "2" && roleId !== "3") && (
                  <td data-label="Actions" className="action-buttons">
                    <button onClick={() => handleEdit(role)} className="btn-edit">Edit</button>
                    {/* <button onClick={() => handleDelete(role.id)} className="btn-delete">Delete</button> */}
                  </td>
                      )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                  No roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Updated pagination */}
        {/*{totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>&lt;</button>
              <span>Page <strong>{page}</strong> of {totalPages}</span>
              <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>&gt;</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&raquo;</button>
            </div>
          </div>
        )}*/}
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

      <AddroleModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        role={selectedRole}
      />
    </>
  );
};

export default RoleList;
