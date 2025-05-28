// src/services/authorService.js
import apiClient from "./services";

export default {
  getAuthors() {
    return apiClient.get("authors");
  },

  getAuthor(id) {
    return apiClient.get("authors/" + id);
  },
  addAuthor(author) {
    return apiClient.post("authors", author);
  },
  updateAuthor(author) {
    return apiClient.put("authors/" + author.authorId, author);
  },
  deleteAuthor(id) {
    return apiClient.delete("authors/" + id);
  },
  searchAuthorsByName(name) {
    return apiClient.get(`authors/name/${encodeURIComponent(name)}`);
  },
};
