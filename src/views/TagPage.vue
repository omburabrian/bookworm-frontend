<template>
<v-row align="center" class="mb-4">
  <v-col cols="12" md="6">
    <v-select
      v-model="selectedTagTypeId"
      :items="tagTypes"
      item-title="name"
      item-value="id"
      label="Select Category"
      @update:modelValue="loadTagsByCategory"
      clearable
    ></v-select>
  </v-col>

  <v-col cols="12" md="3">
    <v-btn block color="primary" @click="openAddCategory">Add Category</v-btn>
  </v-col>

  <v-col cols="12" md="3">
    <v-btn
      block
      color="red"
      @click="deleteSelectedCategory"
      :disabled="!selectedTagTypeId"
    >
      Delete Category
    </v-btn>
  </v-col>
</v-row>


  <v-container>
    <div>
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold"
            >Tags</v-card-title
          >
        </v-col>

        <v-col cols="12" md="4" class="ml-auto">
          <v-row dense class="justify-end">
            <v-col cols="12" sm="6">
              <v-btn block color="primary" class="mb-2" @click="openAdd()"
                >Add Tag</v-btn
              >
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                block
                color="red"
                @click="deleteSelectedTag"
                :disabled="!selectedTags.length"
              >
                Delete
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <div class="scrollable-list">
        <v-list v-if="tags.length">
          <v-list-item
            v-for="tag in tags"
            :key="tag.id"
            class="mb-2"
          >
            <v-row align="center" class="w-100" dense>
              <v-col cols="12" sm="1">
                <v-checkbox
                  v-model="selectedTags"
                  :value="tag.id"
                  hide-details
                  density="compact"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="9">
                <v-list-item-content class="text-left">
                  <v-list-item-title class="text-h6">{{
                    tag.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" sm="2" class="d-flex justify-end">
                <v-list-item-action>
                  <v-btn icon @click="editTag(tag)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteTag(tag.id)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </div>
      <!-- Tag Form Dialog -->
      <v-dialog persistent v-model="isAdd" width="600">
        <v-card class="rounded-lg elevation-3">
          <v-card-title class="headline"
            >{{ isEditing ? "Edit" : "Add" }} Tag</v-card-title
          >
          <v-card-text>
            <v-text-field
              v-model="newTag.name"
              label="Category"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeAdd()">Cancel</v-btn>
            <v-btn color="primary" @click="submitTag()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="isAddCategory" width="400">
        <v-card class="rounded-lg elevation-3">
            <v-card-title class="headline">Add Category</v-card-title>
            <v-card-text>
            <v-text-field
                v-model="newCategory.name"
                label="Category Name"
                required
            ></v-text-field>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="isAddCategory = false">Cancel</v-btn>
            <v-btn color="primary" @click="submitCategory">Save</v-btn>
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

const tags = ref([]);
const isAdd = ref(false);
const isEditing = ref(false);
const selectedTagTypeId = ref(null);
const selectedTagId = ref(null);
const selectedTags = ref([]);
const user = ref(null);
const tagTypes = ref([]);
const isAddCategory = ref(false);
const newCategory = ref({ name: "" });


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const newTag = ref({
  name: "",
});

const API_URL = "http://localhost:3201/bookwormapi/tags";
const API_TAG_TYPES_URL = "http://localhost:3201/bookwormapi/tagtypes";

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    await loadTagTypes();
  if (selectedTagTypeId.value) {
    await loadTags(selectedTagTypeId.value)
  }
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

async function loadTags(id) {
    if (!id) {
    tags.value = [];
    return;
  }
    try {
    const res = await axios.get(`${API_URL}/byTagType/${id}`);
    tags.value = res.data;
  } catch (err) {
    showError(err);
  }
}

async function loadTagTypes() {
  try {
    const res = await axios.get(API_TAG_TYPES_URL, getAuthConfig());
    tagTypes.value = res.data;
  } catch (err) {
    showError(err);
  }
}

function openAdd() {
  isAdd.value = true;
  isEditing.value = false;
  newTag.value = { name: "" };
}

function closeAdd() {
  isAdd.value = false;
  newTag.value = { name: "" };
  selectedTagId.value = null;
}

function openAddCategory() {
  isAddCategory.value = true;
  newCategory.value = { name: "" };
}

async function submitCategory() {
  try {
    const res = await axios.post(API_TAG_TYPES_URL, newCategory.value, getAuthConfig());
    showSuccess("Category created successfully.");
    isAddCategory.value = false;
    newCategory.value = { name: "" };
    await loadTagTypes();
  } catch (err) {
    showError(err);
  }
}

async function deleteSelectedCategory() {
  try {
    if (!selectedTagTypeId.value) {
      showError({ response: { data: { message: "No category selected." } } });
      return;
    }
    await axios.delete(`${API_TAG_TYPES_URL}/${selectedTagTypeId.value}`, getAuthConfig());
    showSuccess("Category deleted.");
    selectedTagTypeId.value = null;
    await loadTagTypes();
    await loadTags();
  } catch (err) {
    showError(err);
  }
}

function editTag(tag) {
  selectedTagId.value = tag.id;
  newTag.value = {
    title: tag.name,
  };
  isEditing.value = true;
  isAdd.value = true;
}

async function submitTag() {
  try {
    if (isEditing.value && selectedTagId.value) {
      await axios.put(
        `${API_URL}/${selectedTagId.value}`,
        newTag.value,
        getAuthConfig()
      );
     const tagId = selectedTagId.value

      showSuccess("Tag updated successfully.");
    } else {
      const res = await axios.post(API_URL, newTag.value, getAuthConfig());
      showSuccess("Book created successfully.");
    }
    await loadBooks();
    closeAdd();
  } catch (err) {
    showError(err);
  }
}

async function deleteTag(id) {
  try {
    await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    await loadTags();
    showSuccess("Tag deleted.");
  } catch (err) {
    showError(err);
  }
}

async function deleteSelectedTag() {
  try {
    for (const id of selectedTags.value) {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    }
    showSuccess("Selected tags deleted.");
    selectedTags.value = [];
    await loadTags();
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
