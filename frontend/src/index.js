import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="246395818502-o1m0s49ng3pdrfndi2q4osssg0kpjbui.apps.googleusercontent.com">
      <App />
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
