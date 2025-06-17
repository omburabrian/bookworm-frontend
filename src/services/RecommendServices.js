import apiClient from "./services";

const mockBookList = [
    {
        title: "Book One",
        author: [
            {
                name: "Doe, John"
            },
            {
                name: "Peterman, Jay"
            }
        ],
        description: "This is a mystery."
    },
    {
        title: "Book Two",
        author: [
            {
                name: "Doe2, John2"
            },
        ],
        description: "This is a science fiction story."
    },
    {
        title: "Book Three",
        author: [
            {
                name: "Doe3, John3"
            },
            {
                name: "Peterman3, Jay3"
            },
        ],
        description: "This is an autobigraphy."
    },
];

export default {

  getRecommendationTest() {
    return apiClient.get("recommend/testget");
  },

  getRecommendations(criteriaListsJson) {
    return apiClient.post("recommend/ask", criteriaListsJson);
  },

};
