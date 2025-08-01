import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../../app/components/header/header.jsx";
import "../../app/components/header/header.css";
import Navigation from "../components/SideNavbar/sideNavbar.jsx";

const Layout = ({ children }) => {
  const location = useLocation();
  const [clickedOutSide, setclickedOutSide] = useState(false);
  const [showLabelledMenu, setshowLabelledMenu] = useState(false);

  if (location.pathname == "/login" || location.pathname == "/") {
    return <main>{children}</main>;
  } else {
    return (
      <LayoutContainer>
        <HeaderSection>
          <Header
            stateChange={clickedOutSide}
            onClickMenuBtn={() => setshowLabelledMenu(!showLabelledMenu)}
          />
        </HeaderSection>
        <BottomSection>
          <NavbarContainer className="overflow-visible">
           <Navigation showLabelledMenu={showLabelledMenu} />
          </NavbarContainer>
          <ContentSection>
            <main className="_main">{children}</main>
          </ContentSection>
        </BottomSection>
      </LayoutContainer>
    );
  }
};
export default Layout;

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
