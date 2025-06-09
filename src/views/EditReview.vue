<script setup>

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import ReviewServices from "../services/ReviewServices.js";

const route = useRoute();

//  ref = reactive mutable ref object {} with one property, "value".
const review = ref({});

//  Even though loading review in onMounted(), try initializing to blank value.
review.value = {
    rating: 1,
    reviewText: '(default text for reviewText)',
    bw_book: {
      title: '(default text for book title)',
      bw_authors: [{ name: '(default text for author name)' }],
    },
  };

//  User message at bottom of view
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

//  When view loads, get data for it.
onMounted(async () => {
  await getReview();
});

async function getReview() {
  //  await ReviewServices.getReview(route.params.id)
  //  console.log('params: userId = ' + route.params.userId + ', bwBookId = ' + route.params.bwBookId);
  //  ToDo:  ERROR - Not getting the review from the backend:
  await ReviewServices.getReviewForUserBook(route.params.userId, route.params.bwBookId)
    .then((response) => {
      console.log('Inside .then((response) => {...}');
      console.log(response.data);
      review.value = response.data[0];
      //  console.log(review.value);
      //  console.log(review);
    })
    .catch((error) => {
      console.log('DID NOT GET THE REVIEW!!!!!');
      console.log(error);
    });

    //  console.log('AFTER the await ReviewServices.getReviewForUserBook()...');
}

async function updateReview() {
  await ReviewServices.updateReview(review.value.id, review.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Review updated successfully!  (${review.value.bw_book.title})`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getReview();
}

//  ToDo:   Change this to use review.value? etc.
async function deleteReview(review) {
  await ReviewServices.deleteReview(review.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Reivew deleted successfully!  (${review.value.bw_book.title})`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
    //  ToDo:  Need to go back to review list screen with refreshed list.
  await getReviews();
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<!-- --------------------------------------------------------- -->
<template>
  <v-container>

    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Review
        </v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">

          <v-card-text>
            <v-row>
              <v-col>

                <v-text-field
                  v-model="review.bw_book.title"
                  label="Title"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="review.bw_book.bw_authors[0].name"
                  label="Author"
                ></v-text-field>

                <v-text-field
                  v-model.number="review.rating"
                  label="Rating"
                  type="number"
                ></v-text-field>

              </v-col>

              <v-col>
                <v-textarea
                  v-model="review.reviewText"
                  rows="10"
                  label="Review Text"
                ></v-textarea>
              </v-col>

            </v-row>
          </v-card-text>

          <v-card-actions class="pt-0">

            <!-- ToDo:  Add a DELETE button to delete the review.
                        Link to 
            
            -->

            <v-btn variant="flat" color="primary" @click="updateReview()"
              >Update Review</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>
