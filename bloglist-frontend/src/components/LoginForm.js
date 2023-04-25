import { useState } from "react";
import loginService from "../services/login";
import blogService from "../services/blogs";
import PropTypes from "prop-types";
import { useNotificationDispatch } from "../NotificationContext";

const LoginForm = ({ setCredentials }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const notificationDispatch = useNotificationDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setCredentials(user);
      notificationDispatch({
        type: "LOGIN_SUCCESS",
      });
      setTimeout(
        () =>
          notificationDispatch({
            type: "REMOVE_NOTIFICATION",
          }),
        5000
      );
      setUsername("");
      setPassword("");
    } catch (error) {
      notificationDispatch({
        type: "ERROR",
        payload: error.response.data.error,
      });
      setTimeout(
        () =>
          notificationDispatch({
            type: "REMOVE_NOTIFICATION",
          }),
        5000
      );
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setCredentials: PropTypes.func.isRequired,
};

export default LoginForm;
