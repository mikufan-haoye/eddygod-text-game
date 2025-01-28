import { Provider } from "@/components/ui/provider";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Theme } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <Theme minHeight="100vh" appearance="dark" colorPalette="teal">
        <Router>
          <App />
        </Router>
      </Theme>
    </Provider>
  </React.StrictMode>
);