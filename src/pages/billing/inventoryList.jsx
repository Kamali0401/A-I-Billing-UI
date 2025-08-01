import React, { useState, useEffect } from "react";
import { ApiKey } from "../../api/endpoints";
import { authAxios, publicAxios } from "../../api/config";
import { useMemo } from "react";
import Tabs from "./tabs";
import { tabledetailSlice } from "../../app/redux/slice/tabledetails/tabledetailSlice";
const InventoryList = ({ orderDetails, setOrderDetails, tableId, tableCatagory, tableCode ,seatId}) => {
  const [itemOpt, setitemOpt] = useState([]); // To hold the items
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [subcatagoryId, setsubcatagoryId] = useState("");
  const [subcatagoryName, setsubcatagoryName] = useState("");
  const [subCategories, setsubCategories] = useState([]);
  const [UniqueCategories, setUniqueCategories] = useState([]);
  const [CategoryOpt, setCategoryOpt] = useState([]);
  const [subcatagoryOpt, setsubcatagoryOpt] = useState([]);
  const [searchByName, setSearchByName] = useState("");
  const [searchByCode, setSearchByCode] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [categoryName, setcategoryName] = useState(null);

  const onClick = () => {
    setcategoryName(true);
    setShowSubcategory(false); // Reset subcategory visibility when "Food" is clicked
  };
  const clearState = (type) => {
    switch (type) {
      case "category":
        setsubcatagoryName("");
        break;
      case "subcatagory":
        setsubcatagoryId("");
        setsubcatagoryName("");
        break;
      default:
        break;
    }
  };
  const _onChange = ({ key, data }) => {
    const functionallity = {
      category: (data) => {
        setcategoryName(data);
        clearState("category");
      },

      subcatagory: (data) => {
        setsubcatagoryName(data);
        // setsubcatagoryName(subcatagoryOpt.filter(x=>x.id ==data)[0].subcatagory);
      },
    };
    functionallity[key](data);
  };
  const getCategoryFun = async (isSubscribed) => {
    try {
      if (!isSubscribed) {
        return;
      }

      const response = await publicAxios.get(ApiKey.InventoryCost);

      setCategoryOpt(response.data); // Assuming API.getCategories fetches category data

      const uniqueValues = [
        ...new Set(response.data.map((item) => item.category)),
      ];
   //   console.log("Fetched Categories:", response.data);

      setUniqueCategories(uniqueValues);
    //  console.log("Fetched Categories:", response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getSubcategoryFun = async (isSubscribed) => {
    try {
      if (isSubscribed && categoryName) {
        const subcatagoryData = CategoryOpt.filter(
          (x) => x.category == categoryName
        );

        const uniqueValues = [
          ...new Set(subcatagoryData.map((item) => item.subCategory)),
        ];

      //  console.log("Selected categoryName:", categoryName);
      //  console.log("Derived Subcategories:", uniqueValues);

        setsubcatagoryOpt(uniqueValues);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let isSubscribed = true;
    if (CategoryOpt.length > 0) {
      getItemFun(isSubscribed);
    }
    return () => {
      isSubscribed = false;
    };
  }, [CategoryOpt, subcatagoryName]);
  
  const getItemFun = async (isSubscribed) => {
    try {
      if (isSubscribed) {
        let itemData;
  
        if (subcatagoryName) {
          itemData = CategoryOpt.filter(
            (x) => x.subCategory === subcatagoryName
          );
       //   console.log("Filtered by Subcategory:", itemData);
        } else {
          itemData = CategoryOpt; // Show all items by default
       //   console.log("Showing all items:", itemData);
        }
  
        setitemOpt(itemData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    let isSubscribed = true;
    getCategoryFun(isSubscribed);
    return () => (isSubscribed = false);
  }, []);
  useEffect(() => {
    let isSubscribed = true;
    getSubcategoryFun(isSubscribed);
    return () => (isSubscribed = false);
  }, [categoryName]);
  // useEffect(() => {
  //   let isSubscribed = true;
  //   getItemFun(isSubscribed);
  //   return () => (isSubscribed = false);
  // }, [subcatagoryName]);
  const filteredItems = useMemo(() => {
    return itemOpt.filter((item) => {
      const matchCategory =
        selectedCat !== null && selectedCat !== undefined
          ? item.subCategory?.categoryId === selectedCat
          : true;

      const matchSubCategory =
        selectedSubCat !== null && selectedSubCat !== undefined
          ? item.subCategory?.subCategoryId === selectedSubCat
          : true;

      const matchName =
        searchByName && searchByName.trim() !== ""
          ? item.itemName?.toLowerCase().includes(searchByName.trim().toLowerCase())
          : true;

      const matchCode =
        searchByCode && searchByCode.trim() !== ""
          ? item.itemCode?.toLowerCase().includes(searchByCode.trim().toLowerCase())
          : true;

      return matchCategory && matchSubCategory && matchName && matchCode;
    });
  }, [itemOpt, selectedCat, selectedSubCat, searchByName, searchByCode]);

 // console.log(filteredItems, "......filteredItems");

  const handleAddItem = (item) => {
    debugger;
    const itemPrice = item.cost || 0.00;
    let serialNumber = 1; // Start with serial number 1

    // Check if orderDetails exists and has a valid orderId
    if (orderDetails?.itemDetails?.length > 0) {

      const existingItem = orderDetails.itemDetails.find(
        (detail) => detail.itemId === item.id && detail.status === "Hold" && detail.isActive=== true
      );

      if (existingItem) {
        console.log(
          `Item with ID ${item.id} and status "Hold" already exists. Skipping addition.`
        );
        return; // Prevent adding duplicate item
      }

      // If orderDetails already has items, calculate the next serial number
      serialNumber = (orderDetails?.itemDetails || [])?.length + 1;

      // Add new item with serial number
      setOrderDetails((prevDetails) => ({
        ...prevDetails,
        itemDetails: [
          ...(prevDetails?.itemDetails || []),
          {
            id: serialNumber, // Use serial number as the ID
            orderId: prevDetails.orderId,
            itemId: item.id,
            itemCode: item.itemCode,
            itemName: item.itemName,
            qty: 1,
            price: itemPrice,
            status: "Hold",
            isActive: true,
            itemComment:"",
          },
        ],
      }));
    } else {
      // If orderDetails is not initialized, initialize it with defaults and the new item
      setOrderDetails({
        id: 0,
        orderId: 0,
        waiterId: 0,
        orderTypeId: 0,
        tableId: tableId, // Assuming tabledetailSlice is defined elsewhere
        customerId: 0,
        createdBy: "",
        createdDate: new Date().toISOString(),
        modifiedBy: "",
        modifiedDate: new Date().toISOString(),
        tableCatagory: "",
        tableCode: "",
        customerName: "",
        customerAddress: "",
        customerPhoneNo: "",
        customerLocality: "",
        customerInfo: "",
        orderType: "",
        orderSubType: "",
        waiterName: "",
        billId: 0,
        discountId: 0,
        paymentMode: "",
        isParcelRequired: false,
        noofPerson:0,
        parcelAmount: 0.0,
        serviceCharge: 0.0,
        discountAmount: 0.0,
        netAmount: 0.0,
        cgst: 0.0,
        sgst: 0.0,
        grandTotal: 0.0,
        subTotal: 0.0,
        isPaymentDone: false,
        itemDetails: [
          {
            id: serialNumber, // Serial number for the first item
            orderId: 0,
            itemId: item.id,
            itemCode: item.itemCode,
            itemName: item.itemName,
            qty: 1,
            price: itemPrice,
            status: "Hold", // Initial status
            isActive: true,
            itemComment:"",
          },
        ],
      });
    }
  };


  return (
    <>
      <div className="left-column1" style={{ flex: 1 }}>
        <div className="menu-container ">
          <div className="menu-item">
            <select
              className="select-box"
              onChange={(e) =>
                _onChange({ key: "category", data: e.target.value })
              }
              value={categoryName}
            >
              <option>
                {UniqueCategories?.length > 0 ? "Main Menu" : "No Options"}
              </option>
              {UniqueCategories?.length > 0 &&
                UniqueCategories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>

          <div className="menu-item">
            {categoryName && (
              <select
                className="select-box"
                onChange={(e) =>
                  _onChange({ key: "subcatagory", data: e.target.value })
                }
                value={subcatagoryName}
              >
                <option>
                  {subcatagoryOpt?.length > 0
                    ? "Select SubMenu"
                    : "No Sub Menu"}
                </option>
                {subcatagoryOpt?.length > 0 &&
                  subcatagoryOpt.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>

        <div className="search-box">
          <input
            className="search-input"
            placeholder="Search by name"
            value={searchByName}
            onChange={(e) => setSearchByName(e.target.value)}
          />
          <input
            className="search-input"
            placeholder="Search by code"
            value={searchByCode}
            onChange={(e) => setSearchByCode(e.target.value)}
          />
        </div>
        {itemOpt?.length > 0 ? (
          <div className="items-container">
            {filteredItems?.length > 0 ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  className="item-button"
                  style={{
                    borderLeft: `4px solid ${item.isVeg ? "green" : "red"}`,
                    cursor: orderDetails?.itemDetails?.some(item => item.status === "Check Out") ? "not-allowed" : "pointer"
                  }}
                 // onClick={() => handleAddItem(item)}
                 onClick={
                  orderDetails?.itemDetails?.some(item => item.status === "Check Out")
                    ? undefined
                    : () => handleAddItem(item)
                }
                disabled={orderDetails?.itemDetails?.some(item => item.status === "Check Out")}
                >
                  <div className="item-name">{item.itemName}</div>
                  <div className="item-price">
                    <span className="item-cost">{item.itemCode}</span>
                    <span className="item-code">
                      ₹{item.cost != null ? item.cost : "0.00"}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="no-items">No matching items found.</div>
            )}
          </div>
        ) : (
          <div className="no-items">No items available.</div>
        )}
      </div>
      <div className="right-column1" style={{ flex: 2 }}>
        <Tabs
          orderDetails={orderDetails}
          setOrderDetails={setOrderDetails}
          orderItems={orderItems}
          setOrderItems={setOrderItems}
          tableId={tableId}
          tableCatagory={tableCatagory}
          tableCode={tableCode} 
          seatId={seatId}
          />
      </div>
    </>
  );
};

export default InventoryList;
