<script setup>

import { ref, onMounted } from 'vue'
import RecommendServices from "../services/RecommendServices";
import BookCard from "../components/BookCardComponent.vue";

//  Initialize variables
const user = ref(null);
const books = ref([]);

//  Quick user messages using Vuetify "snackbar"
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

//  User input text from view
const recommendCriteriaText = ref({
    books: '',
    authors: '',
    genres: '',
});

//  User input text converted into arrays
const recommendCriteriaLists = ref({
    bookList: [],
    authorList: [],
    genreList: [],
});

//  User input arrays converted into JSON arrays
const recommendCriteriaJson = ref({
    bookList: '',
    authorList: '',
    genreList: '',
});

//  Returned JSON list from RecommendServices
const recommendedList = ref([]);
const recommendedListText = ref('');

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  Upon loading the view, load all the reviews.
onMounted(async () => {

    //  await getBooks();
    //  Get user id for potential subsequent use in adding new reviews, etc.
    user.value = JSON.parse(localStorage.getItem("user"));

    //  Snackbar test:
    // snackbar.value.value = true;
    // snackbar.value.color = "error";
    // snackbar.value.text = 'Whazzzup?!';
});

function getRecommendations() {
    getCriteriaLists();
    promptForRecommendations();
    displayRecommendations();
}

function getCriteriaLists() {
    getBookCriteria();
    getAuthorCriteria();
    getGenreCriteria();
}

function getBookCriteria() {
    recommendCriteriaLists.value.bookList
        = recommendCriteriaText.value.books.split('\n');
    recommendCriteriaJson.value.bookList
        = JSON.stringify(recommendCriteriaLists.value.bookList);
};

function getAuthorCriteria() {
    recommendCriteriaLists.value.authorList
        = recommendCriteriaText.value.authors.split('\n');
    recommendCriteriaJson.value.authorList
        = JSON.stringify(recommendCriteriaLists.value.authorList);
};

function getGenreCriteria() {
    recommendCriteriaLists.value.genreList
        = recommendCriteriaText.value.genres.split('\n');
    recommendCriteriaJson.value.genreList
        = JSON.stringify(recommendCriteriaLists.value.genreList);
};

async function promptForRecommendations() {

    //  Testing  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#########################
    //  recommendedList.value = RecommendServices.getRecommendationTest();

    // RecommendServices.getRecommendations(
    //     recommendCriteriaJson.value
    // );

    await RecommendServices.getRecommendationTest()
        .then((response) => {
            //  recommendedList.value = response.data;
            books.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
};

function displayRecommendations() {

    recommendedListText.value = recommendedList.value;

    //  Todo:  Display list of cards, one for each recommendation
    //  recommendedListText.value = '(Display the recoomendations here.)';

};





function closeSnackBar() {
    snackbar.value.value = false;
}

</script>

<template>
    <v-container>
        <div id="body">

            <v-row align="center" class="mb-4">

                <v-col cols="8">
                    <v-card-title class="pl-0 text-h4 font-weight-bold">
                        Recommendations
                    </v-card-title>
                </v-col>

                <v-col class="d-flex justify-end" cols="4">
                    <v-btn v-if="user !== null" color="primary" @click="getRecommendations()">
                        Get Recommendations
                    </v-btn>
                </v-col>

            </v-row>

            <v-row>

                <v-col>
                    <v-card class="rounded-lg elevation-5">
                        <v-textarea label="Books" v-model="recommendCriteriaText.books">
                        </v-textarea>
                    </v-card>
                </v-col>


                <v-col>
                    <v-card class="rounded-lg elevation-5">
                        <v-textarea label="Authors" v-model="recommendCriteriaText.authors">
                        </v-textarea>
                    </v-card>
                </v-col>

                <v-col>
                    <v-card class="rounded-lg elevation-5">
                        <v-textarea label="Genres" v-model="recommendCriteriaText.genres">
                        </v-textarea>
                    </v-card>
                </v-col>

            </v-row>

            <br><br>

            <v-row>
                <v-col cols="10">
                    <v-card class="rounded-lg elevation-5">
                        <v-card-title class="headline mb-2">Recommended Books </v-card-title>

                        <!--
                        <v-textarea v-model="recommendedListText">
                        </v-textarea>
                        -->
                        
                        <!-- ToDo:  What is the @deletedList clause? -->
                        <BookCard v-for="book in books" :book="book" @deletedList="getLists()" />

                    </v-card>
                </v-col>
            </v-row>

            <!-- User message -->
            <v-snackbar v-model="snackbar.value" rounded="pill">
                {{ snackbar.text }}
                <template v-slot:actions>
                    <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                        Close
                    </v-btn>
                </template>
            </v-snackbar>
        </div>
    </v-container>
</template>