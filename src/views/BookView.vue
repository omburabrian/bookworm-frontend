<template>
  <v-container>
    <v-col cols="10">
      <v-card-title class="pl-0 text-h4 font-weight-bold">
        Book List
        <v-row class="mb-2">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'bookEdit' }">
              Edit Books
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
    </v-col>
    <v-row class="mb-4">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchBar" label="Search by Author, Title, or ISBN" clearable />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card v-for="book in filteredBooks" :key="book.id" class="mb-3" @click="openBook(book)">
          <v-row align="center">
            <v-col cols="10">
              <v-card-title>{{ book.title }}</v-card-title>
              <v-card-subtitle>{{ book.authors?.map(a => a.name).join(', ') }}</v-card-subtitle>
              <v-card-text>{{ book.description }}</v-card-text>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
              <v-list-item-action>
                <v-menu offset-y>
                  <template #activator="{ props }">
                    <v-btn icon v-bind="props">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="addWishlist(book.id)">
                      <v-list-item-title>Add to Wishlist</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="addOwned(book.id)">
                      <v-list-item-title>Add to Owned</v-list-item-title>
                    </v-list-item>

                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" max-width="600">
      <v-card v-if="selectedBook">
        <v-card-title>{{ selectedBook.title }}</v-card-title>
        <v-card-subtitle>
          <div><strong>Authors:</strong> {{ selectedBook.authors?.map(a => a.name).join(', ') }}</div>
          <div><strong>ISBN:</strong> {{ selectedBook.isbn }}</div>
          <div v-if="selectedBook.date && selectedBook.date !== '0000-00-00'">
            <strong>Publication Date:</strong> {{ selectedBook.date }}
          </div>
        </v-card-subtitle>
        <v-card-text>
          <div v-if="selectedBook.description && selectedBook.description !== ''">
            <strong>Description:</strong> {{ selectedBook.description }}
          </div>
          <div v-else><strong>Description:</strong> No Description Available</div>
          <div v-for="(tags, cat) in selectedBook.tagsByCategory" :key="cat">
            <strong>{{ cat }}:</strong> {{ tags.map(t => t.name).join(', ') }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const books = ref([]);
const showDialog = ref(false);
const selectedBook = ref(null);
const API_BASE = 'http://localhost:3201/bookwormapi';


const API_URL = "http://localhost:3201/bookwormapi/books";
const user = ref(JSON.parse(localStorage.getItem("user")) || null);
const searchBar = ref("");



onMounted(async () => {
  await loadBooks();
});


async function loadBooks() {
  try {
    const res = await axios.get(`${API_BASE}/books`);
    books.value = res.data;
  } catch (err) {
    showError(err);
  }
}

function openBook(book) {
  selectedBook.value = book;
  showDialog.value = true;
}

const filteredBooks = computed(() => {
  if (!searchBar.value) return books.value;
  const search = searchBar.value.toLowerCase();
  return books.value.filter(book => {
    const titleMatch = book.title && book.title.toLowerCase().includes(search);
    const isbnMatch = book.isbn && book.isbn.toLowerCase().includes(search);
    const authorMatch = book.authors && book.authors.some(a => a.name.toLowerCase().includes(search));
    return titleMatch || isbnMatch || authorMatch;
  });
});

</script>