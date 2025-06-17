<script setup>

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import ReviewServices from "../services/ReviewServices.js";

const route = useRoute();
const router = useRouter();   //  For navigating to different view.

//  ref = reactive mutable ref object {} with one property, "value".
const review = ref({});

//  A REVIEW is associated to (written by) a USER.
const user = ref(null);

//  Even though loading review in onMounted(), try initializing to blank value.
review.value = {
  rating: 1,
  reviewText: '(default text for reviewText)',
  book: {
    title: '(default text for book title)',
    authors: [{ name: '(default text for author name)' }],
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
  //  console.log('params: userId = ' + route.params.userId + ', bookId = ' + route.params.bookId);
  await ReviewServices.getReviewForUserBook(route.params.userId, route.params.bookId)
    .then((response) => {
      //  console.log(response.data);
      review.value = response.data[0];
      //  console.log(review.value);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateReview() {

  await ReviewServices.updateReviewForUserIdBookId(
    review.value.userId, review.value.bookId, review.value
  )
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Review updated successfully!  (${review.value.book.title})`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  navigateToReviewsList();
}

//  ToDo:   Change this to use review.value? etc.
async function deleteReview() {

  if (isConfirmDelete()) {
    await ReviewServices.deleteReviewForUserIdBookId(review.value.userId, review.value.bookId)
      .then(() => {
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = `Book Review deleted successfully!  (${review.value.book.title})`;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });

    navigateToReviewsList();
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function isConfirmDelete() {
  //  ToDo:   Create a Vue type delete confirmation dialog.
  //          Name the buttons "Delete" and "Cancel".
  let confirmText = "CONFIRM:  Delete the book review?";
  return confirm(confirmText);
}

function navigateToReviewsList() {
  router.push({
    name: "reviews",
  });
}

function cancelEditReview() {
  //  ToDo:  Could test for UNSAVED data before closing.
  //  For now, just leave the view.
  navigateToReviewsList();
}

</script>

<!-- --------------------------------------------------------- -->
<template>
  <v-container>

    <v-row align="center">
      <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Edit Review
        </v-card-title>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">

          <v-card-title class="headline">
            <v-row align="center">
              <v-col cols="10">
                {{ review.book.title }}
                <span style="font-weight: normal; font-size: smaller;">
                  &nbsp; &nbsp; ~ {{review.book.authors?.map(author => author.name).join(' ; ')}}
                </span>
              </v-col>

              <!-- ToDo:  Change this EDIT button to DELETE, on right -->
              <v-col class="d-flex justify-end">
                <!-- ToDo:  Only allow edit if review is owned by current user. -->
                <!--  ToDo:  Add check for current user before DELETE enabled/shown.
                <v-icon v-if="user !== null" size="small" icon="mdi-delete"  @click="deleteReview()"></v-icon>
                 -->
                <v-icon size="small" icon="mdi-delete" @click="deleteReview()"></v-icon>
              </v-col>

            </v-row>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>

            <v-row>
              
              <v-col cols="2">
                <v-select
                  v-model="review.rating"
                  :items="['1', '2', '3', '4', '5']"
                  label="Rating"
                  required>
                </v-select>
              </v-col>

              <v-col>
                <v-textarea v-model="review.reviewText" rows="10" label="Review Text"></v-textarea>
              </v-col>

            </v-row>
          </v-card-text>

          <v-card-actions class="pt-0">

            <!-- ToDo:  Add a DELETE button to delete the review.
                        Link to 
            
            -->

            <v-btn variant="flat" color="primary" @click="updateReview()">Update Review</v-btn>
            <v-btn variant="flat" color="primary" @click="cancelEditReview()">Cancel</v-btn>
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
