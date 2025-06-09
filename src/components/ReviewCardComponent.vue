<script setup>

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

//  No other components need to be imported, except maybe USER.
//  The BOOK TITLE and AUTHOR NAME are retrieved with the REVIEW
//  via the REVIEW SERVICE / REVIEW API.

const router = useRouter();

//  Whether to expand the book review CARD or not.
const showDetails = ref(false);

//  A REVIEW is associated to (written by) a USER.
const user = ref(null);

//  ToDo:  Define . . . properties?  For this view?  Like a global?
//  (This is the property being passed to this card from parent view,
//  EditReview.vue onMounted() ?  But not referenced with review.value ?)
//  ToDo:  Not receiving review.id with other review fields. ????
const props = defineProps({
  review: {
    required: true,
  },
});

//  When the view loads, get the current user.
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));

});

//  DON'T NEED TO GET BOOK OR AUTHOR INFO SINCE IT IS INCLUDED WITH REVIEW DATA?
//  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
/*

async function getBook() {
  await BookServices.getBookForId(props.review.bookId)
    .then((response) => {
      book.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

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
  //  "editReview" = named route in "src\router.js", associated with the EditReview.vue.
  //  console.log(`router.push(userId=${props.review.userId}, bwBookId=${props.review.bwBookId})`);
  router.push({
    name: "editReview",
    //  Bridge table.  Will need the 2 IDs of the joined tables.
    params: {
      userId: props.review.userId,
      bwBookId: props.review.bwBookId,
    }
  });
  //  router.push({ name: "editRecipe", params: { id: props.review.id } });
}

function reviewTextPreview(theReviewText) {
  let textLimit = 250;
  let textContinuationTag = '';

  if (theReviewText.length > textLimit) {
    //  ToDo:  Make this elipsis *BOLD*.
    textContinuationTag = ' . . . ';
  }

  return theReviewText.slice(0, 250) + textContinuationTag;
}

</script>

<!-- -------------------------------------------------------- -->
<template>
  <v-card
  class="rounded-lg elevation-5 mb-8"
  @click="showDetails = !showDetails">

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
          <!-- ToDo:  Only allow edit if review is owned by current user. -->
          <v-icon v-if="user !== null" size="small" icon="mdi-pencil" @click="navigateToEdit()"></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <!-- ToDo:  Include the user's name who wrote the review? ----------- -->

    <v-card-text class="body-1" v-show="!showDetails">
      {{ reviewTextPreview(review.reviewText) }}
    </v-card-text>

    <!-- Expanded section ------------------------------- -->

    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Book Review: </h3>

        {{ review.reviewText }}

      </v-card-text>
    </v-expand-transition>

    <!-- ------------------------------------------------------ -->

  </v-card>
</template>
