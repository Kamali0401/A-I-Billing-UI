import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routePath as RP } from "./routepath";
import ResetPassword from "../../pages/resetpassword/resetpassword";
import RootLayout from "../../pages/layout/rootlayout";
//import Layout from "../components/layout";
import Dashboard from "../../pages/dashboard/dashboard";
import Billing from "../../pages/billing/billing";
import LoginPage from "../../pages/auth/loginPage";
import Tabledetails from "../../pages/tabledetails/tabledetails";
import UserList from "../../pages/user/user";
import RoleList from "../../pages/role/role";
import TableType from "../../pages/tabletype/tabletype";
import TableList from "../../pages/table/table";
import DiscountList from "../../pages/discount/discount";
import InventoryList from "../../pages/inventory/inventory";
import InventoryCostList from "../../pages/inventorycost/inventorycost";
import ProfilePage from "../../pages/profile/profilePage";
import Report  from "../../pages/reports/report";
const AppRoute = () => {

    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Navigate to={RP.login} replace />} />
          <Route path={RP.login} element={<LoginPage />} />
          <Route path={RP.main} element={<RootLayout />}>
         
          <Route path={RP.dashboard} element={<Dashboard />} />
          <Route path={RP.billing} element={<Billing />} />
          <Route path={RP.tableView} element={<Tabledetails />} />
          <Route path={RP.user} element={<UserList />} />
          <Route path={RP.role} element={<RoleList />} />
          <Route path={RP.table} element={<TableType />} />
          <Route path={RP.tableDetail} element={<TableList />} />
          <Route path={RP.discount} element={<DiscountList />} />
          <Route path={RP.inventory} element={<InventoryList />} />
          <Route path={RP.inventorycost} element={<InventoryCostList />} />
          <Route path={RP.profile} element={<ProfilePage />} />
            <Route path={RP.report} element={<Report />} />
<Route path={RP.resetpassword} element={<ResetPassword  />} />
          </Route>
        </Routes>
      </Router>
    );
  };
  export default AppRoute;
  
  
  