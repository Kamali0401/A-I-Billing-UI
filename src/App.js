import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import { store, persistor } from "./app/redux/store"; // Import both store and persistor
import AppRoute from "./app/routes";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./app/context/themecontext";
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider>
        <div className="App">
        <ToastContainer />
          <AppRoute />
        </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
