// Cleaned version of Tabs.jsx with re-added missing functions and variables
import React, { useState, useEffect, useRef } from "react";
import { ApiKey } from "../../api/endpoints";
import { authAxios, publicAxios } from "../../api/config";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { fetchOrderDetailsList } from "../../app/redux/slice/billing/billingslice";
import { useReactToPrint } from "react-to-print";
import BillPrint from "./BillPrint";
import KotPrint from "./kotprint";
import { useSelector, useDispatch } from "react-redux";
import dayjs from 'dayjs';

const Tabs = ({
  orderDetails,
  setOrderDetails,
  tableCatagory,
  tableCode,
  tableId,
  orderItems,
  seatId,
  setOrderItems,
}) => {
  const [kotPrintCount, setKotPrintCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetailsFromRedux = useSelector((state) => state.BillingList?.data || []);
  const [activeSection, setActiveSection] = useState("billing");
  const [activeTab, setActiveTab] = useState("Dine In");
  const [newOrderId, setNewOrderId] = useState(null);
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    name: "",
    address: "",
    locality: "",
    info: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState("");
  const [filteredItemsofcheckout, setfilteredItemsofcheckout] = useState([]);
  const [parcelamount, setParcelAmount] = useState(0.0);
  const [serviceamount, setServiceAmount] = useState(0.0);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [totals, setTotals] = useState({});
  const [restaurantdata, setRestaurantdata] = useState(JSON.parse(localStorage.getItem("restaurantData")) || [{}]);
  const [discountId, setDiscountId] = useState(0);
  const [noofPersonCount, setnoofPersonCount] = useState(0);
 console.log( seatId," seatId,");
  const billRef = useRef();
  const kotRef = useRef();
  const [holdItems, setHoldItems] = useState([]);
  const [showRemainingMessage, setShowRemainingMessage] = useState(true);  
const [remainingAmount, setRemainingAmount] = useState(0);
const [enteredAnyAmount, setEnteredAnyAmount] = useState(false);
const updateRemainingAmount = (updatedSplitDetails) => {
  const totalEntered =
    (Number(updatedSplitDetails.Cash) || 0) +
    (Number(updatedSplitDetails.Card) || 0) +
    (Number(updatedSplitDetails.Upi) || 0);
 
  const grand = Number(totals?.grandTotal || 0);
  const balance = grand - totalEntered;
 
  setRemainingAmount(balance);
   const anyValueEntered = Object.values(updatedSplitDetails).some(
    (val) => Number(val) > 0
  );
  setEnteredAnyAmount(anyValueEntered);
  if (anyValueEntered) {
    setShowRemainingMessage(true);
  }
};

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitDetails, setSplitDetails] = useState({
    Cash: "",
    Card: "",
    Upi: "",
  });
  const resetSplitDetails = () => {
    setSplitDetails({
      Cash: "",
      Card: "",
      Upi: "",
    });
  };
   const [confirmedSplitDetails, setConfirmedSplitDetails] = useState([]);

  const handlebillprintsave = useReactToPrint({ documentTitle: "A&IS Cafe Bill", contentRef: billRef });
  const handlekotprintsave = useReactToPrint({ documentTitle: "KOT", contentRef: kotRef });

  const kotGeneratedCount = orderDetails?.itemDetails?.filter((item) => item.status === "Hold").length || 0;
  //const allItemsReadyForBilling = orderDetails?.itemDetails?.every((item) => item.status === "Check Out");
  const allItemsAreActive = orderDetails?.itemDetails?.every(item => item.isActive);
const anyItemIsCheckedOut = orderDetails?.itemDetails?.some(item => item.status === "Check Out");

const allItemsReadyForBilling = allItemsAreActive && anyItemIsCheckedOut;
  const allItemsReadyForBillingPrint = orderDetails?.billId > 0 && allItemsReadyForBilling;
/*useEffect(() => {
  if (seatId) {
    debugger;
    const seatCount = seatId.split(',').filter(Boolean).length;
    setnoofPersonCount(seatCount);
  }
}, [seatId]);*/
useEffect(() => {
  debugger;
  if (seatId !== undefined && seatId !== null) {
    let seatCount = 0;

    if (typeof seatId === "string" && seatId.includes(",")) {
      seatCount = seatId.split(",").filter(Boolean).length;
    } else {
      seatCount = (seatId); // Handles both string and number
    }

    setnoofPersonCount(seatCount);
  }
}, [seatId]);

useEffect(() => {
  debugger;
  if (orderDetails?.itemDetails?.length > 0) {
     const activeItems = orderDetails.itemDetails.filter(item => item.isActive);
   setfilteredItemsofcheckout(activeItems);
   // setfilteredItemsofcheckout(orderDetails.itemDetails);


  }
}, [orderDetails]);
/*useEffect(() => {
  if (orderDetails?.itemDetails?.length > 0) {
    const checked = orderDetails.itemDetails
      .filter(item => item.status === "Food Received" || item.status === "Check Out")
      .map(item => item.id.toString());

    setCheckedItems(checked.join(","));
    setfilteredItemsofcheckout(orderDetails.itemDetails); // Set full item list
  }
}, [orderDetails]);*/

  useEffect(() => {
    if (orderDetails && Object.keys(orderDetails).length > 0) {
      const updated = {
        mobile: (orderDetails.customerPhoneNo || "").trim(),
        name: (orderDetails.customerName || "").trim(),
        address: (orderDetails.customerAddress || "").trim(),
        locality: (orderDetails.customerLocality || "").trim(),
        info: (orderDetails.customerInfo || "").trim(),
      };

      const isSame = Object.entries(updated).every(([key, value]) => userFormData[key] === value);
      if (!isSame) setUserFormData(updated);
    }
  }, [orderDetails]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await publicAxios.get(ApiKey.Discount);
        setDiscountOptions(response.data);
      } catch (error) {
        console.error("Error fetching discount options:", error);
      }
    };
    fetchDiscounts();
  }, []);
  // useEffect(() => {
  //   calculateTotals(discountValue);
  // }, [orderItems, orderDetails?.itemDetails, parcelamount, serviceamount, discountValue]);
  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    //console.log("setDiscountType..",e.target.value)
  };

  const handleClearDiscount = () => {
    setDiscountType("");
    setDiscountValue(0);
    calculateTotals(0);
    setErrorMessage("");
  };

  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);

  const handleCheckboxChange = (item, isChecked) => {
    debugger;
    if (item?.status === "Hold") {
      alert("Move item(s) to KOT");
      return;
    }
    const updatedOrderItems = orderDetails?.itemDetails.map((i) =>
      i.id === item.id ? { ...i, status: isChecked ? "Food Received" : "KOT Generated" } : i
    );
    setOrderDetails((prev) => ({ ...prev, itemDetails: updatedOrderItems }));
    setfilteredItemsofcheckout(updatedOrderItems);
    // ✅ Add or remove item.id from checkedItems string
    setCheckedItems((prevCheckedItems) => {
      const idArray = prevCheckedItems ? prevCheckedItems.split(",") : [];
      const idStr = item.id.toString();

      const updatedArray = isChecked
        ? [...new Set([...idArray, idStr])] // Add without duplicates
        : idArray.filter((id) => id !== idStr); // Remove

      return updatedArray.join(",");
    });
  };

  const handleCheckboxChangecheckout = (item, isChecked) => {
    debugger;
    const itemId = item?.Id || 0;
    const updatedOrderItems = orderDetails?.itemDetails.map((items) =>
      items.id === itemId
        ? { ...items, status: isChecked ? "Food Received" : "KOT Generated" }
        : items
    );
    setOrderDetails((prevDetails) => ({ ...prevDetails, itemDetails: updatedOrderItems }));
    setfilteredItemsofcheckout(updatedOrderItems);

    /*setCheckedItems((prev) => {
      let updatedCheckedItems = prev ? prev.split(",").filter(Boolean) : [];
      const idStr = String(itemId);
      if (isChecked && !updatedCheckedItems.includes(idStr)) {
        updatedCheckedItems.push(idStr);
      } else if (!isChecked) {
        updatedCheckedItems = updatedCheckedItems.filter((id) => id !== idStr);
      }
      return updatedCheckedItems.join(",");
    });*/
  };
  const handleApplyDiscount = async () => {
    try {
      debugger;
      /* const response = await publicAxios.get(ApiKey.Discount
        );

      const discountData = response.data;*/
      const matchedDiscount = discountOptions.find(
        (record) =>
          record.discountCode?.toLowerCase() === discountType.toLowerCase() ||
          record.discountType?.toLowerCase() === discountType.toLowerCase()
      );
     // console.log(matchedDiscount, "matchedDiscount");
      if (matchedDiscount) {
        /*console.log("Matched Discount:", matchedDiscount);
        setErrorMessage("");
        // let discountValue = 0;
        // if (matchedDiscount.percentage.includes("%")) {

        //   setDiscountValue(matchedDiscount.percentage);
        // } else {
        //   setDiscountValue(matchedDiscount.percentage);
        // }
        const discount = matchedDiscount.percentage;
        setDiscountValue(discount);
        calculateTotals(discount);*/
        const validUpto = matchedDiscount.validUpto;
        if (!validUpto || dayjs(validUpto).isBefore(dayjs(), 'day')) {
  setErrorMessage("Discount code has expired.");
  setDiscountValue(0);
  calculateTotals(0);
} else {
  // Valid discount
  setErrorMessage("");
  const discount = matchedDiscount.percentage;
  setDiscountValue(discount);
  calculateTotals(discount);

      }
      } else {
        //setErrorMessage("Invalid Discount code");
        setErrorMessage("Invalid Discount Code");
        setDiscountValue(0); // Clear discount value
        calculateTotals(0); // Recalculate totals with no discount
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      setErrorMessage("Failed to apply discount. Please try again.");
    }
  };

  const handleSplitSubmit = () => {
    const enteredTotal =
      (Number(splitDetails.Cash) || 0) +
      (Number(splitDetails.Card) || 0) +
      (Number(splitDetails.Upi) || 0);
 
    const grandTotal = Number(totals?.grandTotal);
 
    if (enteredTotal !== grandTotal) {
      alert("⚠️ Please enter valid split amounts equal to Grand Total");
      return;
    }
 
    setConfirmedSplitDetails(splitDetails);
    setShowSplitModal(false);
    setPaymentMethod("Split");
  };
  const handlebillsave = async () => {
debugger;
    const parameters = {
      orderId: orderDetails?.orderId || 0,
      TableId: orderDetails?.tableId,
   
      IsParcelRequired: parcelamount
        ? true
        : false || orderDetails?.isParcelRequired, //localStorage.getItem("username"),
      ParcelAmount: parcelamount || orderDetails?.parcelAmount,
      NoofPerson: noofPersonCount || orderDetails?.noofPerson,
      ServiceCharge: serviceamount || orderDetails?.serviceamount,
      DiscountAmount: totals.totalDiscount || orderDetails.discountAmount,
      NetAmount: totals.netTotal || orderDetails.NetAmount,
      Sgst: totals.sgst || orderDetails.Sgst,
      Cgst: totals.cgst || orderDetails.cgst,
      RoundOff: Number(totals.roundOff) || orderDetails.roundOff,
      GrandTotal: totals.grandTotal || orderDetails.grandTotal,
      SubTotal: totals.subTotal || orderDetails.subTotal,
      createdBy: localStorage.getItem("username"),
      customerName: userFormData.name || orderDetails.customerName,
      customerAddress: userFormData.address || orderDetails.customerAddress,
      customerPhoneNo: userFormData.mobile || orderDetails.customerPhoneNo,
      customerLocality: userFormData.locality || orderDetails.customerLocality,
      customerInfo: userFormData.info || orderDetails.customerInfo,
      DiscountId: discountId,
    };

    try {
      debugger;
      const response = await publicAxios.post(ApiKey.BillDetails, parameters);

      if (response.status == 201) {
        Swal.fire({
          title: "Bill Saved",
          //text: "Click OK to fetch updated order details.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Fetch updated order details when the user clicks OK
            const updatedResponse = await publicAxios.get(
              `orderDetail/${orderDetails?.orderId}`
            );
            setOrderDetails(updatedResponse?.data);
            setfilteredItemsofcheckout(updatedResponse?.data?.itemDetails);
          }
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handlebillpaid = async () => {
    debugger;
    // Prepare SplitDetails only if paymentMethod is 'Split'
    let paymentModeString = paymentMethod;

if (paymentMethod === "Split" && confirmedSplitDetails) {
  const parts = Object.entries(confirmedSplitDetails)
    .filter(([_, amount]) => amount && Number(amount) > 0)  // Exclude empty/zero
    .map(([mode, amount]) => `${mode}: '${amount}'`);

  paymentModeString = `${parts.join(', ')}`;
}
 
    // Final parameters to send to API
    const parameters = {
      orderId: orderDetails?.orderId || 0,
      PaymentMode: paymentModeString,
      ModifiedBy: localStorage.getItem("username")
     
    };

   /* const parameters = {
      orderId: orderDetails?.orderId || 0,
      PaymentMode: paymentMethod,
      ModifiedBy: localStorage.getItem("username"),
    };*/
    try {
      debugger;
      const response = await publicAxios.put(ApiKey.BillDetails, parameters);

      if (response.status == 204) {
        Swal.fire({
          title: "Bill Paid",
          text: "Click OK to fetch updated order details.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Fetch updated order details when the user clicks OK
            const updatedResponse = await publicAxios.get(
              `orderDetail/${orderDetails?.orderId}`
            );

            // setOrderDetails(updatedResponse.data);
            navigate(-1); // Goes back to the previous page
            /* setOrderDetails((prev) => ({
              ...prev,
              itemDetails: updatedResponse?.data.itemDetails,
            }));*/
          }
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handlesave = async (data) => {
debugger;
     const currentHoldItems = orderDetails?.itemDetails?.filter(item => item.status === "Hold" && item.isActive) || [];
  setHoldItems(currentHoldItems); // <-- you can use this outside as needed
    localStorage.setItem("holdItems", JSON.stringify(currentHoldItems));
    const updatedFormData = orderDetails?.itemDetails.map((item) => ({
      ...item,
      status: item.status === "Hold" ? data : item.status,
     
    }));

    // if (JSON.stringify(updatedFormData) !== JSON.stringify(formData)) {
    //   setFormData(updatedFormData);
    // }
    const parameters = {
      orderId: orderDetails?.orderId || 0,
      SeatId:(seatId ||orderDetails?.seatId).toString(),
      itemDetails: updatedFormData,
      waiterId: localStorage.getItem("userid"),
      tableId: tableId || orderDetails?.tableId,
      createdBy: localStorage.getItem("username"),
      customerName: userFormData.name || orderDetails.customerName,
      customerAddress: userFormData.address || orderDetails.customerAddress,
      customerPhoneNo: userFormData.mobile || orderDetails.customerPhoneNo,
      customerLocality: userFormData.locality || orderDetails.customerLocality,
      customerInfo: userFormData.info || orderDetails.customerInfo,
      orderType: activeTab,
    };

    try {
      debugger;
      const response = await publicAxios.post(ApiKey.OrderDetails, parameters);

      const data1 = response.data;
      const orderId = response.data?.orderId;
      setNewOrderId(orderId); // Save orderId in state
      if (response.status == 201) {
        debugger;
        Swal.fire({
          title: `${data}`,
          text: "Click OK to fetch updated order details.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            debugger;
            // Fetch updated order details when the user clicks OK
            const updatedResponse = await publicAxios.get(
              `orderDetail/${data1?.orderId}`
            );
            // console.log(
            //   "Updated Order Details Response:",
            //   updatedResponse.data
            // );

            setOrderDetails(updatedResponse.data);
            setfilteredItemsofcheckout(updatedResponse?.data?.itemDetails);
            /* setOrderDetails((prev) => ({
              ...prev,
              itemDetails: updatedResponse?.data.itemDetails,
            }));*/
          }
        });
      }
      // console.log("API Response:", data);
    } catch (error) {
      console.error("Error saving order:", error);
    }
    //console.log(orderId,"NewOrderId");
  };


  const handlecheckout = async () => {
    debugger;
    setIsLoading(true); // Stop loading
    //  setCheckoutFlag(true);
    handleCloseModal();
   /* const orderItemsUpdate = orderDetails?.itemDetails.filter((item) =>
      checkedItems.split(",").includes(item.id.toString())
    ); //123,124,
    setOrderDetails((prevDetails) => ({
      ...prevDetails, // Spread the existing orderDetails properties
      itemDetails: orderItemsUpdate, // Replace the itemDetails with the updated array
    }));
    // setOrderDetails(orderItemsUpdate);
    setfilteredItemsofcheckout(orderItemsUpdate);
    const parameters = {
      OrderId: orderDetails?.orderId || newOrderId,
      Id: checkedItems,
      IsFoodReceived: true,
      IsCheckOut: true, // Use the checked state here
      ModifiedBy: localStorage.getItem("username"),
    };*/
     // Loop through items and send individual requests
    const username = localStorage.getItem("username");
  const currentOrderId = orderDetails?.orderId || newOrderId;

  // Filter selected and active items (not already checked out)
  const selectedItems = orderDetails?.itemDetails?.filter(
    (item) => item.isActive && item.status !== "Check Out"
  );
 // ✅ Construct payload as a list
 const parameters = selectedItems.map((item) => {
  const isFoodReceived = item.status === "Food Received";
  const review = item.review|| "";

  return {
    OrderId: currentOrderId,
    Id: item.id,
    IsFoodReceived: isFoodReceived,
    IsCheckOut: true,  // ✅ Updated logic
    Review: review,
    ModifiedBy: username,
  };
});
    try {
      
       
      // Call the API
      const response = await publicAxios.put(ApiKey.OrderDetails, parameters);
      // console.log("API Response:", response.data);
      if ((response.status === 204) //&& orderItemsUpdate.length > 0
      ) {
        //  console.log("Order updated successfully, fetching new details...");
        debugger;
        const orderId = orderDetails?.orderId || newOrderId; // Assign to a variable
        const res = await dispatch(fetchOrderDetailsList(orderId));
        const updatedData = res; // Use the returned data        const updatedData = orderDetailsFromRedux;
       // console.log("updatedData....", updatedData);

        // const updatedItemDetails = updatedData?.itemDetails.map((item) => ({
        //   ...item,
        //   isActive:
        //     (item.status === "Food Received") ||(item.status === "Check Out")
        //       ? item.isActive // Preserve the original isActive value
        //       : checkedItems.split(",").includes(item?.itemId?.toString()), // Set isActive based on checked items
        // }));
        setfilteredItemsofcheckout(updatedData?.itemDetails);
        // Update the state with the modified item details
        setOrderDetails((prev) => ({
          ...prev,
          itemDetails: updatedData?.itemDetails,
        }));

        // setModalOpen(false);
      }
      else {
        navigate(-1);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
    finally {
      setIsLoading(false); // Stop loading
    }
  };

  const calculateTotals = (discountValue) => {
    debugger;
    const percentageCgst = restaurantdata[0].cgst / 100;
    const percentageSgst = restaurantdata[0].sgst / 100;
    const orderItemTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const additionalItemTotal =
      orderDetails?.itemDetails?.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      ) || 0;

    const otherCharges = (serviceamount || 0) + (parcelamount || 0);

    const subTotal = parseFloat(orderItemTotal + additionalItemTotal + otherCharges).toFixed(2);
    let totalDiscount = 0;
    if (String(discountValue).includes("%")) {
      debugger;
      const percentage = parseFloat(discountValue.replace("%", ""));
      totalDiscount = parseFloat((subTotal * percentage) / 100 || 0).toFixed(2); // Calculate the percentage discount
    } /*else{
       totalDiscount = subTotal - discountValue ||0;
    }*/ else if (!isNaN(parseFloat(discountValue))) {
      totalDiscount = parseFloat(discountValue).toFixed(2); // Fixed discount
    }

    const netTotal = parseFloat((subTotal - totalDiscount).toFixed(2));

    const cgst = parseFloat((netTotal * percentageCgst).toFixed(2));
    const sgst = parseFloat((netTotal * percentageSgst).toFixed(2));
    const gstoverallTotal = netTotal + cgst + sgst;

    const TotalRoundoff = Math.round(gstoverallTotal);
    const roundOff = (TotalRoundoff - gstoverallTotal).toFixed(2);
    const grandTotal = (
      Number(netTotal) +
      Number(cgst) +
      Number(sgst) +
      Number(roundOff)
    ).toFixed(2);

    return {
      netTotal,
      cgst,
      sgst,
      grandTotal,
      TotalRoundoff,
      roundOff,
      subTotal,
      totalDiscount,
    };
  };

  // Trigger recalculation in useEffect
  useEffect(() => {
    const totals = calculateTotals(discountValue);

    setTotals(totals);

    // Update orderDetails based on totals (if needed)
    setOrderDetails((prev) => ({
      ...prev,

      NetAmount: totals.netTotal,
      Sgst: totals.sgst,
      Cgst: totals.cgst,
      RoundOff: totals.roundOff,
      GrandTotal: totals.grandTotal,
      SubTotal: totals.subTotal,
    }));
  }, [orderDetails?.itemDetails, parcelamount, serviceamount, discountValue]);

  return <><div className="tabs-container">
    {["Dine In", "Delivery", "Pick Up"].map((tab) => (
      <button
        key={tab}
        className={`tab ${activeTab === tab ? "active" : ""}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

    <div className="icons-container">
      {[
        {
          icon: "bx-chair",
          label: tableCode || orderDetails.tableCode,
          key: "billing",
          onClick: () => setActiveSection("billing"),
        },
        {
          icon: "bx-user",
          label: "",
          key: "user",
          onClick: () => setActiveSection("user"),
        },
        { icon: "bx-group", label: "", key: "group" },
        { icon: "bx-clipboard", label: "", key: "clipboard" },
        { icon: "bx-dish", label: "", key: "dish" },
        {
          icon: "",
          label: tableCatagory || orderDetails.tableCatagory,
          key: "",
        },
      ].map((item, index) => (
        <div
          key={index}
          className="icon-wrapper"
          onClick={item.onClick}
          style={{
            cursor: item.onClick ? "pointer" : "default",
            border:
              activeSection === item.key
                ? "2px solid rgb(194, 190, 190)"
                : "none",
            marginBottom: activeSection === item.key ? "5px" : "0px",
            borderRadius: "8px",
            padding: "0.5rem",
            background:
              activeSection === item.key ? "#e9f3ff" : "transparent",
          }}
        >
          {item.icon && <i className={`bx ${item.icon}`} />}
          {item.label && <span>{item.label}</span>}
        </div>
      ))}
    </div>
    {activeSection === "user" && (
      <div className="user-form-modal">
        <div className="form-header">
          <h3>User Info</h3>
        </div>
        <form className="user-form">
          {[
            { label: "Mobile", name: "mobile" },
            { label: "Name", name: "name" },
            { label: "Address", name: "address" },
            { label: "Locality", name: "locality" },
            { label: "Info", name: "info" },
          ].map((field) => (
            <div className="form-row" key={field.name}>
              <label htmlFor={field.name}>{field.label}:</label>
              <input
                id={field.name}
                type="text"
                placeholder={field.label}
                value={userFormData[field.name]}
                onChange={(e) =>
                  setUserFormData((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </form>
      </div>
    )}

   {["billing", "user"].includes(activeSection) && (
  <div className="tab-content">
    {isLoading ? (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading order details...</p>
      </div>
    ) : (
      <div className="order-list">
        <div className="order-list-header grid-row">
          <div className="left">ITEMS</div>
          <div className="left">INSTRUCTIONS</div>
          <div className="center">CHECK ITEMS</div>
          <div className="center">QTY.</div>
          <div className="right">PRICE</div>
        </div>

        {(() => {
          const anyItemIsCheckedOut = orderDetails?.itemDetails?.some(
            (item) => item.status === "Check Out"
          );

          return (orderDetails?.itemDetails || []).length > 0 ? (
            (orderDetails.itemDetails || [])
              .filter((item) => item.isActive && item.qty > 0)
              .map((item) => {
                const isChecked =
                  item.status === "Food Received" || item.status === "Check Out";

                return (
                  <div
                    className={`order-item grid-row ${item.isKOT ? "is-kot-item" : ""}`}
                    key={item.id}
                  >
                    {/* Item Name and Delete Icon */}
                    <div className="order-name">
                      <i
                        className={`bx bx-x ${item.status !== "Hold" ? "disabled" : ""}`}
                        onClick={() => {
                          const idToDelete = item.id;
                          setOrderDetails((prevDetails) => ({
                            ...prevDetails,
                            itemDetails: prevDetails.itemDetails.map((detail) =>
                              detail.id === idToDelete
                                ? { ...detail, isActive: false, qty: 0 }
                                : detail
                            ),
                          }));
                        }}
                        style={{
                          display: item.status === "Hold" ? "inline-block" : "none",
                        }}
                      />
                      <span>{item.itemName}</span>
                    </div>

                    {/* Instructions Input */}
                    <div className="left">
                      <input
                        type="text"
                        placeholder="Instructions (e.g., extra spicy)"
                        className="form-control"
                        value={item.itemComment || ""}
                        style={{ fontSize: "12px" }}
                        onChange={(e) => {
                          const commentText = e.target.value;
                          setOrderDetails((prevDetails) => ({
                            ...prevDetails,
                            itemDetails: prevDetails.itemDetails.map((detail) =>
                              detail.id === item.id
                                ? { ...detail, itemComment: commentText }
                                : detail
                            ),
                          }));
                        }}
                        disabled={item.status !== "Hold"}
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleCheckboxChange(item, e.target.checked)
                        }
                        disabled={anyItemIsCheckedOut}
                      />
                    </div>

                    {/* Quantity Controls */}
                    <div className="qty">
                      <button
                        onClick={() => {
                          setOrderDetails((prevDetails) => {
                            const updatedDetails = {
                              ...prevDetails,
                              itemDetails: prevDetails.itemDetails.map((detail) =>
                                detail.id === item.id
                                  ? {
                                      ...detail,
                                      qty: Math.max((detail.qty || 0) - 1, 0),
                                      isActive: Math.max((detail.qty || 0) - 1, 0) > 0,
                                    }
                                  : detail
                              ),
                            };
                            return updatedDetails;
                          });
                        }}
                        disabled={item.status !== "Hold"}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        readOnly
                        value={item.qty}
                        disabled={item.status !== "Hold"}
                      />
                      <button
                        onClick={() => {
                          setOrderDetails((prevDetails) => ({
                            ...prevDetails,
                            itemDetails: prevDetails.itemDetails.map((detail) =>
                              detail.id === item.id
                                ? { ...detail, qty: (detail.qty || 0) + 1 }
                                : detail
                            ),
                          }));
                        }}
                        disabled={item.status !== "Hold"}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="right">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="empty-order">No items in the order.</div>
          );
        })()}
      </div>
    )}
  </div>
)}


    {["billing", "user"].includes(activeSection) && (
      <div className="sticky-footer"
      /*style={{
        position: "sticky", // Default sticky style
        bottom: 0,
        background: "#fff",
        padding: "1rem",
        zIndex: 100,
      }}*/
      >
        <div className="payment-container">
          {orderDetails?.itemDetails?.every(
            (item) => item.status != "Hold"
          ) && (
              <div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">No of Person(s)</span>

                    <input
                      type="number"
                      value={
                        orderDetails.billId > 0
                          ? orderDetails.noofPerson
                          : noofPersonCount
                      }
                      disabled={orderDetails.billId > 0}

                      onChange={(e) => {

                        const newValue = parseFloat(e.target.value);
                        if (orderDetails.billId > 0) {
                          // Update serviceCharge in orderDetails
                          setOrderDetails((prev) => ({
                            ...prev,
                            noofPerson: newValue,
                          }));
                        } else {
                          // Update serviceamount state
                          setnoofPersonCount(newValue);
                        }
                        // calculateTotals();
                      }}
                      className="input-class" // Add your custom CSS class for styling
                    />
                  </div>
                </div>
                {/*<div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">Service Charge</span>

                    <input
                      type="number"
                      value={
                        orderDetails.billId > 0
                          ? orderDetails.serviceCharge.toFixed(2)
                          : serviceamount
                      }
                      disabled={orderDetails.billId > 0}

                      onChange={(e) => {

                        const newValue = parseFloat(e.target.value);
                        if (orderDetails.billId > 0) {
                          // Update serviceCharge in orderDetails
                          setOrderDetails((prev) => ({
                            ...prev,
                            serviceCharge: newValue,
                          }));
                        } else {
                          // Update serviceamount state
                          setServiceAmount(newValue);
                        }
                        // calculateTotals();
                      }}
                      className="input-class" // Add your custom CSS class for styling
                    />
                  </div>
                </div>*/}
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">Parcel Amount</span>

                    <input
                      type="number"
                      value={
                        orderDetails.billId > 0
                          ? orderDetails.parcelAmount.toFixed(2)
                          : parcelamount
                      }
                      disabled={orderDetails.billId > 0}

                      onChange={(e) => {
                        const newValue = parseFloat(e.target.value);
                        if (orderDetails.billId > 0) {
                          // Update parcelAmount in orderDetails
                          setOrderDetails((prev) => ({
                            ...prev,
                            parcelAmount: newValue,
                            IsParcelRequired: true,
                          }));
                        } else {
                          // Update parcelamount state
                          setParcelAmount(newValue);
                        }
                        calculateTotals();
                      }}
                      className="input-class" // Add your custom CSS class for styling
                    />
                  </div>
                </div>

                <div class="charges-container">
                  <div class="charge-item">
                    Sub Total{" "}
                    <span class="text-right">
                      ₹
                      {orderDetails.billId > 0
                        ? orderDetails.subTotal
                        : totals.subTotal}
                    </span>
                  </div>
                </div>
                <div className="charges-container">
                  <div className="charge-item1 grid grid-cols-3 gap-4 items-center ">
                    {/* First Column: Discount Label */}
                    <span className="text-left">Discount</span>
                    {/* Second Column: Discount Type */}
                    <input
                      type="text"
                      className="text-center border border-gray-300 rounded px-2 py-2 mt-2 mb-2"
                      placeholder="Enter Discount Code"
                      value={discountType}
                      onChange={handleDiscountTypeChange}
                      disabled={orderDetails.billId > 0}
                    />
                    <button
                      onClick={handleClearDiscount}
                      className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                      disabled={orderDetails.billId > 0}
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleApplyDiscount}
                      className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
                      disabled={orderDetails.billId > 0}

                    >
                      Apply
                    </button>
                    {errorMessage && (
                      <div style={{ color: 'red', marginTop: '0.5rem' }}>{errorMessage}</div>
                    )}
                    {/* Dropdown */}
                    {/* {discountType != "" && (
                <select
                  id="discountDropdown"
                  className="w-full border border-gray-300 rounded px-2 py-2 mt-2 mb-2"
                  value={discountType}
                  onChange={handleDropdownChange}
                >
                  <option value="">-- Select Discount Type --</option>
                  {filteredOptions.map((option) => (
                    <option key={option.id} value={option.discountType}>
                      {option.discountType} ({option.percentage}%)
                    </option>
                  ))}
                </select>
              )}*/}
                    {/* Third Column: Discount Value */}
                    {/* <span className="text-right">₹{"0.00"}</span> */}
                    <div className="discount-value-container">
                      <span>Discount Value:</span>
                      <span>₹ -
                        {orderDetails.billId > 0
                          ? orderDetails.discountAmount
                          : totals.totalDiscount}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">Net Total</span>

                    <span>
                      ₹
                      {orderDetails.billId > 0
                        ? orderDetails.netAmount
                        : totals.netTotal}
                    </span>
                  </div>
                </div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">{`CGST ${restaurantdata[0]?.cgst || ""
                      }%`}</span>
                    <span className="text-right">
                      ₹
                      {orderDetails.billId > 0
                        ? orderDetails.cgst
                        : totals.cgst}
                    </span>
                  </div>
                </div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">{`SGST ${restaurantdata[0]?.sgst || ""
                      }%`}</span>
                    <span class="text-right">
                      ₹
                      {orderDetails.billId > 0
                        ? orderDetails.sgst
                        : totals.sgst}
                    </span>
                  </div>
                </div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">Round Off </span>
                    <span class="text-right">
                      
                      {orderDetails.billId > 0
                        ? orderDetails.roundOff
                        : totals.roundOff}
                    </span>
                  </div>
                </div>
                <div class="charges-container">
                  <div class="charge-item">
                    <span class="text-left">Grand Total</span>
                    <span class="text-right">
                      ₹
                      {orderDetails.billId > 0
                        ? orderDetails.grandTotal.toFixed(2)
                        : totals.grandTotal}
                    </span>
                  </div>
                </div>

                <div className="radio-group">
                  {["Cash", "Card", "Upi", "Split"].map((method) => (
                    <div className="radio-button" key={method}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => {
                          setPaymentMethod(method);
                          if (method === "Split") {
                            setShowSplitModal(true); // ✅ this now works
                          }
                        }}
                      />
                      <label>{method}</label>
                    </div>
                  ))}
                </div>
                <Modal show={showSplitModal} onHide={() => {
                  setShowSplitModal(false);
                  resetSplitDetails();
                  setShowRemainingMessage(false);
                  setRemainingAmount(0);
                  setPaymentMethod("Cash");
                }} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Split Payment</Modal.Title>
                  </Modal.Header>
 
                 <Modal.Body>
  <div>
    <p><strong>Grand Total: ₹{totals?.grandTotal}</strong></p>
 
    <div className="modal-items">
      {["Cash", "Card", "Upi"].map((method, index) => (
        <div key={index} className="modal-item d-flex align-items-center mb-2">
          <label className="me-2" style={{ width: "60px" }}>{method}</label>
          <input
            type="number"
            className="form-control"
            placeholder="0"
            style={{ width: "150px" }}
            value={splitDetails[method] || ""}
            onChange={(e) => {
              const updated = {
                ...splitDetails,
                [method]: e.target.value,
              };
              setSplitDetails(updated);
              updateRemainingAmount(updated);
            }}
          />
        </div>
      ))}
 
     {enteredAnyAmount && remainingAmount !== 0 && showRemainingMessage && (
  remainingAmount > 0 ? (
    <div style={{ color: "orange", marginTop: "10px" }}>
      Remaining: ₹{remainingAmount}
    </div>
  ) : (
    <div style={{ color: "red", marginTop: "10px" }}>
      Amount exceeds Grand Total by ₹{Math.abs(remainingAmount)}
    </div>
  )
)}
    </div>
  </div>
</Modal.Body>  
 
 
                  <Modal.Footer>
  <Button
    variant="secondary"
    onClick={() => {
      setShowSplitModal(false);        
      resetSplitDetails();            
      setPaymentMethod("Cash");  
      setShowRemainingMessage(false);  
      setRemainingAmount(0);    
       
    }}
  >
    Cancel
  </Button>
 
  <Button
    variant="primary"
    onClick={() => {
      handleSplitSubmit();             // Submit the entered values
      setShowRemainingMessage(true);  // Just hide message, keep values
    }}
  >
    Continue
  </Button>
</Modal.Footer>
 
                </Modal>
 
              </div>
            )}
           
          <div className="button-group">
            {localStorage.getItem("roleid") !== "2" && (
  <>
            <button
              className="action-button"
              onClick={handlebillpaid}
              disabled={!allItemsReadyForBillingPrint} // Disable if conditions are not met
              style={{
                backgroundColor: !allItemsReadyForBillingPrint
                  ? "#d3d3d3"
                  : "#d32f2f", // Gray if disabled, blue if enabled
                cursor: !allItemsReadyForBillingPrint
                  ? "not-allowed"
                  : "pointer",
                color: "white",
              }}
            >
              Paid
            </button>
            <div style={{ display: "none" }}>
              <BillPrint
                ref={billRef}
                billData={orderDetails || { itemDetails: [] }}
              />
            </div>
            <button
              className="action-button"
              onClick={handlebillprintsave}
              disabled={!allItemsReadyForBillingPrint} // Disable if conditions are not met
              style={{
                backgroundColor: !allItemsReadyForBillingPrint
                  ? "#d3d3d3"
                  : "#d32f2f", // Gray if disabled, blue if enabled
                cursor: !allItemsReadyForBillingPrint
                  ? "not-allowed"
                  : "pointer",
                color: "white",
              }}
            >
              Print Bill
            </button>
            <button
              className="action-button"
              onClick={handlebillsave}
              disabled={!allItemsReadyForBilling || orderDetails?.billId > 0} // Disable if not all items are ready for billing
              style={{
                backgroundColor: !allItemsReadyForBilling || orderDetails?.billId > 0
                  ? "#d3d3d3"
                  : "#d32f2f", // Gray if disabled, blue if enabled
                cursor: !allItemsReadyForBilling || orderDetails?.billId > 0 ? "not-allowed" : "pointer",
                color: "white",
              }}
            >
              Bill
            </button>
</>
            )}
            <button
              className="action-button"
              onClick={handleOpenModal}
              disabled={kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out")}
              style={{
                backgroundColor:
                  kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "#d3d3d3" : "#d32f2f", // Gray if disabled, blue if enabled
                cursor: kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "not-allowed" : "pointer", // Change cursor to indicate disabled state
              }}
            >
              Check Out
            </button>
            <div style={{ display: "none" }}>
              <KotPrint
                ref={kotRef}
                billData={orderDetails || { itemDetails: [] }}
                 // currentKotPrintId={holdItems}
               //  currentKotPrintId={holdItems.map((item) => item.itemId)}
               currentKotPrintId={
      (holdItems?.length > 0
        ? holdItems
        : JSON.parse(localStorage.getItem("holdItems") || "[]")
      ).map((item) => item.itemId)}
              />
            </div>

            <button
              className="action-button-2"
              onClick={handlekotprintsave}
              disabled={kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out")}
              style={{
                backgroundColor:
                  kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "#d3d3d3" : "#474849", // Gray if disabled, blue if enabled
                cursor: kotGeneratedCount > 0 || orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "not-allowed" : "pointer", // Change cursor to indicate disabled state
              }}
            >
              Print KOT
            </button>

            <button
              className="action-button-2"
              onClick={() => handlesave("KOT Generated")}
              disabled={orderDetails?.itemDetails?.some(item => item.status === "Check Out")}
              style={{
                backgroundColor:
                  orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "#d3d3d3" : "#474849", // Gray if disabled, blue if enabled
                cursor: orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "not-allowed" : "pointer", // Change cursor to indicate disabled state
              }}
            >
              KOT
            </button>

            <button
              className="action-button-2"
              onClick={() => handlesave("Hold")}
              disabled={orderDetails?.itemDetails?.some(item => item.status === "Check Out")}
              style={{
                backgroundColor:
                  orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "#d3d3d3" : "#474849", // Gray if disabled, blue if enabled
                cursor: orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "not-allowed" : "pointer", // Change cursor to indicate disabled state
              }}
            >
              Hold
            </button>
          </div>
          {/*Model*/}
        </div>
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Checkout Items</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="modal-items">
              {filteredItemsofcheckout?.length > 0 ? (
                filteredItemsofcheckout.map((item, index) => {
                  // Identify items with "Food Received" status
                  // const foodReceivedItems = filteredItemsofcheckout
                  //   .filter(
                  //     (item) =>
                  //       item.status === "Food Received" ||
                  //       item.status === "Check Out"
                  //   )
                  //   .map((item) => item.id);
                  // console.log(item, "filteredItemsofcheckoutitem");
                  const itemId = item.id;
                  const isChecked =
                    item.status === "Food Received" ||
                    item.status === "Check Out";
                  checkedItems.split(",").includes(itemId?.toString());
                  return (
                    <div key={index} className="modal-item">
                      <input
                        type="checkbox"
                        checked={isChecked} // Bind dynamically
                        onChange={(e) =>
                          handleCheckboxChangecheckout(
                            { Id: item.id },
                            e.target.checked
                          )
                        }
                      />
                      <span className="px-2">{item.itemName}</span>
                       {!isChecked && (
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter comments"
                  value={item.review || ""}
                  onChange={(e) => {
                    const commentText = e.target.value;

                    // Update filteredItemsofcheckout state
                    setfilteredItemsofcheckout((prevItems) =>
                      prevItems.map((itm) =>
                        itm.id === item.id
                          ? { ...itm, review: commentText }
                          : itm
                      )
                    );

                    // Optionally update in orderDetails too
                    setOrderDetails((prev) => ({
                      ...prev,
                      itemDetails: prev.itemDetails.map((itm) =>
                        itm.id === item.id
                          ? { ...itm, review: commentText }
                          : itm
                      ),
                    }));
                  }}
                />
              )}
                    </div>
                  );
                })
              ) : (
                <div>Loading items...</div>
              )}
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlecheckout}>
              continue
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )}</>;
};

export default Tabs;
