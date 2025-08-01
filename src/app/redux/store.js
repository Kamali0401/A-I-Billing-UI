import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
//import thunk from "redux-thunk";
import inventoryslice  from "./slice/inventory/inventorySlice";
import  inventoryCostslice  from "./slice/inventoryCost/inventoryCostSlice";
import tabledetailSlice  from "./slice/tabledetails/tabledetailSlice";
import userSlice  from "./slice/user/userSlice";
import roleSlice  from "./slice/role/roleSlice";
import tableSlice  from "./slice/tabletype/tabletypeSlice";
import dicountSlice  from "./slice/discount/discountSlice";
import profileSlice  from "./slice/profile/profileSlice";
import  billingSlice  from "./slice/billing/billingslice";
import resetPassword from "./slice/resetPassword/resetpasswordSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only 'auth' slice will be persisted
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    inventoryList: inventoryslice,
    inventoryCostList:inventoryCostslice,
    tabledetailList:tabledetailSlice,
    userList:userSlice,
    roleList:roleSlice,
    tableList:tableSlice,
    discountList:dicountSlice,
    profileList:profileSlice,
    BillingList: billingSlice,
      resetPassword:resetPassword,


})
);
    
    
    const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
       
        serializableCheck: false, // Ignore check for non-serializable values
      }).concat(logger), // Add logger middleware
  });
  
  const persistor = persistStore(store);
  
  export { store, persistor };