// src/services/BookService.js
import apiClient from "./services";

export default {
  getBooks() {
    return apiClient.get("books");
  },

  getBook(id) {
    return apiClient.get("books/" + id);
  },

  addBook(book) {
    return apiClient.post("books", book);
  },

  updateBook(book) {
    return apiClient.put("books/" + book.id, book); 
  },

  deleteBook(id) {
    return apiClient.delete("books/" + id);
  }
};
