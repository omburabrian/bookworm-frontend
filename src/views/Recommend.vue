<script setup>

import { ref, onMounted } from 'vue'

//  Initialize variables
const user = ref(null);

//  Quick user messages using Vuetify "snackbar"
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

//  Blank Recommendation Criteria object
const recommendCriteria = ref({
    books: [],
    authors: [],
    genres: [],
});

const recommendedBooks = ref([]);

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

}

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
                        <v-textarea label="Books" v-model="recommendCriteria.books">
                        </v-textarea>
                    </v-card>
                </v-col>


                <v-col>
                    <v-card class="rounded-lg elevation-5">
                        <v-textarea label="Authors" v-model="recommendCriteria.authors">
                        </v-textarea>
                    </v-card>
                </v-col>

                <v-col>
                    <v-card class="rounded-lg elevation-5">
                        <v-textarea label="Genres" v-model="recommendCriteria.genres">
                        </v-textarea>
                    </v-card>
                </v-col>

            </v-row>

            <br><br>
            
            <v-row>
                <v-col cols="10">
                <v-card class="rounded-lg elevation-5" >
                    <v-card-title class="headline mb-2">Recommended Books </v-card-title>

                    <v-textarea v-model="recommendCriteria.books">
                        </v-textarea>

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