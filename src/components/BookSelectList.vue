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
                                item-title="title"
                                item-value="id"
                                return-object
                                label="Book Title"
                                auto-select-first>
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-card-text>

                <!-- 
                <v-card-text>
                    {{ customDataFromParent }}
                </v-card-text>
                <v-card-text>
                    {{ moreDataFromParent }}
                </v-card-text>
                -->

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
  customDataFromParent: String,
  moreDataFromParent: String,
});

//  This dialog, defined by template, above.
const bookSelectionDialog = shallowRef(false)

//  Set default blank values for selectedBook.
//  TODO:  Do this in onMounted()?
//  Selected book in bookList is getting cleared.
//  Disassociate the model and the intialization of the controls.
/*
const selectedBook = ref({
    id: null,
    title: ""
})
//  */
const selectedBook = ref();

function close() {
    bookSelectionDialog.value = false;  //  Close this dialog.
    /*
    console.log('close() : selectedBook.value: id - title = '
        + selectedBook.value.id
        + ' - '
        + selectedBook.value.title);
    //  */
    sendDataToParent();
}

// Define the emit event
const emit = defineEmits(['closeWithData'])

const sendDataToParent = () => {

    //  console.log('sendDataToParent callback() : selectedBook.value = ' + selectedBook.value);

    const data = {
        //  name: 'John Doe',
        //  age: 30,
        selectedBookId: selectedBook.value.id,
        selectedBookTitle: selectedBook.value.title,
        //  TODO:  THIS IS OK.  JUST DON'T CHANGE IT IN THE PARENT?
        //  Don't return this.  May be the actual object and mess up the bookList.
        //  Don't need it anyway.
        selectedBook: selectedBook.value
    }

    emit('closeWithData', data)
}

</script>




