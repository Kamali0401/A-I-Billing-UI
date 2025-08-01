import React, { useState, useEffect,useRef } from "react";
import { ApiKey } from "../../api/endpoints";
import { authAxios, publicAxios } from "../../api/config";
//import InventoryList from "./inventoryList";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";
import BillPrint from "./BillPrint";
const Tabs = ({
  orderDetails,
  setOrderDetails,
  tableCatagory,
  tableCode,
  tableId,
  orderItems,
  setOrderItems,
}) => {
  const billRef = useRef();

  // const [orderDetails, setOrderDetails] = useState([]);
  const [activeSection, setActiveSection] = useState("billing");
  const [activeTab, setActiveTab] = useState("Dine In");
  const [newOrderId, setNewOrderId] = useState(null);
  //const [orderItems, setOrderItems] = useState([]);
  const [userFormData, setUserFormData] = useState({
    mobile: "",
    name: "",
    address: "",
    locality: "",
    info: "",
  });
  // Populate form values if orderDetails exists
  useEffect(() => {
    if (orderDetails && Object.keys(orderDetails).length > 0) {
      setUserFormData({
        mobile: orderDetails.customerPhoneNo || "",
        name: orderDetails.customerName || "",
        address: orderDetails.customerAddress || "",
        locality: orderDetails.customerLocality || "", // update if needed
        info: orderDetails.customerInfo || "", // update if needed
      });
    }
  }, [orderDetails]);
  const groupItemDetails = (items) => {
    const activeItems = items.filter((item) => item.isActive);

    return activeItems.map((item) => ({
      id: item.id,
      itemid: item.itemId,
      itemName: item.itemName,
      quantity: item.qty,
      price: item.price,
      isKOT: item.isKOT,
      status: item.status,
    }));
  };
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    debugger;
    const initialData = (
      orderItems.length > 0 ? orderItems : orderDetails?.itemDetails || []
    ).map((item) => ({
      id: item.id || 0, // Map the existing id or default to 0
      orderId: item.orderId || 0, // Map the existing orderId or default to 0
      itemId: item.itemId, // Map itemId directly
      itemCode: item.itemCode || "", // Optional: Map itemCode if available
      itemName: item.itemName || "", // Optional: Map itemName if available
      qty: item.qty || item.quantity || 1, // Default quantity to 1 if not provided
      price: item.price || 0, // Default price to 0 if not provided
      status: item.status || "", // Map the status or default to an empty string
      isActive: item.isActive !== undefined ? item.isActive : true,
    }));

    setFormData(initialData);
  }, [orderItems, orderDetails]);
  const handleCheckboxChange = async (item, isChecked) => {
    // Update state
    debugger;
    const updatedOrderItems = orderItems.map((items) =>
      items.itemId === item.itemId
        ? { ...items, status: isChecked ? "Food Received" : "KOT Generated" }
        : items
    );

    setOrderItems(updatedOrderItems);

    const parameters = {
      OrderId: orderDetails?.orderId || newOrderId,
      ItemId: item?.itemid?.toString() || item?.itemId?.toString(),
      IsFoodReceived: isChecked,
      IsCheckOut: false,
      ModifiedBy:localStorage.getItem("username"),
    };
    try {
      const response = await publicAxios.put(ApiKey.OrderDetails, parameters);
     // console.log("API Response:", response.data);
      if (response.status === 204) {
        console.log("Order updated successfully, fetching new details...");
        debugger;
        // Fetch the updated order details
        const orderId = orderDetails?.orderId || newOrderId; // Assign to a variable

        // Fetch the updated order details
        const updatedResponse = await publicAxios.get(`orderDetail/${orderId}`);
       // console.log("Updated Order Details Response:", updatedResponse.data);

        // Update the state with the new order details
        setOrderDetails(updatedResponse.data);
        //setOrderItems(updatedResponse.data?.itemDetails);
       /* console.log(
          "Updated Order items Response:",
          updatedResponse.data?.itemDetails
        );*/
        // setModalOpen(false);
        //handleCloseModal();
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  //Payemnt
  const [split, setSplit] = useState(false);
  const [complimentary, setComplimentary] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isPaid, setIsPaid] = useState(false);
  const [loyalty, setLoyalty] = useState(false);
  const [sendFeedbackSMS, setSendFeedbackSMS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountOptions, setDiscountOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [discountId, setDiscountId] = useState(0);
  // Fetch discount options when the component mounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await publicAxios.get(ApiKey.Discount);
        setDiscountOptions(response.data);
        setFilteredOptions(response.data);
      } catch (error) {
        console.error("Error fetching discount options:", error);
      }
    };

    fetchDiscounts();
  }, []);

  // Handle input change
  const handleDiscountTypeChange = (event) => {
    debugger;
    const inputType = event.target.value;
    setDiscountType(inputType);

    if (inputType.trim()) {
      const numericInputType = Number(inputType);

      if (isNaN(numericInputType)) {
        console.error("Invalid input: Input is not a valid number");
        setDiscountValue(0); // Reset to 0 if input is invalid
        return;
      }
      const filtered = discountOptions.filter((discount) =>
        discount.percentage.toString().startsWith(inputType)
      );

      setFilteredOptions(filtered);
      // Check if the entered percentage matches any available discount
      const matchedDiscount = discountOptions.find(
        (discount) => discount.percentage === numericInputType
      );

      setDiscountValue(matchedDiscount ? matchedDiscount.percentage : 0);
      setDiscountId(matchedDiscount ? matchedDiscount.id : null); // Store DiscountId
    } else {
      setDiscountValue(0); // Reset if input is cleared
      setDiscountId(null); // Reset DiscountId
    }
  };
  const handlebillprintsave = useReactToPrint({
    documentTitle: 'A&IS Cafe Bill',
    contentRef: billRef,
 })
  const handleDropdownChange = (event) => {
    const selectedType = event.target.value;
    setDiscountType(selectedType);

    const matchedDiscount = discountOptions.find(
      (discount) => discount.discountType === selectedType
    );

    setDiscountValue(matchedDiscount ? matchedDiscount.percentage : 0);
    setDiscountId(matchedDiscount ? matchedDiscount.id : null); // Store DiscountId
  };
  const [parcelamount, setParcelAmount] = useState(0.0);
  const [serviceamount, setServiceAmount] = useState(0.0);
  const netTotal =
    orderItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0) +
    (orderDetails?.itemDetails?.reduce(
      (acc, curr) => acc + curr.price * curr.qty,
      0
    ) || 0) +
    (serviceamount || 0) +
    (parcelamount || 0) -
    (discountValue || 0);

  const cgst = netTotal * 0.09;
  const sgst = netTotal * 0.09;
  const grandTotal = cgst + sgst + netTotal;

  const handleOpenModal = () => {
    console.log("Modal opened");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Modal closed");
    setShowModal(false);
  };

  const handlebillsave = async () => {
    debugger;

    const parameters = {
      orderId: 0 || orderDetails?.orderId,
      TableId: orderDetails?.tableId,
      IsParcelRequired: false, //localStorage.getItem("username"),
      ParcelAmount: parcelamount,
      ServiceCharge: serviceamount,
      DiscountAmount: discountValue,
      NetAmount: netTotal,
      Sgst: sgst,
      Cgst: cgst,
      GrandTotal: grandTotal,
      createdBy: "Admin", //localStorage.getItem("username"),
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
            /*console.log(
              "Updated Order Details Response:",
              updatedResponse?.data
            );*/
          }
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };
  const handlesave = async (data) => {
    debugger;
    const updatedFormData = formData.map((item) => ({
      ...item,
      status: data, // Set the status dynamically from the passed `data`
    }));

    if (JSON.stringify(updatedFormData) !== JSON.stringify(formData)) {
      setFormData(updatedFormData);
    }
    const parameters = {
      orderId: 0 || orderDetails?.orderId,
      itemDetails: updatedFormData,
      waiterId: 1, //localStorage.getItem("username"),
      tableId: tableId || orderDetails?.tableId,
      createdBy: "Admin", //localStorage.getItem("username"),
      customerName: userFormData.name || orderDetails.customerName,
      customerAddress: userFormData.address || orderDetails.customerAddress,
      customerPhoneNo: userFormData.mobile || orderDetails.customerPhoneNo,
      customerLocality: userFormData.locality || orderDetails.customerLocality,
      customerInfo: userFormData.info || orderDetails.customerInfo,
      orderType: "Dine-In",
    };

    try {
      debugger;
      const response = await publicAxios.post(ApiKey.OrderDetails, parameters);

      const data1 = response.data;
      const orderId = response.data?.orderId;
      setNewOrderId(orderId); // Save orderId in state
      if (response.status == 201) {
        Swal.fire({
          title: `${data}`,
          text: "Click OK to fetch updated order details.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Fetch updated order details when the user clicks OK
            const updatedResponse = await publicAxios.get(
              `orderDetail/${data1?.orderId}`
            );
            console.log(
              "Updated Order Details Response:",
              updatedResponse.data
            );
          }
        });
      }
      console.log("API Response:", data);
    } catch (error) {
      console.error("Error saving order:", error);
    }
    //console.log(orderId,"NewOrderId");
  };

  const filteredItemsofcheckout =
    orderItems.length > 0
      ? orderItems
      : groupItemDetails(orderDetails?.itemDetails || []);
  //.filter((item) => item.status !== "Food Received");
  //console.log(filteredItemsofcheckout, "filteredItemsofcheckout");
  const [checkedItems, setCheckedItems] = useState("");
  const handleCheckboxChangecheckout = (
    item,
    isChecked,
    additionalItems = []
  ) => {
    debugger;
    const itemId = item?.itemId || item?.itemid || ""; // Use itemId, fallback to itemid, or an empty string
    debugger;
    const updatedOrderItems = orderItems.map((items) =>
      items.itemId === itemId
        ? { ...items, status: isChecked ? "Food Received" : "KOT Generated" }
        : items
    );

    setOrderItems(updatedOrderItems);
    setCheckedItems((prev) => {
      // Ensure prev is always a string before splitting
      let updatedCheckedItems = prev ? prev.split(",").filter(Boolean) : [];

      // Merge "Food Received" items into the list
      const foodReceivedIds = additionalItems.map((id) => id.toString());
      updatedCheckedItems = Array.from(
        new Set([...updatedCheckedItems, ...foodReceivedIds])
      );

      if (isChecked) {
        // Add the itemId if checked
        if (itemId && !updatedCheckedItems.includes(itemId.toString())) {
          updatedCheckedItems.push(itemId.toString());
        }
      } else {
        // Remove the itemId if unchecked
        updatedCheckedItems = updatedCheckedItems.filter(
          (id) => id !== itemId.toString()
        );
      }

      // Join the array into a comma-separated string
      const updatedCheckedItemsString = updatedCheckedItems.join(",");
      //console.log("Updated checkedItems:", updatedCheckedItemsString);

      return updatedCheckedItemsString;
    });
  };

  const handlecheckout = async () => {
    debugger;

    const orderItemsUpdate = orderItems.filter(item => 
      checkedItems.split(",").includes(item.itemId.toString())
    );
    setOrderItems(orderItemsUpdate);
   const parameters = {
      OrderId: orderDetails?.orderId || newOrderId,
      ItemId: checkedItems,
      IsFoodReceived: true,
      IsCheckOut: true, // Use the checked state here
      ModifiedBy: "Admin",
    };

    try {
      // Call the API
      const response = await publicAxios.put(ApiKey.OrderDetails, parameters);
     // console.log("API Response:", response.data);
      if (response.status === 204) {
        console.log("Order updated successfully, fetching new details...");
        debugger;
        const orderId = orderDetails?.orderId || newOrderId; // Assign to a variable

        // Fetch the updated order details
        const updatedResponse = await publicAxios.get(`orderDetail/${orderId}`);
       // console.log("Updated Order Details Response:", updatedResponse.data);

        // Update the state with the new order details
        //setOrderDetails(updatedResponse.data);
        const updatedData = updatedResponse.data;
      //  console.log("Updated Order Details Response:", updatedData);

        /*const updatedItemDetails = updatedData.itemDetails.map((item) => ({
              ...item,
              isActive: checkedItems
                .split(",")
                .includes(item?.itemId?.toString()), // Set IsActive based on checked items
            }));*/
        const updatedItemDetails = updatedData.itemDetails.map((item) => ({
          ...item,
          isActive:
            item.status === "Food Received"
              ? item.isActive // Preserve the original isActive value
              : checkedItems.split(",").includes(item?.itemId?.toString()), // Set isActive based on checked items
        }));

        // Update the state with the modified item details
        setOrderDetails((prev) => ({
          ...prev,
          itemDetails: updatedItemDetails,
        }));
        //setOrderItems(updatedItemDetails);

        // setModalOpen(false);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };
  return (
    <>
      <div className="tabs-container">
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
          <div className="order-list">
            <div className="order-list-header grid-row">
              <div className="left">ITEMS</div>
              <div className="center">CHECK ITEMS</div>
              <div className="center">QTY.</div>
              <div className="right">PRICE</div>
            </div>

            {(orderItems.length > 0
              ? orderItems
              : groupItemDetails(orderDetails?.itemDetails || [])
            ).length > 0 ? (
              (orderItems.length > 0
                ? orderItems
                : groupItemDetails(orderDetails?.itemDetails || [])
              ).map((item, index) => {
             //   console.log("Rendering Item:", item); // Debugging each item
                // Pause the code execution here for inspection
                const isChecked =
                  item.status === "Food Received" ||
                  item.status === "Check Out";
                return (
                  <div
                    className={`order-item grid-row ${
                      item.isKOT ? "is-kot-item" : ""
                    }`} // Apply a special class for isKOT items
                    key={item.id}
                  >
                    <div className="order-name">
                      <i
                        className={`bx bx-x ${item.isKOT ? "disabled" : ""}`}
                        onClick={() => {
                          if (
                            orderDetails?.length > 0 ||
                            orderDetails?.orderId > 0
                          ) {
                            debugger;
                            const idToDelete = item.id; // Specify the id condition here
                            const itemIdToDelete = item.itemid; // Replace with the respective itemId from your data

                            setOrderDetails((prevDetails) => ({
                              ...prevDetails,
                              itemDetails: prevDetails.itemDetails.map(
                                (detail) =>
                                  detail.id === idToDelete &&
                                  detail.itemId === itemIdToDelete
                                    ? { ...detail, isActive: false }
                                    : detail
                              ),
                            }));
                          } else {
                            debugger;
                            setOrderItems((prev) =>
                              prev.filter((o) => o.id !== item.id)
                            );
                          }
                        }}
                      />
                      <span>{item.itemName}</span>
                    </div>
                    <div className="center">
                      <input
                        type="checkbox"
                        checked={isChecked} // Ensure default value is set
                        onChange={(e) =>
                          handleCheckboxChange(item, e.target.checked)
                        }
                      />
                    </div>
                    <div className="qty">
                      <button
                        onClick={() => {
                          debugger;
                          if (item.status==="KOT Generated") {
                            setOrderItems((prev) =>
                              prev.flatMap((order) => {
                                if (order.id === item.id) {
                                  if (order.quantity === 1) return [];
                                  return [
                                    {
                                      ...order,
                                      quantity: order.quantity - 1,
                                    },
                                  ];
                                }
                                return [order];
                              })
                            );
                          }
                          if (
                            orderDetails?.length > 0 ||
                            orderDetails?.orderId > 0
                          ) {
                            debugger;
                            const idToDelete = item.id; // Specify the id condition here
                            const itemIdToDelete = item.itemid;

                            setOrderDetails((prevDetails) => ({
                              ...prevDetails,
                              itemDetails: prevDetails.itemDetails.map(
                                (detail) => {
                                  if (
                                    detail.id === idToDelete &&
                                    detail.itemId === itemIdToDelete
                                  ) {
                                    const updatedQty = (detail.qty || 0) - 1;

                                    return {
                                      ...detail,
                                      qty: updatedQty > 0 ? updatedQty : 0, // Ensure qty is not negative
                                      isActive: updatedQty > 0, // Set isActive based on updatedQty
                                    };
                                  }
                                  return detail;
                                }
                              ),
                            }));
                          }
                        }}
                        disabled={item.status==="KOT Generated"}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        readOnly
                        value={item.quantity}
                        disabled={item.isKOT}
                      />
                      <button
                        onClick={() => {
                          if (item.status==="KOT Generated") {
                            setOrderItems((prev) =>
                              prev.map((order) =>
                                order.id === item.id
                                  ? { ...order, quantity: order.quantity + 1 }
                                  : order
                              )
                            );
                          }
                          if (
                            orderDetails?.length > 0 ||
                            orderDetails?.orderId > 0
                          ) {
                            debugger;
                            const idToDelete = item.id; // Specify the id condition here
                            const itemIdToDelete = item.itemid;

                            setOrderDetails((prevDetails) => ({
                              ...prevDetails,
                              itemDetails: prevDetails.itemDetails.map(
                                (detail) =>
                                  detail.id === idToDelete &&
                                  detail.itemId === itemIdToDelete
                                    ? {
                                        ...detail,
                                        qty: (detail.qty || 0) + 1,
                                      }
                                    : detail
                              ),
                            }));
                          }
                        }}
                        disabled={item.status==="KOT Generated"}
                      >
                        +
                      </button>
                    </div>
                    <div className="right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-order">No items in the order.</div>
            )}
          </div>
        </div>
      )}
      {["billing", "user"].includes(activeSection) && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            padding: "1rem",
            zIndex: 100,
          }}
        >
          <div className="payment-container">
         
            <div class="charges-container">
              <div class="charge-item">
                <span class="text-left">Service Charge</span>

                <input
                  type="number"
                  value={
                    orderDetails.billId > 0
                      ? orderDetails.serviceCharge.toFixed(2)
                      : serviceamount
                  }
                  onChange={(e) => {
                    debugger;
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
                  }}
                  className="input-class" // Add your custom CSS class for styling
                />
              </div>
            </div>
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
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value);
                    if (orderDetails.billId > 0) {
                      // Update parcelAmount in orderDetails
                      setOrderDetails((prev) => ({
                        ...prev,
                        parcelAmount: newValue,
                      }));
                    } else {
                      // Update parcelamount state
                      setParcelAmount(newValue);
                    }
                  }}
                  className="input-class" // Add your custom CSS class for styling
                />
              </div>
            </div>

            <div className="top-row pt-3">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={split}
                  onChange={() => setSplit(!split)}
                />
                <label>Split</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={complimentary}
                  onChange={() => setComplimentary(!complimentary)}
                />
                <label>Complimentary</label>
              </div>

              <div>
                Net Total{" "}
                <span>
                  ₹
                  {orderDetails.billId > 0
                    ? orderDetails.netAmount.toFixed(2)
                    : netTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="charges-container">
              <div className="charge-item grid grid-cols-3 gap-4 items-center ">
                {/* First Column: Discount Label */}
                <span className="text-left">Discount</span>
                {/* Second Column: Discount Type */}
                <input
                  type="number"
                  className="text-center border border-gray-300 rounded px-2 py-2 mt-2 mb-2"
                  placeholder="Enter Discount Percentage"
                  value={discountType}
                  onChange={handleDiscountTypeChange}
                />
                {/* Dropdown */}
                {discountType != "" && (
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
                )}
                {/* Third Column: Discount Value */}
                {/* <span className="text-right">₹{"0.00"}</span> */}
                <strong>Discount Value:</strong> ₹ -
                {orderDetails.billId > 0
                  ? orderDetails.discountAmount.toFixed(2)
                  : discountValue}
              </div>
            </div>
            <div class="charges-container">
              <div class="charge-item">
                <span class="text-left">CGST 9%</span>
                <span className="text-right">
                  ₹
                  {orderDetails.billId > 0
                    ? orderDetails.cgst.toFixed(2)
                    : cgst.toFixed(2)}
                </span>
              </div>
            </div>
            <div class="charges-container">
              <div class="charge-item">
                <span class="text-left">SGST 9%</span>
                <span class="text-right">
                  ₹
                  {orderDetails.billId > 0
                    ? orderDetails.sgst.toFixed(2)
                    : sgst.toFixed(2)}
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
                    : grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="radio-group">
              {["Cash", "Card", "Due", "Other", "Port"].map((method) => (
                <div className="radio-button" key={method}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <label>{method}</label>
                </div>
              ))}
            </div>

            <div className="checkbox-group">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={() => setIsPaid(!isPaid)}
                />
                <label>It's Paid</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={loyalty}
                  onChange={() => setLoyalty(!loyalty)}
                />
                <label>Loyalty</label>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={sendFeedbackSMS}
                  onChange={() => setSendFeedbackSMS(!sendFeedbackSMS)}
                />
                <label>Send Feedback SMS</label>
              </div>
            </div>
           
            <div className="button-group">
              <button  className="action-button" onClick={handlebillsave}>
                Bill
              </button>
              <div style={{ display: "none" }}>
                <BillPrint ref={billRef} billData={orderDetails || { itemDetails: [] }} />
              </div>
              <button className="action-button" onClick={handlebillprintsave}>Bill & Print</button>
              <button className="action-button" onClick={handleOpenModal}>
                Check Out
              </button>
              <button
                className="action-button-2"
                onClick={() => handlesave("KOT Generated")}
              >
                KOT
              </button>
              <button
                className="action-button-2"
                onClick={() => handlesave("KOTPrint")}
              >
                KOT & Print
              </button>
              <button
                className="action-button-2"
                onClick={() => handlesave("Hold")}
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
              <Modal.Body>
                <div className="modal-items">
                  {filteredItemsofcheckout.length > 0 ? (
                    filteredItemsofcheckout.map((item, index) => {
                      // Identify items with "Food Received" status
                      const foodReceivedItems = filteredItemsofcheckout
                        .filter((item) => item.status === "Food Received")
                        .map((item) => item.itemid || item.itemId);
                      // console.log(item, "filteredItemsofcheckoutitem");
                      const itemId = item.itemid || item.itemId;
                      const isChecked =
                        item.status === "Food Received" ||
                        checkedItems.split(",").includes(itemId?.toString());
                      return (
                        <div key={index} className="modal-item">
                          {/*<input
                            type="checkbox"
                            checked={checkedItems
                              .split(",")
                              .includes(
                                (item.itemId || item.itemid)?.toString()
                              )}
                            onChange={(e) =>
                              handleCheckboxChangecheckout(
                                { itemId: item.itemId, itemid: item.itemid }, // Explicitly pass both IDs
                                e.target.checked,
                                foodReceivedItems
                              )
                            }
                          />*/}
                          <input
                            type="checkbox"
                            checked={isChecked} // Bind dynamically
                            onChange={(e) =>
                              handleCheckboxChangecheckout(
                                { itemId: item.itemId, itemid: item.itemid }, // Explicitly pass both IDs
                                e.target.checked, foodReceivedItems
                              )
                            }
                          />
                          <span className="px-2">{item.itemName}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div>No items to display.</div>
                  )}
                </div>
              </Modal.Body>
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
      )}
    </>
  );
};

export default Tabs;
