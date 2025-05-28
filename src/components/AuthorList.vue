<template>
  <div>
    <v-btn color="primary" @click="openForm">Add Author</v-btn>
    <v-list two-line>
      <v-list-item v-for="author in authors" :key="author.authorId">
        <v-list-item-content>
          <v-list-item-title>{{ author.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ author.description }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="editAuthor(author)"
            ><v-icon>mdi-pencil</v-icon></v-btn
          >
          <v-btn icon @click="deleteAuthor(author.authorId)"
            ><v-icon color="red">mdi-delete</v-icon></v-btn
          >
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-dialog v-model="showForm" persistent max-width="600">
      <v-card>
        <v-card-title>{{ isEdit ? "Edit" : "Add" }} Author</v-card-title>
        <v-card-text>
          <AuthorForm
            :modelValue="selectedAuthor"
            :isEdit="isEdit"
            @submit="handleSubmit"
            @cancel="closeForm"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AuthorForm from "./AuthorForm.vue";
import authorService from "../services/authorServices";

const authors = ref([]);
const showForm = ref(false);
const isEdit = ref(false);
const selectedAuthor = ref(null);

onMounted(() => {
  loadAuthors();
});

async function loadAuthors() {
  const response = await authorService.getAuthors();
  authors.value = response.data;
}

function openForm() {
  selectedAuthor.value = null;
  isEdit.value = false;
  showForm.value = true;
}

function editAuthor(author) {
  selectedAuthor.value = { ...author };
  isEdit.value = true;
  showForm.value = true;
}

async function handleSubmit(data) {
  if (isEdit.value && selectedAuthor.value) {
    await authorService.updateAuthor({ ...selectedAuthor.value, ...data });
  } else {
    await authorService.addAuthor(data);
  }
  closeForm();
  await loadAuthors();
}

async function deleteAuthor(id) {
  await authorService.deleteAuthor(id);
  await loadAuthors();
}

function closeForm() {
  showForm.value = false;
  selectedAuthor.value = null;
  isEdit.value = false;
}
</script>
