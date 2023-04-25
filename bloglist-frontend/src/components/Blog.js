import { useDispatch } from "react-redux";
import { useMutation } from "react-query";

import blogService from "../services/blogs";
import { useNotificationDispatch } from "../NotificationContext";
import { increaseLike, removeBlog } from "../reducers/blogReducer";
import { useEffect, useState } from "react";

const Blog = ({ blog, currentUser, result }) => {
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const getComments = async () => {
      let comments;
      if (blog) {
        comments = await blogService.getComments(blog.id);
      }
      setComments(comments);
    };
    getComments();
  }, [blog]);

  const notificationDispatch = useNotificationDispatch();
  const dispatch = useDispatch();

  const updateBlogMutation = useMutation(blogService.update, {
    onSuccess: (updatedBlog) => {
      dispatch(increaseLike(updatedBlog.id));
    },
  });

  const updateBlog = async (objectId) => {
    updateBlogMutation.mutate(objectId);
  };

  const deleteBlogMutation = useMutation(blogService.remove, {
    onSuccess: (removedBlogId) => {
      dispatch(removeBlog(removedBlogId));
    },
  });

  const deleteBlog = async (objectId) => {
    deleteBlogMutation.mutate(objectId);
  };

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const user = blog.user;
  const deleteAuth = user.username === currentUser.username;

  const addLike = async () => {
    try {
      const newLikes = blog.likes + 1;

      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: newLikes, // for saving in backend
        user: user.id,
      };

      await updateBlog(blog.id);
      notificationDispatch({
        type: "LIKE_BLOG",
        payload: updatedBlog,
      });
      setTimeout(
        () =>
          notificationDispatch({
            type: "REMOVE_NOTIFICATION",
          }),
        5000
      );
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

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        deleteBlog(blog.id);
        notificationDispatch({
          type: "DELETE_BLOG",
          payload: blog,
        });
        setTimeout(
          () =>
            notificationDispatch({
              type: "REMOVE_NOTIFICATION",
            }),
          5000
        );
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
    }
  };

  const addComment = async () => {
    const newComment = await blogService.addComment(blog.id, comment);
    setComments(comments.concat(newComment));
    setComment("");
  };

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>
      <div id="blog-details">
        <div>{blog.url}</div>
        <div>
          <span>{blog.likes} likes</span>
          <button type="button" onClick={addLike}>
            like
          </button>
        </div>
        <div>added by {user.name}</div>
        {deleteAuth && (
          <button className="remove" onClick={handleDelete}>
            remove
          </button>
        )}
      </div>
      <h3>comments</h3>
      <div>
        <input
          id="comment"
          type="text"
          value={comment}
          name="Comment"
          placeholder="add comment here..."
          onChange={({ target }) => setComment(target.value)}
        ></input>
        <button onClick={addComment}>add comment</button>
      </div>
      {comments && (
        <ul>
          {comments.map((c) => (
            <li key={c.id}>{c.comment}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Blog;
