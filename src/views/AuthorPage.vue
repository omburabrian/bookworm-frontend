<template>
  <v-container>
    <div>
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold"
            >Book Authors</v-card-title
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn color="primary" class="mr-2" @click="openAdd()">Add Author</v-btn>
          <v-btn color="red" @click="deleteSelectedAuthors" :disabled="!selectedAuthors.length">
            Delete Selected
          </v-btn>
        </v-col>
      </v-row>

<div class="scrollable-list">
      <v-list v-if="authors.length">
        <v-list-item
          v-for="author in authors"
          :key="author.authorId"
          class="mb-2"
        >
          <v-row align="center" class="w-100">
            <v-col cols="auto">
              <v-checkbox
                v-model="selectedAuthors"
                :value="author.authorId" 
                hide-details
                density="compact"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-list-item-content class="text-left">
                <v-list-item-title class="text-h6">{{ author.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ author.description }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
            <v-col class="ml-auto" cols="auto">
              <v-list-item-action>
                <v-btn icon @click="editAuthor(author)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteAuthor(author.authorId)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
</div>
      <!-- Author Form Dialog -->
      <v-dialog persistent v-model="isAdd" width="600">
        <v-card class="rounded-lg elevation-3">
          <v-card-title class="headline"
            >{{ isEditing ? "Edit" : "Add" }} Author</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="newAuthor.name"
              label="Author Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="newAuthor.description"
              label="Description"
              required
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeAdd()">Cancel</v-btn>
            <v-btn color="primary" @click="submitAuthor()">Save</v-btn>
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
import { ref, onMounted } from "vue";
import axios from "axios";

const authors = ref([]);
const isAdd = ref(false);
const isEditing = ref(false);
const selectedAuthorId = ref(null);
const searchQuery = ref("");
const selectedAuthors = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newAuthor = ref({
  name: "",
  description: "",
});

const API_URL = "http://localhost:3201/bookwormapi/authors";

onMounted(() => {
  loadAuthors();
});

async function loadAuthors() {
  try {
    const res = await axios.get(API_URL);
    authors.value = res.data;
  } catch (err) {
    showError(err);
  }
}


function openAdd() {
  isAdd.value = true;
  isEditing.value = false;
  newAuthor.value = { name: "", description: "" };
}

function closeAdd() {
  isAdd.value = false;
  newAuthor.value = { name: "", description: "" };
  selectedAuthorId.value = null;
}

function editAuthor(author) {
  selectedAuthorId.value = author.authorId;
  newAuthor.value = {
    name: author.name,
    description: author.description,
  };
  isEditing.value = true;
  isAdd.value = true;
}

async function submitAuthor() {
  try {
    if (isEditing.value && selectedAuthorId.value) {
      await axios.put(`${API_URL}/${selectedAuthorId.value}`, newAuthor.value);
      showSuccess("Author updated successfully.");
    } else {
      await axios.post(API_URL, newAuthor.value);
      showSuccess("Author created successfully.");
    }
    await loadAuthors();
    closeAdd();
  } catch (err) {
    showError(err);
  }
}

async function deleteAuthor(id) {
  try {
    await axios.delete(`${API_URL}/${id}`);
    await loadAuthors();
    showSuccess("Author deleted.");
  } catch (err) {
    showError(err);
  }
}

async function deleteSelectedAuthors() {
  try {
    for (const id of selectedAuthors.value) {
      await axios.delete(`${API_URL}/${id}`);
    }
    showSuccess("Selected authors deleted.");
    selectedAuthors.value = [];
    await loadAuthors();
  } catch (err) {
    showError(err);
  }
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
  max-height: 600px; 
  overflow-y: auto;
  border: 1px solid #ccc;
  padding-right: 4px; /* space for scrollbar */
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
  padding-right: 16px;
}
</style>
