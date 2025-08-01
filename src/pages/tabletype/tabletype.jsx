import React, { useEffect, useState } from "react";
import "../../pages/styles/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchTableTypeList, deleteTableType } from "../../app/redux/slice/tabletype/tabletypeSlice";
import AddtabModal from "./addtabletype";
import Swal from "sweetalert2";

const TableType = () => {
  const dispatch = useDispatch();
  const { data: tables, loading } = useSelector((state) => state.tableList);
const roleId = localStorage.getItem("roleid");
  const [showModal, setShowModal] = useState(false);
  const [selectedtable, setSelectedtable] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const tablesPerPage = 5;

  useEffect(() => {
    dispatch(fetchTableTypeList());
  }, [dispatch]);

  const handleEdit = (table) => {
    setSelectedtable(table);
    setShowModal(true);
  };

  const handleAddtable = () => {
    setSelectedtable(null);
    setShowModal(true);
  };

  const handleDelete = (tableId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteTableType(tableId, dispatch);
        Swal.fire("Deleted!", "Table type has been deleted.", "success");
      }
    });
  };

  const handleModalSubmit = async () => {
    setShowModal(false);
    setSelectedtable(null);
    dispatch(fetchTableTypeList());
  };

  const filteredTables = tables?.filter((table) =>
    Object.values(table).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredTables?.length / tablesPerPage);
  const indexOfLast = page * tablesPerPage;
  const indexOfFirst = indexOfLast - tablesPerPage;
  const currentTables = filteredTables?.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <div className="list-container table-list">
        <div className="list-header">
          <h4>Table Type</h4>
           {roleId !== "5" && (
           
          <button onClick={handleAddtable}>+ Add Table Type</button>
           )}
        </div>

        {/* Search bar */}
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
              <th>Table Type</th>
               {roleId !== "5" && (
              <th>Actions</th>
               )}
            </tr>
          </thead>
          <tbody>
            {currentTables?.length > 0 ? (
              currentTables.map((table,index) => (
                <tr key={table.id}>
                  <td data-label="Id">{index + 1}</td>
                  <td data-label="Name">{table.name}</td>
                   {roleId !== "5" && (
                  <td data-label="Actions" className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(table)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(table.id)}>Delete</button>
                  </td>
                   )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "1rem" }}>
                  No table types found.
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

      <AddtabModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        table={selectedtable}
      />
    </>
  );
};

export default TableType;
