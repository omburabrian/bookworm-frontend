<script setup>

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

//  The BOOK TITLE and AUTHOR NAMES are retrieved together

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
  book: {
    required: true,
  },
});

//  When the view loads, get the current user.
//  TODO:   Is the USER even needed right now?
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));

});

function doBookButton() {
    //  ToDo:   Do something interesting with the clicked book.
    alert('You clicked the book button.');
}

function descriptionTextPreview(theBookDescription) {
  let textLimit = 250;
  let textContinuationTag = '';

  if (theBookDescription.length > textLimit) {
    //  ToDo:  Make this elipsis *BOLD*.
    textContinuationTag = ' . . . ';
  }

  return theBookDescription.slice(0, 250) + textContinuationTag;
}

</script>

<!-- ################################################################### -->

<template>
  <v-card
  class="rounded-lg elevation-5 mb-8"
  @click="showDetails = !showDetails">

    <v-card-title class="headline">
      <v-row align="center">

        <v-col cols="10">

          {{ book.title }}
          <span style="font-weight: normal; font-size: smaller;">
          &nbsp; &nbsp; ~ {{ book.authors?.map(author => author.name).join(' ; ') }}
          </span>
        </v-col>

        <!--  TODO:  Place some kind of button here, in place of EDIT -->
        <!-- Edit button on right -->
        <v-col class="d-flex justify-end">
          <!-- ToDo:  Only allow edit if review is owned by current user. -->
          <v-icon v-if="user !== null" size="small" icon="mdi-pencil" @click="doBookButton()"></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <!-- ToDo:  Include the user's name who wrote the review? ----------- -->

    <v-card-text class="body-1" v-show="!showDetails">
      {{ descriptionTextPreview(book.description) }}
    </v-card-text>

    <!-- Expanded section ------------------------------- -->

    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Book Description: </h3>

        {{ book.description }}

      </v-card-text>
    </v-expand-transition>

    <!-- ------------------------------------------------------ -->

  </v-card>
</template>
