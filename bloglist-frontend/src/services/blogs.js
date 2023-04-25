import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (objectId) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl);
  const blogToUpdate = response.data.find((a) => a.id === objectId);

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  };

  await axios.put(`${baseUrl}/${objectId}`, updatedBlog, config);

  return updatedBlog;
};

const remove = async (objectId) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${objectId}`, config);

  return objectId;
};

const getComments = async (objectId) => {
  const request = await axios.get(`${baseUrl}/${objectId}/comments`);
  return request.data;
};

const addComment = async (objectId, comment) => {
  const newComment = { comment: comment };
  const response = await axios.post(
    `${baseUrl}/${objectId}/comments`,
    newComment
  );
  return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  setToken,
  create,
  update,
  remove,
  getComments,
  addComment,
};
