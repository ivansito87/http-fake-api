import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import * as Sentry from "@sentry/browser";

Sentry.init({ dsn: "https://ef9eadad234a407f82ab49e1649c6824@sentry.io/1660738" });
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
