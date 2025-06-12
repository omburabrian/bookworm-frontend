
<template>
  <v-container>
      <v-col cols="10">
        <v-card-title class="pl-0 text-h4 font-weight-bold"
          >Book List
          <v-row class="mb-2">
            <v-col cols="12" class="d-flex justify-end">
              <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'bookEdit' }">
                  Edit Books
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title
        >
      </v-col>

<v-row class="mb-4">
  <v-col cols="12" sm="4">
    <v-text-field v-model="search" label="Search by Title or Description" clearable />
  </v-col>
  <v-col cols="12" sm="3">
    <v-select
      v-model="selectedAuthor"
      :items="allAuthors"
      item-title="name"
      item-value="authorId"
      label="Filter by Author"
      clearable
    />
  </v-col>
  <v-col cols="12" sm="2">
    <v-text-field
      v-model="selectedDate"
      label="Filter by Date"
      type="date"
      clearable
    />
  </v-col>
  <div v-for="category in tagCategories" :key="category.tagTypeId" class="mb-2">
  <v-select
    v-model="selectedTagsByCategory[category.tagTypeId]"
    :items="category.tags"
    item-title="name"
    item-value="tagId"
    :label="`Filter by ${category.name} Tag(s)`"
    multiple
    clearable
    chips
  />
</div>
</v-row>
    <v-row>
      <v-col cols="12">
        <v-card v-for="book in books" :key="book.id" class="mb-3" @click="openBook(book)">
          <v-card-title>{{ book.title }}</v-card-title>
          <v-card-subtitle>{{ book.authors?.map(a => a.name).join(', ') }}</v-card-subtitle>
          <v-card-text>{{ book.description }}</v-card-text>
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
import { ref, onMounted } from "vue";
import axios from "axios";

const books = ref([]);
const showDialog = ref(false);
const selectedBook = ref(null);
const API_BASE = 'http://localhost:3201/bookwormapi';
const bookArrays = ref([]);
const newBook = ref({
  title: "",
  description: "",
    isbn: "",
    date: "",
  selectedAuthors: []
});

const search = ref("");
const selectedAuthor = ref(null);
const selectedCategory = ref(null);
const selectedDate = ref("");
const allAuthors = ref([]);
const tagCategories = ref([]);
const selectedTagsByCategory = ref({});
const API_URL = "http://localhost:3201/bookwormapi/books";



onMounted(async () => {
  await loadBooks();
  await loadAllAuthors();
  await loadTagCategories();
});

import { computed } from "vue";

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    // Search filter
    const matchesSearch =
      !search.value ||
      book.title.toLowerCase().includes(search.value.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(search.value.toLowerCase()));

    // Author filter
    const matchesAuthor =
      !selectedAuthor.value ||
      (book.authors && book.authors.some(a => a.authorId === selectedAuthor.value));


    return matchesSearch && matchesAuthor;
  });
});

async function loadBooks() {
  try {
    const res = await axios.get(API_URL, getAuthConfig());
    books.value = res.data;
  } catch (err) {
    showError(err);
  }
}

//Stuff for pulling authors

async function loadAllAuthors() {
  try {
    const res = await axios.get(`${API_BASE}/authors`)
    allAuthors.value = res.data
  } catch (err) {
    console.error('Failed to load authors:', err)
  }
}

async function loadTagCategoriesAndTags() {
  try {
    const categoriesRes = await axios.get(`${API_BASE}/tagtypes`, getAuthConfig());
    const categories = categoriesRes.data;
    // For each category, fetch its tags
    for (const cat of categories) {
      try {
      const tagsRes = await axios.get(`${API_BASE}/tags/byTagType/${cat.tagTypeId}`, getAuthConfig());
      cat.tags = tagsRes.data;
      } catch (err) {
        console.error(`Failed to load tags for category ${cat.tagTypeId}:`, err);
        cat.tags = []; 
      }
    }
    tagCategories.value = categories;
  } catch (err) {
    showError(err);
  }
}

function openBook(book) {
  // Optionally, fetch full details here
  selectedBook.value = book;
  showDialog.value = true;
}

</script>