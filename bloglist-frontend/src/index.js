import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

import { store } from "./store";
import { NotificationContextProvider } from "./NotificationContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <Router>
          <App />
        </Router>
      </NotificationContextProvider>
    </QueryClientProvider>
  </Provider>
);
