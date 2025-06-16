<script setup>
import BookCard from "../components/BookCard.vue";
import ReadingStatsCard from "../components/ReadingStatsCard.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const viewBook = ref(false);
const viewReadingStats = ref(false);
const bookInfo = ref([]);
const user = ref(null);
const books = ref([]);
const readingStats = ref([]);
const userReadingStats = ref([]);

const API_URL = "http://localhost:3201/bookwormapi/books";
//const API_URL = "http://localhost:3201/bookwormapi/userBooks";

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  //await fetchBooks();
});

function getAuthConfig() {
  const token = user.value?.token;
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
}

//fetch reading stats
async function fetchReadingStats() {
  try {
    const res = await axios.get(API_URL, getAuthConfig());
    readingStats.value = res.data;
    console.log("Reading Stats:", res.data);
    if (readingStats.value.length > 0) {
      userReadingStats.value = readingStats.value;
      viewReadingStats.value = true;
    }
  } catch (err) {
    console.error("Error fetching reading stats:", err);
  }
}
async function fetchBooks() {
  try {
    const res = await axios.get(API_URL, getAuthConfig());

    bookInfo.value = res.data;
    console.log("Book Info:", res.data);
    if (bookInfo.value.length > 0) {
      books.value = bookInfo.value;
      viewBook.value = true;
    }
  } catch (err) {
    console.error("Error fetching books:", err);
  }
}
// function showBook(book) {
  // viewBook.value = true;
  // selectedBook.value = true;
// }
</script>
<template>
  <v-container md="12" sm="6">
    <div>
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h5 font-weight-bold">
            My Reading Schedule
          </v-card-title>
        </v-col>
        <v-col cols="10" md="12">
          <v-row justify="space-evenly" class="text-center">
            <v-col>
              <v-list-item link class="hover-black" @click="fetchReadingStats">
                <v-list-item-title>Reading Stats</v-list-item-title>
              </v-list-item>
              <ReadingStatsCard
                v-model="viewReadingStats"
                :userBooks="readingStats"
              />
            </v-col>
            <v-col>
              <v-list-item link class="hover-black">
                <v-list-item-title>Set Schedule</v-list-item-title>
              </v-list-item>
            </v-col>
            <v-col>
              <v-list-item link class="hover-black">
                <v-list-item-title>WishList</v-list-item-title>
              </v-list-item>
            </v-col>
            <v-col>
              <v-list-item link class="hover-black" @click="fetchBooks">
                <v-list-item-title>All Books</v-list-item-title>
              </v-list-item>
              <BookCard v-model="viewBook" :book="books" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<style scoped>
.v-list-item {
  padding: 8px;
}

/* Ensure long descriptions wrap properly */
.v-list-item-title,
.v-list-item-subtitle {
  white-space: normal;
  word-break: break-word;
  font-weight: bold;
}
/* Optional: add spacing for content area */
.scrollable-list {
  max-height: 800px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.v-list-item-title {
  font-weight: bold;
  white-space: normal;
  word-break: break-word;
}

.v-list-item-subtitle {
  white-space: normal;
  word-break: break-word;
  max-height: none;
  overflow: visible;
  display: block;
  line-height: 1.5;
}

.v-list-item-content {
  padding-right: 6px;
}
.hover-black:hover {
  background-color: black;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
</style>
