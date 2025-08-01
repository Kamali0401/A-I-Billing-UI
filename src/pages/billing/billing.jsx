import Navigation from "../../app/components/navigation/navigation";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
//import styled from "styled-components";
import { ApiKey } from "../../api/endpoints";
import { authAxios, publicAxios } from "../../api/config";
import RenderIf, { ExportToCsv } from "./utils";
import { useMemo } from "react";
import "../styles/styles.css";
import localStorage from "redux-persist/es/storage";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import InventoryList from "./inventoryList";
//import Tabs from "./tabs";
const Billing = () => {
  const [showLabelledMenu, setshowLabelledMenu] = useState(false);
  const location = useLocation();
  //const tableCode = location.state?.tableCode;
  // const tableCatagory = location.state?.tableCatagory;
  const {
    tableId,
    tableCode,
    tableCatagory,
    seatId,
    orderDetails: initialOrderDetails,
  } = location.state || {};
  //console.log(orderId,"orderId");
  const [orderDetails, setOrderDetails] = useState(initialOrderDetails || {});
 // console.log(orderDetails, "orderDetails");

  const [IsFoodReceived, SetIsFoodReceived] = useState(false);
  const [newOrderId, setNewOrderId] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showBillingSection, setShowBillingSection] = useState(false);
  const [activeSection, setActiveSection] = useState("billing");
  const [orderItems, setOrderItems] = useState([]);
  //const [activeTab, setActiveTab] = useState("Dine In");
  const [split, setSplit] = useState(false);
  const [complimentary, setComplimentary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isPaid, setIsPaid] = useState(false);
  const [loyalty, setLoyalty] = useState(false);
  const [sendFeedbackSMS, setSendFeedbackSMS] = useState(false);
  const total = 978; // Example total value
  const [categoryName, setcategoryName] = useState("");
  const [itemOpt, setitemOpt] = useState([]); // To hold the items

 /* const [showSubcategory, setShowSubcategory] = useState(false);
  const [subcatagoryId, setsubcatagoryId] = useState("");
  const [subcatagoryName, setsubcatagoryName] = useState("");
  const [subCategories, setsubCategories] = useState([]);
  const [UniqueCategories, setUniqueCategories] = useState([]);
  const [CategoryOpt, setCategoryOpt] = useState([]);
  const [subcatagoryOpt, setsubcatagoryOpt] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [searchByCode, setSearchByCode] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);*/
  const [showModal, setShowModal] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [discountId, setDiscountId] = useState(0);
  // Fetch discount options when the component mounts
 
  return (
    <div className="d-flex1 w-100">
      <InventoryList
        orderDetails={orderDetails}
        setOrderDetails={setOrderDetails}
        tableId={tableId}
        tableCatagory={tableCatagory}
        tableCode={tableCode}
        seatId={seatId}
      />
     
      </div>
    
  );
};

export default Billing;
