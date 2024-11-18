import React from "react";
import ReactDOM from "react-dom/client"; // Updated to React 18
import App from "./App"; // Import the main App component

// Create a root for rendering the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
