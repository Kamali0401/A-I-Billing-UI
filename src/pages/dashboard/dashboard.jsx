import React ,{useContext} from "react";
//import "../dashboard/dashboard.css";
//import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { routePath } from "../../app/routes/routepath";
import  {ThemeContext}  from '../../app/context/themecontext';
import ThemeSwitcher from "../../app/context/themeswitcher";
import "../styles/styles.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setTheme, themeName } = useContext(ThemeContext);
  return (
    <div className="main-content">
      
      <div className="content-section">
        {/* Left Section */}
        <div className="left-section">
          <div
            className="button-overlay"
            onClick={() => navigate(`${routePath.main}/${routePath.tableView}`)}
          >
            BILLING
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          <div className="button-overlay">OUTDOOR CATERING</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


