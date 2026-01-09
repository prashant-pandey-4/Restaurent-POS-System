// pos-frontend/src/index.js (Assuming you use Vite/main.jsx structure)

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // Redux Provider
import { BrowserRouter } from "react-router-dom"; // Router
import store from "./store/store";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Redux Provider wraps the entire app */}
    <Provider store={store}>
      {/* BrowserRouter enables routing for the App component */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
