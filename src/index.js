import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ToggleColorModeProvider from "./utils/ToggleColorMode";
// Redux
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <Provider store={store}>
    <ToggleColorModeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToggleColorModeProvider>
  </Provider>,
  document.getElementById("root")
);
