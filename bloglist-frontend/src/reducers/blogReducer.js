import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    increaseLike(state, action) {
      const id = action.payload;
      const blogToChange = state.find((a) => a.id === id);

      blogToChange.likes += 1;
    },
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { increaseLike, setBlogs, appendBlog, removeBlog } =
  blogSlice.actions;

export default blogSlice.reducer;
