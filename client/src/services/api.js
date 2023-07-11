import { callEndpoint, callPrivateEndpoint } from "./callEndpoint.js";

const accessToken = localStorage.getItem("accessToken");

export const register = (name, email, password) => {
  return callEndpoint(`/register`, {
    method: "POST",
    data: {
      name,
      email,
      password,
    },
  });
};

export const loginUser = (email, password) => {
  return callEndpoint(`/login`, {
    method: "POST",
    data: {
      email,
      password,
    },
  });
};

export const getPosts = () => {
  return callEndpoint("/posts");
};

export const getPost = (id, userId) => {
  return callEndpoint(`/post/${id}/${userId}`);
};

export const getUser = (email, accessToken) => {
  return callEndpoint(`/user/${email}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUserProfile = (handle) => {
  return callEndpoint(`/profile/${handle}`);
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

export const isUsernameAvailable = (username) => {
  return callEndpoint(`/userAvailable/${username}`);
};

export const createPost = (axiosPrivate, userId, title, message) => {
  return callPrivateEndpoint(axiosPrivate, `/post`, {
    method: "POST",
    data: {
      userId,
      title,
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

export const checkFollower = (followerId, followingId) => {
  return callEndpoint(
    `/followers/check?followerId=${followerId}&followingId=${followingId}`
  );
};

export const addFollower = (followerId, followingId) => {
  return callEndpoint(`/followers/add`, {
    method: "POST",
    data: { followerId, followingId },
  });
};

export const removeFollower = (followerId, followingId) => {
  return callEndpoint(`/followers/remove`, {
    method: "POST",
    data: { followerId, followingId },
  });
};

export const getMessages = (userId) => {
  return callEndpoint(`/messages`, {
    method: "GET",
    data: { userId },
  });
};

export const searchUsers = (query, userId) => {
  return callEndpoint(`/search?q=${query}`, {
    method: "POST",
    data: { userId },
  });
};

export const startChat = (axiosPrivate, participants) => {
  return callPrivateEndpoint(axiosPrivate, "/startChat", {
    method: "POST",
    data: { participants },
  });
};

export const getAllChats = (axiosPrivate) => {
  return callPrivateEndpoint(axiosPrivate, "/chats");
};

export const getChatMessages = (axiosPrivate, chatId) => {
  return callPrivateEndpoint(axiosPrivate, `/chats/${chatId}/messages`);
};
