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
    <v-row class="mb-2">
      <v-btn-toggle v-model="activeFilter" mandatory>
        <v-btn value="all">All</v-btn>
        <v-btn value="owned">Owned</v-btn>
        <v-btn value="wishlist">Wishlist</v-btn>
        <v-btn value="reading">Reading</v-btn>
        <v-btn value="finished">Finished</v-btn>
      </v-btn-toggle>
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
                    <v-list-item v-if="!wishlistStatus[book.id]" @click="addWishlist(book.id)">
                      <v-list-item-title>Add to Wishlist</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else @click="removeWishlist(book.id)">
                      <v-list-item-title>Remove from Wishlist</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="!ownedStatus[book.id]" @click="addOwned(book.id)">
                      <v-list-item-title>Add to Owned</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else @click="removeOwned(book.id)">
                      <v-list-item-title>Remove from Owned</v-list-item-title>
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
import { load } from "webfontloader";

const books = ref([]);
const showDialog = ref(false);
const selectedBook = ref(null);
const API_BASE = 'http://localhost:3201/bookwormapi';


const API_URL = "http://localhost:3201/bookwormapi/books";
const user = ref(JSON.parse(localStorage.getItem("user")) || null);
const searchBar = ref("");
const tagCategories = ref([]);
const tagsByCategory = ref({});
const ownedStatus = ref({});
const wishlistStatus = ref({});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const userBooks = ref([]); // Store user-specific books
const activeFilter = ref('all');


onMounted(async () => {
  await loadBooks();
  await loadUserBooks();
  await loadTagCategoriesAndTags();
  console.log('Loaded tagCategories:', tagCategories.value);
});


async function loadBooks() {
  try {
    const res = await axios.get(`${API_BASE}/books`);

    books.value = res.data;
     for (const book of books.value) {
      ownedStatus.value[book.id] = await isOwned(book.id);
      wishlistStatus.value[book.id] = await isWishlist(book.id);
      console.log('wishlistStatus:', wishlistStatus.value);
    }
  } catch (err) {
    showError(err);
  }
}

async function loadUserBooks() {
  if (!user.value) return;
  try {
    const res = await axios.get(`${API_BASE}/userBooks/${user.value.id}`);
    userBooks.value = res.data;
    console.log('Loaded userBooks:', userBooks.value);
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
  let filtered;
  // Use userBooks for all filters except 'all'
  if (activeFilter.value === 'all') {
    filtered = books.value;
  } else {
    filtered = userBooks.value;
    console.log('Filtering userBooks:', filtered);
    if (activeFilter.value === 'owned') {
      filtered = filtered.filter(book => book.userBooks.isOwned === true);
    } else if (activeFilter.value === 'wishlist') {
      filtered = filtered.filter(book => book.userBooks.listType === "wishlist");
    } else if (activeFilter.value === 'reading') {
      filtered = filtered.filter(book => book.userBooks.listType === 'reading');
    } else if (activeFilter.value === 'finished') {
      filtered = filtered.filter(book => book.userBooks.listType === 'finished');
    }
    console.log('Filtered books:', filtered);
    console.log('userBooks:', userBooks.value);
  }
  if (!searchBar.value) return filtered;
  const search = searchBar.value.toLowerCase();
  return filtered.filter(book => {
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

async function addBookIfNotExists(bookId) {
  try {
    const response = await axios.get(`${API_BASE}/userbooks/check/${user.value.id}/${bookId}`);
    if (response.data.exists) {
      console.log("Book already exists in user books");
      return;
    }

  } catch (err) {
    if (err.response && err.response.status === 404) {
          await axios.post(`${API_BASE}/userbooks`, { 
      userId: user.value.id,
      bookId: bookId
    });
    showSuccess("Book added successfully");
    loadBooks();
    return;
    } else {
      console.error("Error adding book:", err);
      showError(err);
    }
  }
}

async function addWishlist(bookId) {
  try {
    await addBookIfNotExists(bookId);
    await axios.put(`${API_BASE}/userbooks/update/${user.value.id}/${bookId}`, { 
      userId: user.value.id,
      bookId: bookId,
      listType: "wishlist"
    });
    console.log("Book added to wishlist");
    loadBooks();
    loadUserBooks();
  } catch (err) {
    showError(err);
  }
}

async function removeWishlist(bookId) {
  try {
    await axios.put(`${API_BASE}/userbooks/update/${user.value.id}/${bookId}`, { 
      listType: null
    });
    loadBooks();
    loadUserBooks();
    showSuccess("Book removed from wishlist");
  } catch (err) {
    showError(err);
  }
}


async function isWishlist(bookId) {
  try {
    const response = await axios.get(`${API_BASE}/userbooks/check/${user.value.id}/${bookId}`);
    return response.data.listType == "wishlist";
  } catch (err) {
    console.error("Error checking wishlist:", err);
    return false;
  }
}

async function isOwned(bookId) {
  try {
    const response = await axios.get(`${API_BASE}/userbooks/check/${user.value.id}/${bookId}`);
    
    return response.data.isOwned !== null;
  } catch (err) {
    console.error("Error checking owned books:", err);
    return false;
  }
}

async function addOwned(bookId) {
  try {
    await addBookIfNotExists(bookId);
    await axios.put(`${API_BASE}/userbooks/update/${user.value.id}/${bookId}`, { 
      isOwned: true,
      listType: "owned"
    });
    loadBooks();
    loadUserBooks();
    showSuccess("Book added to owned list");
  } catch (err) {
    showError(err);
  }
}

async function removeOwned(bookId) {
  try {
    await axios.put(`${API_BASE}/userbooks/update/${user.value.id}/${bookId}`,{ 
      isOwned: null
    });
    loadBooks();
    loadUserBooks();
    showSuccess("Book removed from owned list");
  } catch (err) {
    showError(err);
  }
} 

function showSuccess(message) {
  snackbar.value.value = true;
  snackbar.value.color = "green";
  snackbar.value.text = message;
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

function showError(error) {
  snackbar.value.value = true;
  snackbar.value.color = "red";
  snackbar.value.text = error.response?.data?.message || "Error occurred.";
}
</script>