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

  //  Get all reviews with user id
  getReviewsByUserId(userId) {
    return apiClient.get("reviews/user/" + userId);
  },

  //  Create a review
  addReview(review) {
    return apiClient.post("reviews", review);
  },

  //  Update the review with id
  updateReview(reviewId, review) {
    return apiClient.put("reviews/" + reviewId, review);
  },

  //  Delete review with id
  deleteReview(reviewId) {
    return apiClient.delete("reviews/" + reviewId);
  },

  //  Delete ALL reviews
  deleteReview(reviewId) {
    return apiClient.delete("reviews");
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  //  ADMIN tools:

  //  Bulk create reviews
  bulkCreateReviews(reviews) {
    return apiClient.post("reviews/bulkCreate");
  },

};
