import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";

import { appendBlog } from "../reducers/blogReducer";
import blogService from "../services/blogs";

const Bloglist = ({ result }) => {
  const blogFormRef = useRef();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const blogs = useSelector((state) =>
    state.blog.map((blog) => blog).sort((a, b) => b.likes - a.likes)
  );

  const newBlogMutation = useMutation(blogService.create, {
    onSuccess: (newBlog) => {
      dispatch(appendBlog(newBlog));
      queryClient.invalidateQueries("blogs"); //
    },
  });

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    newBlogMutation.mutate(blogObject);
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  if (result.isError) {
    return <div>blog service not available due to server problems</div>;
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Toggleable>
      {blogs.map((blog) => (
        <div key={blog.id} className="blog" style={blogStyle}>
          <Link to={blog.id}>{blog.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Bloglist;
