import { callEndpoint } from "./callEndpoint.js";

export const getPosts = () => {
  return callEndpoint("/posts");
};

export const getPost = (id, userId) => {
  return callEndpoint(`/post/${id}/${userId}`);
};

export const getUser = (email) => {
  return callEndpoint(`/user/${email}`);
};

export const createUser = (username, email) => {
  return callEndpoint(`/user`, {
    method: "POST",
    data: {
      username,
      email,
    },
  });
};

export const createPost = (userId, message) => {
  return callEndpoint(`/post`, {
    method: "POST",
    data: {
      userId,
      message,
    },
  });
};

export const createComment = ({ userId, postId, message, parentId }) => {
  return callEndpoint(`posts/${postId}/comments`, {
    method: "POST",
    data: { userId, message, parentId },
  });
};

export const updateComment = ({ userId, postId, message, id }) => {
  return callEndpoint(`posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { userId, message },
  });
};

export const deleteComment = ({ postId, id }) => {
  return callEndpoint(`posts/${postId}/comments/${id}`, {
    method: "DELETE",
  });
};

export const toggleLike = ({ userId, postId, id }) => {
  return callEndpoint(`posts/${postId}/comments/${id}/toggleLike`, {
    method: "POST",
    data: { userId },
  });
};
