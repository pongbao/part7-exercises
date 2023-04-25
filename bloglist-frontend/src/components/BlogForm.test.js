import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<NoteForm /> updates parent state and calls onSubmit", async () => {
  const handleNotif = jest.fn();
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} handleNotif={handleNotif} />);

  const titleInput = screen.getByPlaceholderText("enter title...");
  const authorInput = screen.getByPlaceholderText("enter author...");
  const urlInput = screen.getByPlaceholderText("enter url...");
  const submitButton = screen.getByText("create");

  await user.type(titleInput, "New Blog");
  await user.type(authorInput, "Some Author");
  await user.type(urlInput, "www.url.com");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("New Blog");
  expect(createBlog.mock.calls[0][0].author).toBe("Some Author");
  expect(createBlog.mock.calls[0][0].url).toBe("www.url.com");
});
