import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, Route, Routes, useMatch } from "react-router-dom";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Bloglist from "./components/Bloglist";
import User from "./components/User";
import UserBloglist from "./components/UserBloglist";
import userService from "./services/users";
import Blog from "./components/Blog";

import blogService from "./services/blogs";
import { setBlogs } from "./reducers/blogReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const setCredentials = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const loginForm = () => {
    return <LoginForm setCredentials={setCredentials} />;
  };

  const result = useQuery("blogs", blogService.getAll, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const blogs = result.data;

  useEffect(() => {
    dispatch(setBlogs(result.data));
  }, [result.data, dispatch]);

  const userResult = useQuery("users", userService.getAll, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const users = userResult.data;

  const userMatch = useMatch("/users/:id");
  let userQuery;
  if (!userResult.isLoading) {
    userQuery = userMatch
      ? users.find((user) => user.id === userMatch.params.id)
      : null;
  }

  const blogMatch = useMatch("/blogs/:id");
  let blogQuery;
  if (!result.isLoading) {
    blogQuery = blogMatch
      ? blogs.find((blog) => blog.id === blogMatch.params.id)
      : null;
    // if (blogMatch) {
    //   blogs.forEach((blog) => {
    //     if (blog.id === blogMatch.params.id) {
    //       console.log("tite");
    //       console.log(blog.id);
    //       console.log(blogMatch.params.id);
    //     }
    //   });
    // }
  }
  const Home = () => {
    return !user && loginForm();
  };

  return (
    <>
      <Notification />
      {user && (
        <div>
          <Link to="/blogs">blogs</Link>
          <Link to="/users">users</Link>
          {user.name} logged in
          <Link to="/">
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </Link>
        </div>
      )}
      <h2>blog app</h2>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/blogs"
          element={user && <Bloglist user={user} result={result} />}
        />
        <Route
          path="/blogs/:id"
          element={<Blog blog={blogQuery} currentUser={user} result={result} />}
        />
        <Route
          path="/users"
          element={<User users={users} result={userResult} />}
        />
        <Route
          path="/users/:id"
          element={<UserBloglist user={userQuery} result={userResult} />}
        />
      </Routes>
    </>
  );
};

export default App;
