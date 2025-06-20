<template>
  <v-container>
    <div>
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold"
            >Book Editor
            
              <v-row class="mb-2">
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'books' }">
                    View Book List
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title
          >


        </v-col>

        <v-col cols="12" md="4" class="ml-auto">
          <v-row dense class="justify-end">
            <v-col cols="12" sm="6">
              <v-btn block color="primary" class="mb-2" @click="openAdd()"
                >Add Book</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                color="red"
                @click="deleteSelectedBook"
                :disabled="!selectedBooks.length"
              >
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <div class="scrollable-list">
        <v-list v-if="books.length">
          <v-list-item
            v-for="book in books"
            :key="book.id"
            class="mb-2"
          >
            <v-row align="center" class="w-100" dense>
              <v-col cols="12" sm="1">
                <v-checkbox
                  v-model="selectedBooks"
                  :value="book.id"
                  hide-details
                  density="compact"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="9">
                <v-list-item-content class="text-left">
                  <v-list-item-title class="text-h6">{{
                    book.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    book.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" sm="2" class="d-flex justify-end">
                <v-list-item-action>
                  <v-btn icon @click="editBook(book)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteBook(book.id)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </div>
     
      <v-dialog persistent v-model="isAdd" width="600">
        <v-card class="rounded-lg elevation-3">
          <v-card-title class="headline"
            >{{ isEditing ? "Edit" : "Add" }} Book</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="newBook.title"
              label="Title"
              required
            ></v-text-field>
            <v-text-field
              v-model="newBook.isbn"
              label="ISBN"
              required
            ></v-text-field>
            <v-textarea
              v-model="newBook.description"
              label="Description"
              required
            ></v-textarea>
            <v-text-field
                v-model="newBook.date"
                label="Publication Date"
                type="date"
                required
            ></v-text-field>
            <v-select
              v-model="newBook.authors"
              :items="allAuthors"
              item-title="name"
              item-value="authorId"
              label="Select Authors"
              multiple
              chips
              clearable
            ></v-select>
            <!--dynamically generate tag categories and their tags-->
            <div v-for="category in tagCategories" :key="category.tagTypeId" class="mb-3">
            <v-select
              v-model="selectedTagsByCategory[category.tagTypeId]"
              :items="category.tags"
              item-title="name"
              item-value="tagId"
              :label="`Select ${category.name}`"
              multiple
              chips
              clearable
            ></v-select>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeAdd()">Cancel</v-btn>
            <v-btn color="primary" @click="submitBook()">Save</v-btn>
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
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const books = ref([]);
const isAdd = ref(false);
const isEditing = ref(false);
const selectedBookId = ref(null);
const selectedBooks = ref([]);
const user = ref(null);
const allAuthors = ref([])
const tagCategories = ref([]);
const selectedTagsByCategory = ref({}); 

const bookId = ref(null)
const API_BASE = 'http://localhost:3201/bookwormapi'

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newBook = ref({
  title: "",
  description: "",
    isbn: "",
    date: "",
  authors: [],
  tags: []
});

// Update newBook.tags based on selectedTagsByCategory so that tags is a flat array, while the selectedTagsByCategory is an object grouped by category
watch(selectedTagsByCategory, (newValue) => {
  newBook.value.tags = Object.values(newValue).flat();
}, { deep: true });

const API_URL = "http://localhost:3201/bookwormapi/books";

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await loadBooks();
  await loadAllAuthors();
  await loadTagCategoriesAndTags();
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

async function loadBooks() {
  try {
    const res = await axios.get(API_URL, getAuthConfig());
    books.value = res.data;
  } catch (err) {
    showError(err);
  }
}

function openAdd() {
  isAdd.value = true;
  isEditing.value = false;
  newBook.value = { title: "", description: "", isbn: "", date: "", authors: [], tags: [] };
  selectedTagsByCategory.value = {};
  tagCategories.value.forEach(cat => {
    selectedTagsByCategory.value[cat.tagTypeId] = [];
  });
}


function closeAdd() {
  isAdd.value = false;
  newBook.value = { title: "", description: "", isbn: "", date: "", authors: [], tags: [] };
  selectedTagsByCategory.value = {};
  tagCategories.value.forEach(cat => {
    selectedTagsByCategory.value[cat.tagTypeId] = [];
  });
  selectedBookId.value = null;
}

async function editBook(book) {
  selectedBookId.value = book.id;
  newBook.value = {
    title: book.title,
    description: book.description,
    isbn: book.isbn, 
    date:  book.date,
    authors: book.authors.map(author => author.authorId),
    tags: book.tags
    
  };
  let tagIds = newBook.value.tags.map(tag => tag.tagId);
  selectedTagsByCategory.value = groupTagsByCategory(tagIds, tagCategories.value);

  isEditing.value = true;
  isAdd.value = true;
}

async function submitBook() {
  try {
    if (isEditing.value && selectedBookId.value) {
      await axios.put(
        `${API_URL}/${selectedBookId.value}`,
        newBook.value,
        getAuthConfig()
      );
     const bookId = selectedBookId.value
      // Update authors for the book
      await axios.delete(`${API_BASE}/bookAuthors/byBook/${bookId}`, getAuthConfig());

      await axios.post(`${API_BASE}/bookAuthors`, {
        bookId,
        authorIds: newBook.value.authors
      },getAuthConfig());

      // Update tags for the book
      await axios.delete(`${API_BASE}/bookTags/byBook/${bookId}`, getAuthConfig());

      
      await axios.post(`${API_BASE}/bookTags`, {
        bookId,
        tagIds: newBook.value.tags
      }, getAuthConfig());
     

      showSuccess("Book updated successfully.");
    } else {
      const res = await axios.post(API_URL, newBook.value, getAuthConfig());
      const bookId = res.data.id;

      // Create authors for the book
      await axios.post(`${API_BASE}/bookAuthors`, {
        bookId,
        authorIds: newBook.value.authors
      },getAuthConfig());

      // Create tags for the book
      await axios.post(`${API_BASE}/bookTags`, {
        bookId,
        tagIds: newBook.value.tags
      }, getAuthConfig());
      

      showSuccess("Book created successfully.");
    }
    await loadBooks();
    closeAdd();
  } catch (err) {
    showError(err);
  }
}

async function deleteBook(id) {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    await loadBooks();
    showSuccess("Book deleted.");
  } catch (err) {
    showError(err);
  }
}

async function deleteSelectedBook() {
  try {
    for (const id of selectedBooks.value) {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    }
    showSuccess("Selected books deleted.");
    selectedBooks.value = [];
    await loadBooks();
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

//Stuff to load tags and categories



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


function groupTagsByCategory(tagIds, tagCategories) {
  const byCategory = {};

  for (const tagId of tagIds) {
    for (const category of tagCategories) {
      if (category.tags.some(tag => tag.tagId === tagId)) {
        if (!byCategory[category.tagTypeId]) {
          byCategory[category.tagTypeId] = [];
        }
        byCategory[category.tagTypeId].push(tagId);
        break; // Stop after finding the category
      }
    }
  }

  return byCategory;
}

function showError(error) {
  snackbar.value.value = true;
  snackbar.value.color = "red";
  snackbar.value.text = error.response?.data?.message || "Error occurred.";
}

function showSuccess(message) {
  snackbar.value.value = true;
  snackbar.value.color = "green";
  snackbar.value.text = message;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

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
</style>
