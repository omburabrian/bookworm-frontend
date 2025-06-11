<script setup>

import { onMounted } from "vue";
import { ref } from "vue";

//  Book Review elements
import ReviewCard from "../components/ReviewCardComponent.vue";
import ReviewServices from "../services/ReviewServices.js";
import BookServices from "../services/BookServices.js";

//  The Book Selection Dialog.  Pass the book list to it.
import BookSelectList from "../components/BookSelectList.vue";

//  Initialize variables
const reviews = ref([]);
const isAdd = ref(false);
const user = ref(null);

//  Props shared with child dialog, BookSelectList
const bookList = ref([]);
const selectedBook = ref({});

//  Quick user messages using Vuetify "snackbar"
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

//  Blank Review object (see model, bookwormapi:review.model.js)
const newReview = ref({
    rating: 0,
    reviewText: "",
    userId: null,
    bwBookId: null,
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  Upon loading the view, load all the reviews.
onMounted(async () => {
    await getReviews();
    await getBooks();
    //  Get user id for potential subsequent use in adding new reviews, etc.
    user.value = JSON.parse(localStorage.getItem("user"));
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  Get reviews.  (?) If user logged in, only get theirs.  If not, get all.
async function getReviews() {
    //  Already retrieved the USER in onMounted().
    //  user.value = JSON.parse(localStorage.getItem("user"));
    if (user.value !== null && user.value.id !== null) {
        //  ToDo:   Default = get all reviews, but perhaps have checkbox to get own reviews?
        //  ToDo:   await ReviewServices.getReviewsByUserId(user.value.id)
        console.log('getReviews()');
        console.log('user.value.id = ' + user.value.id);
        console.log('user.value = ' + user.value);
        await ReviewServices.getReviews()
            .then((response) => {
                reviews.value = response.data;
            })
            .catch((error) => {
                console.log(error);
                snackbar.value.value = true;
                snackbar.value.color = "error";
                snackbar.value.text = error.response.data.message;
            });
    } else {
        console.log('getReviews()');
        console.log('ELSE user.value...');
        await ReviewServices.getReviews()
            .then((response) => {
                reviews.value = response.data;
            })
            .catch((error) => {
                console.log(error);
                snackbar.value.value = true;
                snackbar.value.color = "error";
                snackbar.value.text = error.response.data.message;
            });
    }
}

async function getBooks() {
    await BookServices.getAllBooks()
        .then((response) => {
            bookList.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//  Create a Review
async function addReview() {

    //  Save the current user's ID to the added review.
    newReview.value.userId = user.value.id;

    //  ToDo:   Ensure the book ID has been set in the newReview.value.bookId.
    //  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@###############################

    //  Employ the Review service to add the review.
    await ReviewServices.addReview(newReview.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            //  ToDo:  Use the book name in this notification.  TEST
            snackbar.value.text = `Review added successfully!  (${newReview.value.bw_book.title})`;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });

    //  Review has been input by user.  Close the "add review" dialog. (set to false).
    isAdd.value = false;

    //  Reload the list of reviews after adding a new one.
    await getReviews();
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const handleBookSelectListClose = (returnedData) => {
    console.log('Data from child BookSelectList dialog:', returnedData)
    console.log('returned selectedBook = ' + selectedBook);
    console.log('returned selectedBook.value = ' + selectedBook.value);
    selectedBook.value = returnedData.selectedBook;
    // Use it however needed
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//  ADD BUTTON -- open = show, close = hide
function openAdd() {
    //  Initialize attributes for the newReview, each time ADD.
    newReview.value = ref({
        rating: 0,
        reviewText: "",
        userId: user.value.id,
        bwBookId: null,
    });
    isAdd.value = true;
}

function closeAdd() {
    isAdd.value = false;
}

function closeSnackBar() {
    snackbar.value.value = false;
}

</script>

<template>
    <v-container>
        <div id="body">
            <v-row align="center" class="mb-4">

                <v-col cols="10">
                    <v-card-title class="pl-0 text-h4 font-weight-bold">
                        Book Reviews
                    </v-card-title>
                </v-col>

                <v-col class="d-flex justify-end" cols="2">
                    <v-btn v-if="user !== null" color="accent" @click="openAdd()">
                        Add
                    </v-btn>
                </v-col>

            </v-row>

            <!-- ToDo:  What is the @deletedList clause? -->
            <ReviewCard v-for="review in reviews" :review="review" @deletedList="getLists()" />

            <v-dialog persistent v-model="isAdd" width="800">
                <v-card class="rounded-lg elevation-5">
                    <v-card-title class="headline mb-2">Add Review </v-card-title>

                    <BookSelectList
                        :bookList="bookList"
                        :selectedBook
                        customDataFromParent="You get this first..."
                        moreDataFromParent="... and then this."
                        @closeWithData="handleBookSelectListClose"
                        />

                    <!-- @@@@@@@@@@@@@@@@@@@@@@@############################# -->


                    <!-- Change this to some type of selection, integer between 1-5 -->

                    <v-card-text>

                        <!-- ToDo:  Change RATING selection to radio buttons with STARS and corresponding numbers -->
                        <v-col cols="3">
                            <v-select
                            v-model="newReview.rating"
                            :items="['1', '2', '3', '4', '5']"
                            label="Rating"
                            required></v-select>
                        </v-col>

                        <v-col cols="20">
                            <v-card-text class="text-h6">
                                <span class="text-body-1">Title:</span> &nbsp;
                                <!-- ToDo:  This is the book ID.  Need the TITLE. -->
                                {{ selectedBook.title }}
                            </v-card-text>
                        </v-col>

                        <v-textarea v-model="newReview.reviewText" label="Review" required>
                        </v-textarea>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn variant="flat" color="primary" @click="addReview()">Add Review</v-btn>
                        <v-btn variant="flat" color="secondary" @click="closeAdd()">Close</v-btn>
                    </v-card-actions>

                </v-card>
            </v-dialog>

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
