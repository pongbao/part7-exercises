/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import { React } from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

let container;

beforeEach(() => {
  const blog = {
    id: 1,
    title: "This is a blog",
    author: "me",
    url: "www.example.com",
    likes: 4,
    user: {
      username: "edutilos",
    },
  };

  const user = {
    username: "edutilos",
  };

  const handleNotif = jest.fn();
  const updateBlog = jest.fn();
  const deleteBlog = jest.fn();

  container = render(
    <Blog
      key={blog.id}
      blog={blog}
      handleNotif={handleNotif}
      updateBlog={updateBlog}
      deleteBlog={deleteBlog}
      currentUser={user}
    />
  ).container;
});

test("renders title and author but not url or number of likes by default", () => {
  screen.getByText("This is a blog me");

  const div = container.querySelector("#blog-details");
  expect(div).toHaveStyle("display: none");
});

test("url and number of likes shown when view button is clicked", async () => {
  const user = userEvent.setup();
  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const div = container.querySelector("#blog-details");
  expect(div).not.toHaveStyle("display: none");
});

test("click event handler is called twice if the like button is clicked twice", async () => {
  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const div = container.querySelector("#blog-details");
  expect(div).not.toHaveStyle("display: none");

  const likeButton = screen.getByText("like");

  const addLike = jest.fn();
  likeButton.onclick = addLike;

  await user.click(likeButton);
  await user.click(likeButton);

  expect(addLike.mock.calls).toHaveLength(2);
});
