import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { routePath as RP } from "./../../routes/routepath";

import { useNavigate } from "react-router-dom"; // ✅ Import
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // ✅ Hook
const roleId = localStorage.getItem("roleid");
  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Optional: close the sidebar after navigating
  };

  return (
    <>
<SidebarOverlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <FaTimes onClick={onClose} />
        </SidebarHeader>
        <NavList>
   {/* Always show Dashboard */}
    <li onClick={() => handleNavigation(RP.dashboard)}>Dashboard</li>
     <li onClick={() => handleNavigation("/main/tableView")}>Table View</li>

    {/* Show all items only if roleId is not "2" */}
    {roleId !== "2" && (
      <>
        <li onClick={() => handleNavigation("/main/myprofile")}>My Profile</li>
        <li onClick={() => handleNavigation("/main/resetpassword")}>Reset Password</li>
        <li onClick={() => handleNavigation("/main/user")}>User</li>
        <li onClick={() => handleNavigation("/main/role")}>Role</li>
        <li onClick={() => handleNavigation("/main/table")}>Table Type</li>
        <li onClick={() => handleNavigation("/main/tabledetail")}>Table</li>
        <li onClick={() => handleNavigation("/main/discount")}>Discount</li>
        <li onClick={() => handleNavigation("/main/inventory")}>Inventory</li>
        <li onClick={() => handleNavigation("/main/inventorycost")}>Inventory Cost</li>
        <li onClick={() => handleNavigation("/main/report")}>Report</li>
      </>
    )}

    {/* Always show Table View */}
   

  
  
</NavList>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
const SidebarOverlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 998;
`;

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-260px")};
  height: 100vh;
  width: 260px;
  background-color: rgb(9, 8, 8);
  color: white;
  padding: 20px;
  transition: left 0.3s ease-in-out;
  z-index: 999;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 1.5rem;
  cursor: pointer;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 20px 0;
  margin: 0;

  li {
    padding: 12px 0;
    border-bottom: 1px solid #333;
    cursor: pointer;

    &:hover {
      color: #d32f2f;
    }
  }
`;