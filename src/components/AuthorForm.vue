<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="author.name"
      label="Author Name"
      required
    ></v-text-field>
    <v-textarea
      v-model="author.description"
      label="Description"
      required
    ></v-textarea>
    <v-btn type="submit" color="primary">{{ isEdit ? 'Update' : 'Add' }}</v-btn>
    <v-btn color="grey" @click="$emit('cancel')">Cancel</v-btn>
  </v-form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: Object,
  isEdit: Boolean
});
const emit = defineEmits(['submit', 'cancel']);

const author = reactive({ name: '', description: '' });

watch(() => props.modelValue, (val) => {
  if (val) {
    author.name = val.name;
    author.description = val.description;
  }
}, { immediate: true });

function onSubmit() {
  emit('submit', { ...author });
  author.name = '';
  author.description = '';
}
</script>