import http from "../http-common";

const getUserBooks = (userId) => {
  return http.get(`/bookwormapi/userBooks/${userId}`);
};

const removeUserBook = (userId, bookId) => {
  return http.delete(`/bookwormapi/userBooks/`, {
    data: { userId, bookId }
  });
};

export default {
  getUserBooks,
  removeUserBook
};
