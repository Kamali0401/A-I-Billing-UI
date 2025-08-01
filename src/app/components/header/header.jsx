import React, { useState } from "react";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPhoneAlt, FaHome, FaStore, FaBell, FaQuestionCircle, FaPowerOff, FaBars } from "react-icons/fa";
import { clearUserAction } from "../../redux/slice/auth/authslice";
import { routePath } from "../../routes/routepath";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/navigation/navigation"; // Make sure this path is correct

const Header = () => {
  const [showUserOpts, setShowUserOpts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useNavigate();
  const dispatch = useDispatch();
const restaurantdata = JSON.parse(localStorage.getItem("restaurantData"));
  const onLogout = () => {
    clearUserAction(dispatch);
    localStorage.removeItem("tokenExpire");
    localStorage.removeItem("token");
    navigation(routePath.login, { state: { navigatedFrom: "logout" } });
    setShowUserOpts(false);
  };

  return (
    <>
      <HeaderBlock>
        {/* Desktop View */}
        <div className="web_view">
          <LeftSection>
            <FaBars
              style={{ fontSize: "22px", marginRight: "8px", marginTop: "10px" }}
              onClick={() => setSidebarOpen(true)}
            />
            <Logo>{restaurantdata[0]?.restaurantName || "Avinya & Indus Spices"}</Logo>
            {/* <NewOrderButton>New Order</NewOrderButton>
            <SearchBar placeholder="Bill No" /> */}
          </LeftSection>

          <RightSection>
            <Support>
              <FaPhoneAlt />
              <span style={{ color: "white" }}>Call For Support</span>
              <span style={{ color: "white" }} className="number">{restaurantdata[0]?.phone || ""}</span>
            </Support>
            <IconGroup>
              <Icon><FaHome /></Icon>
              <Icon><FaStore /></Icon>
              <Icon><FaBell /></Icon>
              <Icon><FaQuestionCircle /></Icon>
              <Icon onClick={onLogout}><FaPowerOff /></Icon>
            </IconGroup>
          </RightSection>
        </div>

        {/* Mobile View */}
        <div className="mob_view" style={{backgroundColor:"#F7920E"}}>
          
          <div className="div2 p-2  d-flex align-items-center justify-center" >
            <button
              type="button"
              className="outline-none border border-0 bg-white"
              onClick={() => setSidebarOpen(true)}
            >
              <GiHamburgerMenu size={"1.5rem"} color="gray" />
            </button>
           
          </div>
          <Logo>{restaurantdata[0]?.restaurantName || "Avinya & Indus Spices"}</Logo>
          <RightSection style={{top:5}}>
          <IconGroup>
            
              <Icon onClick={onLogout}><FaPowerOff /></Icon>
            </IconGroup>
            </RightSection>
        </div>

      </HeaderBlock>

      {/* Sidebar integration */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;

// ===================== Styled Components =====================

const HeaderBlock = styled.div`
  .web_view {
    background-color: #F7920E;
    padding: 20px;
    color: white;
    display: flex;
  }

  .mob_view {
    display: none;
  }

  @media (max-width: 770px) {
    .web_view {
      display: none;
    }
    .mob_view {
      display: flex;
    }
  }

  .div6 .profile_icon {
    width: 2rem;
    height: 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const NewOrderButton = styled.button`
  background-color: #d32f2f;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #b71c1c;
  }
`;

const SearchBar = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  font-size: 1rem;

  &:focus {
    border-color: #aaa;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: absolute;
  top: 25px;
  right: 15px;
`;

const Support = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #333;

  .number {
    font-weight: bold;
  }

  svg {
    color: #d32f2f;
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  justify-content: flex-end;
`;

const Icon = styled.div`
  font-size: 1.2rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: #d32f2f;
  }
`;
