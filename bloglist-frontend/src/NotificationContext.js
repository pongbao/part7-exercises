import { useReducer, createContext, useContext } from "react";
import notificationReducer from "./reducers/notificationReducer";

const NotificationContext = createContext();

export const useNotificationMessage = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  return notificationAndDispatch[1];
};

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {
    message: null,
    isError: null,
  });

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
