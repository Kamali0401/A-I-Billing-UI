import React, { useState, useEffect } from "react";
import axios from "axios";
import { ApiKey } from "../../api/endpoints";
import { publicAxios } from "../../api/config";
const mealTypes = ["Breakfast", "Lunch", "Dinner"];

export default function ReportFilterPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [item, setItem] = useState("");
  const [mealType, setMealType] = useState("");
const [isVeg, setIsVeg] = useState(null); // true, false, or null
const [showReportButtons, setShowReportButtons] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);

 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await publicAxios.get(ApiKey.InventoryCost);
     setData(response.data);
    //  console.log("Categories Response:", response.data);

      const uniqueCategories = [...new Set(response.data.map((i) => i.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);


const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setSubcategory("");
    setItem("");

    // Filter subcategories
    const filteredSubcats = data
      .filter((i) => i.category === selectedCat)
      .map((i) => i.subCategory);
    const uniqueSubcats = [...new Set(filteredSubcats)];
    setSubcategories(uniqueSubcats);
    setItems([]);
  };

  const handleSubcategoryChange = (e) => {
    debugger;
    const selectedSub = e.target.value;
    setSubcategory(selectedSub);
    setItem("");

    // Filter items
    const filteredItems = data
      .filter((i) => i.category === category && i.subCategory === selectedSub)
      .map((i) => i.itemName);
    const uniqueItems = [...new Set(filteredItems)];
    setItems(uniqueItems);
  };

 const handleItemChange = (e) => {
  const selectedItem = e.target.value;
  setItem(selectedItem);

  const found = data.find(
    (i) =>
      i.category === category &&
      i.subCategory === subcategory &&
      i.itemName === selectedItem
  );

  if (found) {
    setIsVeg(found.isVeg);
  } else {
    setIsVeg(null);
  }
};

  const handleSubmit = async (data) => {
  try {
    debugger;
    const response = await publicAxios.get(ApiKey.Report, {
      params: {
        reportType:data,
        startDate: startDate || null,
        endDate: endDate || null,
        category: category || null,
        subCategory: subcategory || null,
        itemName: item || null,
       // isVeg: isVeg === true ? true : isVeg === false ? false : null
       isVeg: category ? (isVeg === true ? true : isVeg === false ? false : null) : null
      },
      responseType: 'blob'
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'SoldItemsReport.xlsx';
    link.click();
  } catch (error) {
    console.error('Failed to download report:', error);
    alert('Failed to download report.');
  }
};



  return (
    <div className="custom-container border border-dark rounded p-4 mt-4  mx-5">
      <div className="row mb-4">
        {/* Start Date */}
        <div className="col-lg-3">
          <p className="m-0">Start Date</p>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
       

        {/* End Date */}
      
        <div className="col-lg-3">
          <p className="m-0">End Date</p>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
              min={startDate} // 👈 restricts date selection from startDate onward
          />
        </div>
        

        <div className="col-lg-3 mb-3">
          <label>Category</label>
          <select className="form-control" value={category} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {category && (
          <div className="col-lg-3 mb-3">
            <label>Subcategory</label>
            <select className="form-control" value={subcategory} onChange={handleSubcategoryChange}>
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Items */}
        {subcategory && (
          <div className="col-lg-3 mb-3">
            <label>Item</label>
            <select className="form-control" value={item} onChange={handleItemChange}>
              <option value="">Select Item</option>
              {items.map((itm) => (
                <option key={itm} value={itm}>
                  {itm}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Meal Type */}
        {item && isVeg !== null && (
  <div className="col-lg-3 mb-3">
    <label>Type</label>
    <input
      className="form-control"
      value={isVeg ? "Veg" : "Non-Veg"}
      readOnly
    />
  </div>
)}
      </div>

      {/* Submit Button */}
         <div className="row mb-4 ">
            <div className="col-lg-3">
        <button className="btn btn-success" onClick={() => setShowReportButtons(true)}>
          Get Reports
        </button>
        </div>
         {/* Conditional Buttons after Submit */}
     {showReportButtons && (
  <div className="row mt-4 mb-4">
    
      <div className="card p-4 shadow-sm border bg-light">
        
        <div className="row">
          <div className="col-lg-6 mb-2">
            <button className="btn btn-success w-100" onClick={() => handleSubmit("item")}>
              Item Report
            </button>
          </div>
          <div className="col-lg-6 mb-2">
            <button className="btn btn-success w-100" onClick={() => handleSubmit("sales")}>
              Sales Report
            </button>
          </div>
        </div>
      </div>
   
  </div>
)}

      </div>
    </div>
  );
}
