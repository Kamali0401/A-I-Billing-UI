import React, { useEffect, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import styled from "styled-components";
//import SideNavBar from "../../app/components/SideNavbar/sideNavbar.jsx";
import Header from "../../app/components/header/header.jsx";
//import { roleNames } from "../../app/constants/roleNames.js";
//import Navigation from "../components/SideNavbar/sideNavbar.jsx";
import { routePath } from "../../app/routes/routepath";
//import { roleNames } from "../../constants/roleNames";

const RootLayout = ({children}) => {
  const userType = localStorage.getItem("roleName");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showLabelledMenu, setshowLabelledMenu] = useState(false);

  /*useEffect(() => {
    const expireDate = localStorage.getItem("tokenExpire");
    const tokenExpireDate = expireDate ? new Date(expireDate) : null;
    const userToken = !!localStorage.getItem("token");
    const checkTokenExpiration = () => {
      const currentDate = new Date();
      if (
        !userToken ||
        !tokenExpireDate ||
        currentDate.getTime() > tokenExpireDate.getTime()
      ) {
        navigate(routePath.login);
        return;
      }
      if (pathname === routePath.main) {
        if (userType !== roleNames.user) return navigate(routePath.dashboard);
        navigate(routePath.actionmaster);
      }
    };
    checkTokenExpiration();
  }, [pathname]);*/

  return (
    <LayoutContainer>
      <HeaderSection>
        <Header
          //   stateChange={clickedOutSide}
          onClickMenuBtn={() => setshowLabelledMenu(!showLabelledMenu)}
        />
      </HeaderSection>
      <BottomSection>
        <NavbarContainer className="overflow-visible">
          {/*<SideNavBar showLabelledMenu={showLabelledMenu} />*/}
        </NavbarContainer>
        <ContentSection>
        <main className="_main">
        <Outlet />
          </main>
        </ContentSection>
      </BottomSection>
    </LayoutContainer>
  );
};

export default RootLayout;

const LayoutContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 0px solid blue;
`;
const HeaderSection = styled.div`
  width: 100%;
`;
const BottomSection = styled.div`
  display: flex;
  flex-grow: 1;
  flex: 1;
  position: relative;
`;

const NavbarContainer = styled.div`
  display: flex;
  flex: 1;
  border: 0px solid green;
`;

const ContentSection = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border: 0px solid red;
  ._main {
    margin: 0 auto;
    width: 100%;
    position: absolute;
    bottom: 0px;
    top: 0px;
    overflow: auto;
  }
`;
