<template>
  <v-container>
    <v-col cols="10">
      <v-card-title class="pl-0 text-h4 font-weight-bold">
        My Book List
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
          <div v-for="[categoryId, tags] in Object.entries(tagsByCategory)" :key="categoryId" class="mt-3">
            <strong>
              {{ tagCategories.find(cat => String(cat.tagTypeId) === String(categoryId))?.name }}
            </strong>
            <div>
              <v-chip
                v-for="tag in tags"
                :key="tag.tagId"
                class="mr-1"
                size="small"
              >
                {{ tag.name }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
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
console.log('User:', user.value);
const searchBar = ref("");
const tagCategories = ref([]);
const tagsByCategory = ref({});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});




onMounted(async () => {
  await loadBooks();
  await loadTagCategoriesAndTags();
  console.log('Loaded tagCategories:', tagCategories.value);
});


async function loadBooks() {
  try {
    const res = await axios.get(`${API_BASE}/userBooks/${user.value.id}`);
    books.value = res.data;
    console.log('Loaded books:', books.value);
  } catch (err) {
    showError(err);
  }
}

function openBook(book) {
  tagsByCategory.value = groupTagsByCategory(book.tags, tagCategories.value);
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

//Stuff to load tags and categories



async function loadTagCategoriesAndTags() {
  try {
    const categoriesRes = await axios.get(`${API_BASE}/tagtypes`);
    const categories = categoriesRes.data;
    // For each category, fetch its tags
    for (const cat of categories) {
      try {
      const tagsRes = await axios.get(`${API_BASE}/tags/byTagType/${cat.tagTypeId}`);
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


function groupTagsByCategory(tags, tagCategories) {
  const byCategory = {};
  if (!tags) return byCategory;
  for (const tag of tags) {
    const category = tagCategories.find(cat => cat.tagTypeId === tag.tagTypeId);
    if (category) {
      if (!byCategory[category.tagTypeId]) {
        byCategory[category.tagTypeId] = [];
      }
      byCategory[category.tagTypeId].push(tag);
    }
  }
  return byCategory;
}


function showError(error) {
  snackbar.value.value = true;
  snackbar.value.color = "red";
  snackbar.value.text = error.response?.data?.message || "Error occurred.";
}


function closeSnackBar() {
  snackbar.value.value = false;
}

function closeDialog() {
  showDialog.value = false;
  setTimeout(() => {
    selectedBook.value = null;
  }, 300);
}
</script>