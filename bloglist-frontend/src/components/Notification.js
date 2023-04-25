import { useNotificationMessage } from "../NotificationContext";

const Notification = () => {
  let notifStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const notification = useNotificationMessage();

  if (notification.isError === true) {
    notifStyle = {
      ...notifStyle,
      color: "red",
    };
  }

  return (
    notification.message && <div style={notifStyle}>{notification.message}</div>
  );
};

export default Notification;
