<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

//  No other components need to be imported, except maybe USER.
//  The BOOK TITLE and AUTHOR NAME are retrieved with the REVIEW
//  via the REVIEW SERVICE / REVIEW API.

const router = useRouter();

const showDetails = ref(false);

//  A REVIEW is associated to (written by) a USER.
const user = ref(null);

const props = defineProps({
  review: {
    required: true,
  },
});

//  Get the current user whenever view loads.
onMounted(async () => {
  //  await getRecipeIngredients();
  //  await getRecipeSteps();
  user.value = JSON.parse(localStorage.getItem("user"));
});

//  DON'T NEED TO GET BOOK OR AUTHOR INFO SINCE IT IS INCLUDED WITH REVIEW DATA?
//  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
/*
//  ToDo: Needs work whenever book available.
async function getBook() {
  await BookServices.getBookForId(props.review.bookId)
    .then((response) => {
      book.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

//  ToDo: Needs work whenever authorId available.
async function getAuthor() {
  await AuthorServices.getAuthor(props.review.authorId)
    .then((response) => {
      author.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
//  */
//  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

//  ToDo: What does this do?  No other references anywhere.  >>>> function navigateToEdit() {
//  Documentation = navigates to url?  https://router.vuejs.org/guide/essentials/navigation.html
function navigateToEdit() {
  router.push({ name: "editReview", params: { id: props.review.id } });
  //  router.push({ name: "editRecipe", params: { id: props.review.id } });
}

function reviewTextPreview(theReviewText) {
  let textLimit = 250;
  let textContinuationTag = '';

  if (theReviewText.length > textLimit) {
    textContinuationTag = ' . . . ';
  }

  return theReviewText.slice(0, 250) + textContinuationTag;
}


</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="showDetails = !showDetails">

    <v-card-title class="headline">
      <v-row align="center">

        <v-col cols="10">

          <v-chip class="ma-2" color="primary" label>
            <!-- Show # of stars == to the rating. -->
             ( {{ review.rating }} ) &nbsp; &nbsp;
            <span v-for="i in parseInt(review.rating)" :key="i">
            <v-icon start icon="mdi-star"></v-icon>  
            </span>
          </v-chip>
          {{ review.bw_book.title }}
          <span style="font-weight: normal; font-size: smaller;">
          &nbsp; &nbsp; ~ {{ review.bw_book.bw_authors[0].name }}
          </span>
        </v-col>

        <!-- Edit button on right -->
        <v-col class="d-flex justify-end">
          <v-icon v-if="user !== null" size="small" icon="mdi-pencil" @click="navigateToEdit()"></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <v-card-text class="body-1">
      <!-- ToDo:  Show a PREVIEW of the text with an option to open it in a dialog. -->
       <!--  {{ review.reviewText }} -->
      {{ reviewTextPreview(review.reviewText) }}
    </v-card-text>
  </v-card>
</template>
