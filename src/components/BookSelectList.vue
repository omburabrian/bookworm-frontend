<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="bookSelectionDialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                class="text-none font-weight-regular"
                prepend-icon="mdi-book-open-variant"
                text="Select Book"
                variant="tonal" v-bind="activatorProps">
            </v-btn>
            </template>

            <v-card prepend-icon="mdi-book-open-variant" title="Select Book">

                <v-card-text>
                    <v-row dense>
                        <v-col >
                            <v-autocomplete
                                v-model="selectedBook"
                                :items="bookList"
                                label="Book Title" auto-select-first>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text>
                    {{ customDataFromParent }}
                </v-card-text>
                <v-card-text>
                    {{ moreDataFromParent }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Close" variant="plain" @click="close"></v-btn>
                    <v-btn color="primary" text="Save" variant="tonal" @click="close"></v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>

import { shallowRef, ref } from 'vue'

defineProps({
  //    modelValue: Boolean, // for v-model binding
  bookList: Array,
  selectedBook: null,
  customDataFromParent: String,
  moreDataFromParent: String,
  bookList: Array,
});

const bookSelectionDialog = shallowRef(false)
const selectedBook = ref(null)

function close() {
    //  Close this dialog.  It is defined as "BookSelectList" in the parent.
    //  ToDo:  How close it without referencing the parent defined name?
    bookSelectionDialog.value = false;
    console.log(selectedBook.value);
    alert('selected book = ' + selectedBook.value);
}


</script>




