<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

//  No other components needed?
//  ToDo:   Will need references to BOOK and AUTHOR.  How is this done?

//  import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
//  import RecipeStepServices from "../services/RecipeStepServices.js";
//  import RecipeReports from "../reports/RecipeReports.js";

const router = useRouter();

const showDetails = ref(false);
//  const recipeIngredients = ref([]);
//  const recipeSteps = ref([]);
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

//  ToDo: What does this do?  No other references anywhere.  >>>> function navigateToEdit() {
//  Documentation = navigates to url?  https://router.vuejs.org/guide/essentials/navigation.html
function navigateToEdit() {
  router.push({ name: "editReview", params: { id: props.review.id } });
  //  router.push({ name: "editRecipe", params: { id: props.review.id } });
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="showDetails = !showDetails">

    <v-card-title class="headline">
      <v-row align="center">

        <v-col cols="10">
          {{ review.rating }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ review.rating }} Rating
          </v-chip>
        </v-col>

        <!-- Edit button on right -->
        <v-col class="d-flex justify-end">
          <v-icon v-if="user !== null" size="small" icon="mdi-pencil" @click="navigateToEdit()"></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <v-card-text class="body-1">
      {{ review.reviewText }}
    </v-card-text>
  </v-card>
</template>
