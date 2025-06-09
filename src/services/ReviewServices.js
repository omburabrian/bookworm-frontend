import apiClient from "./services";

export default {

  //  Get ALL reviews
  getReviews() {
    return apiClient.get("reviews");
  },

  //  Get the review with id
  getReview(id) {
    return apiClient.get("reviews/" + id);
  },

  //  Get the review with id
  getReviewForUserBook(userId, bwBookId) {
    return apiClient.get("reviews/users/" + userId + '/books/' + bwBookId);
  },

  //  Get all reviews with user id
  getReviewsByUserId(userId) {
    return apiClient.get("reviews/user/" + userId);
  },

  //  Create a review
  addReview(review) {
    return apiClient.post("reviews", review);
  },

  //  Update review with user ID, book ID
  updateReviewForUserIdBookId(userId, bookId, review) {
    return apiClient.put(
      "reviews/users/" + userId + "/books/" + bookId,
      review
    );
  },

  //  ToDo:  Remove this.  This bridge table requires both, user ID and book ID.
  //  Update the review with id
  updateReview(reviewId, review) {
    return apiClient.put("reviews/" + reviewId, review);
  },

  //  ToDo:  Remove this.  This bridge table requires both, user ID and book ID.
  //  Delete review with id
  deleteReview(reviewId) {
    return apiClient.delete("reviews/" + reviewId);
  },

  //  Delete review with user ID, book ID
  deleteReviewForUserIdBookId(userId, bookId) {
    return apiClient.delete("reviews/users/" + userId + "/books/" + bookId);
  },

  //  Delete ALL reviews
  deleteAllReviews() {
    return apiClient.delete("reviews");
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //  ADMIN tools:

  //  Bulk create reviews
  bulkCreateReviews(reviews) {
    return apiClient.post("reviews/bulkCreate");
  },

};
