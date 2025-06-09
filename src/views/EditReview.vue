<script setup>

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import ReviewServices from "../services/ReviewServices.js";

const route = useRoute();

const review = ref({});

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
  await ReviewServices.getReview(route.params.id)
    .then((response) => {
      review.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
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
  await getRecipe();
}

async function deleteReview(review) {
  await ReviewServices.deleteReveiw(review)
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
  await getRecipeIngredients();
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
                  v-model="revew.reviewText"
                  rows="10"
                  label="Review Text"
                ></v-textarea>
              </v-col>

            </v-row>
          </v-card-text>

          <v-card-actions class="pt-0">
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
