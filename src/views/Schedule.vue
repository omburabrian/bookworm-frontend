<template>
  <v-container>
    <div>
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold"
            >Reading Schedule</v-card-title
          >
        </v-col>

        <v-col cols="12" md="auto" class="ml-auto">
          <v-row dense class="justify-start mb-2">
            <v-col cols="12" md="auto">
              <v-btn block color="primary" class="mb-2 mr-2" @click="openAdd()"
                >Create Schedule</v-btn
              >
            </v-col>
            <v-col cols="12" md="auto">
              <v-btn
                block
                color="primary"
                class="mb-2 mr-2"
                @click="openProgress()"
                >Reading Progress</v-btn
              >
            </v-col>
            <!-- <v-col cols="12" md="auto">
              <v-btn
                block
                color="primary"
                class="mb-2 mr-2"
                @click="openWishList()"
                >My Wish List</v-btn
              >
            </v-col> -->
          </v-row>
        </v-col>
      </v-row>
<!------------------------------QUICK GLANCE AT BOOK INFO AND SCHEDULING LOGIC----------------------------------------------->
      <div class="scrollable-list">
        <v-list v-if="readingSchedule.length > 0">
          <v-list-item
            v-for="item in readingSchedule"
            :key="item.bookId"
            class="mb-2"
          >
            <v-row align="center" class="w-100" dense>
              <v-col cols="12" sm="9">
                <v-list-item-content class="text-left">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <strong>Book Title:</strong> {{ item.book.title }}<br />
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-list-item-title
                          ><strong>Status:</strong>
                          {{ item.listType }}</v-list-item-title
                        >
                        <!-- <v-list-item-title
                          ><strong>Owned:</strong>
                          {{ item.isOwned ? "Yes" : "No" }}</v-list-item-title
                        > -->
                        <v-list-item-title
                          ><strong>Start Date:</strong>
                          {{ item.startDate }}</v-list-item-title
                        >
                        <v-list-item-title
                          ><strong>Finish Date:</strong>
                          {{ item.stopDate }}</v-list-item-title
                        >
                        <v-list-item-title
                          ><strong>Current Reading Page:</strong>
                          {{ item.currentPage }}</v-list-item-title
                        >
                        <v-list-item-title
                          ><strong>Total Book Pages:</strong>
                          {{ item.book.pageCount }}</v-list-item-title
                        >
                        <v-list-item-title
                          ><strong>My Notes:</strong>
                          {{ item.notes }}</v-list-item-title
                        >
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-list-item-content>
              </v-col>
              <v-col cols="12" sm="2" class="d-flex justify-end">
                <v-list-item-action>
                  <v-btn size="small" icon @click="editBookInfo(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                      <v-btn
                        size="small"
                        icon
                        color="red"
                        @click="removeScheduledItem(item.bookId)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>

                </v-list-item-action>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </div>
      <!------------------------------SCHEDULE CREATION DIALOG AND LOGIC----------------------------------------------->
      <v-dialog persistent v-model="isAdd" width="600">
        <v-card class="rounded-lg elevation-3">
          <v-card-title class="headline"
            >{{ isEdit ? "Edit Schedule" : "Create Schedule" }}
          </v-card-title>
          <v-card-text>
            <v-select :items="books" item-value="id" item-title="title" 
            label="Select a book" 
            required density="compact" 
            v-model="newSchedule.bookId"></v-select>
            <v-select
              :items="items"
              density="compact"
              v-model="newSchedule.listType"
              label="Status"
            ></v-select>
            <v-text-field
              v-model="newSchedule.startDate"
              label="Start Date"
              type="date"
              density="compact"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="newSchedule.stopDate"
              label="Finish Date"
              type="date"
              density="compact"
            >
            </v-text-field>

            <!-- <v-text-field
              type="number"
              label="Current Page"
              v-model="newSchedule.currentPage"
              min="0"
              
            >
            </v-text-field> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeAdd()">Cancel</v-btn>
            <v-btn color="primary" @click="submitSchedule()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!------------------------------SCHEDULE EDIT DIALOG AND LOGIC----------------------------------------------->
      <v-dialog persistent v-model="isEdit" width="600">
        <v-card class="rounded-lg elevation-3">
          <v-card-title class="headline">{{
            isEdit ? "Edit Schedule" : "Add"
          }}</v-card-title>
          <v-card-text>
            <v-select
              :items="items"
              density="compact"
              v-model="scheduleBookItems.listType"
              label="Status"
            ></v-select>
            <!-- <v-switch
              v-model="scheduleBookItems.isOwned"
              label="Do you own this book?"
            ></v-switch> -->
            <v-textarea
              v-model="scheduleBookItems.notes"
              label="My Notes"
              rows="3"
              density="compact"
            >
            </v-textarea>
            <v-text-field
              v-model="scheduleBookItems.currentPage"
              label="Current Page"
              type="number"
              required
              :disabled="scheduleBookItems.listType === 'finished'"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeEdit()">Cancel</v-btn>
            <v-btn color="primary" @click="submitScheduleEdit()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!------------------------------READING PROGRESS DIALOG AND LOGIC----------------------------------------------->
      <v-dialog persistent v-model="isProgress" width="500">
        <v-card class="rounded-lg elevation-25">
          <v-card-title class="headline">{{
            isProgress ? "Check Reading Progress" : " "
          }}</v-card-title>
          <v-card-text>
            <v-combobox
              label="Select book to view progress"
              :items="currentlyReading"
              item-value="bookId"
              item-title="book.title"
              v-model="selectedBookId"
              @update:modelValue="showReadingProgress"
            ></v-combobox>
            <v-card v-if="computeScheduleResults && computeScheduleResults.bookTitle" >
              <v-card-text>
                
                  <strong>Book Title:</strong> {{ computeScheduleResults.bookTitle }}</br>
                <p>
                  <strong>Current Page:</strong>
                  {{ computeScheduleResults.currentPage }}
                </p>
                <p>
                  <strong>Total Pages:</strong>
                  {{ computeScheduleResults.totalPages }}
                </p>
                <p>
                  <strong>Pages Left:</strong>
                  {{ computeScheduleResults.pagesLeft }}
                </p>
                <p>
                  <strong>Daily Pages Needed:</strong>
                  {{ computeScheduleResults.dailyPages }}
                </p>
                <p>
                  <strong>Reading Dates:</strong>
                  {{ computeScheduleResults.startDate }} to
                  {{ computeScheduleResults.endDate }}
                </p>
                <p>
                  <strong>Days Remaining:</strong>
                  {{ computeScheduleResults.days }}
                </p>
              </v-card-text>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="clearDialog()">Clear</v-btn>
            <v-btn color="primary" @click="closeProgress()">Close</v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
<!------------------------------WISHLIST DIALOG AND LOGIC----------------------------------------------->
      <!-- <v-dialog persistent v-model="isWishList" width="500">
        <v-card class="rounded-lg elevation-25">
          <v-card-title class="headline">{{
            isWishList ? "Books I want to read" : " "
          }}</v-card-title>
          <v-card-text> 
            <v-list v-if="wishListBooks.length >0">
              <v-list-item v-for="bookItem in wishListBooks" :key="bookItem.bookId">
                <v-list-item-content>
                  <v-list-item-title>{{ bookItem.book.title }}</v-list-item-title>
                  <v-list-item-title>{{ bookItem.book.author }}</v-list-item-title>
                  <v-list-item-title>{{ bookItem.review.rating }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <div v-else class="text-center">No books in your wishlist.</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" @click="closeWishList()">Close</v-btn>
            <v-btn color="primary" @click="startReadingBook(item)">Start Reading</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
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
import { computed } from "vue";
import axios from "axios";

const isAdd = ref(false);
const isEdit = ref(false);
const isWishList = ref(false);
const isProgress = ref(false);
const selectedBookId = ref(null);
const readingSchedule = ref([]);
const user = ref(null);
const books =ref([])
//const wishListBooks = ref([]);
const items = ["reading", "planned"]
const computeScheduleResults = ref([]);
const newSchedule = ref({
  listType: "",
  currentPage: 0,
  startDate: "",
  stopDate: "",
  bookId:null
});

const scheduleBookItems = ref({
  listType: "",
  currentPage: "",
  notes: "",
  isOwned: false,
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
//only display books that are currently being read on the combobox
const currentlyReading = computed(() => {
  return readingSchedule.value.filter((item) => item.listType === "reading");
});
const API_URL = "http://localhost:3201/bookwormapi"; //API

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));

  if (user.value) {
    await loadSchedule();
  } else {
    console.error("User not found ");
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
//load schedule from backend
async function loadSchedule() {
  try {
    const res = await axios.get(
      `${API_URL}/readingSchedule/userBooks/${user.value.id}`,
      getAuthConfig()
    );

    console.log(res.data);

    readingSchedule.value = Array.isArray(res.data) ? res.data : [res.data];

    console.log("ReadingS Schedule", readingSchedule.value);
  } catch (err) {
    console.error("Error loading schedule:", err);
  }
}
//get all books
async function loadBooks() {
  try {
    const res = await axios.get(`${API_URL}/books`, getAuthConfig());
  
    const data = res.data;

    let allBooks = [];
    if (Array.isArray(data)) {
      allBooks = data;
    } else if (Array.isArray(data?.books)) {
      allBooks = data.books;
    }

    // Filter out books already in schedule
    books.value = allBooks.filter(book => 
      !readingSchedule.value.some(scheduled => scheduled.bookId === book.id)
    );

    console.log("Available Books:", books.value); 

  } catch (err) {
    console.error("Error loading books:", err);
    showError(err);
  }
}

//use local values
async function showReadingProgress() {
  try {
    const bookId = selectedBookId.value.bookId;
    const schedule = readingSchedule.value.find(item => item.bookId === bookId);

    if (!schedule) {
      showError({ message: "Schedule not found." });
      return;
    }

    // Calculate locally (no API call needed)
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.stopDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const pagesLeft = schedule.book.pageCount - schedule.currentPage;
    const dailyPages = Math.ceil(pagesLeft / days);

    computeScheduleResults.value = {
      bookTitle: schedule.book.title,
      currentPage: schedule.currentPage,
      totalPages: schedule.book.pageCount,
      pagesLeft,
      startDate: schedule.startDate,
      endDate: schedule.stopDate,
      days,
      dailyPages
    };

  } catch (err) {
    showError(err);
  }
}

async function submitSchedule() {
  try {
    const userId = user.value.id;
    const { bookId, listType, startDate, stopDate } = newSchedule.value;

    if (!bookId || !listType) {
      showError({ message: "Please select a book and status." });
      return;
    }
    if (listType === "reading") {
      if (!startDate || !stopDate) {
        showError({ message: "Start and Finish Dates required" });
        return;
      }
      // Add book to reading schedule
      await axios.post(
        `${API_URL}/readingSchedule/createSchedule/${userId}/${bookId}`,
        {
          startDate,
          stopDate,
          currentPage: 0,
          listType: "reading",
        },
        getAuthConfig()
      );

      showSuccess("Book added to reading schedule.");
     } 
     else if (listType === "planned") {
      await axios.post(
        `${API_URL}/readingSchedule/wishlist/${userId}/${bookId}`,
        {
          startDate: startDate || null,
          stopDate: stopDate || null,
        },
        getAuthConfig()
      );

      showSuccess("Book added to wishlist.");
    } else {
      showError();
    }

    isAdd.value = false;
    await loadSchedule();
  } catch (err) {
    console.error("Error saving schedule:", err);
    showError(err);
  }
}
async function submitScheduleEdit() {
  try {
    const userId = user.value.id;
    const bookId = scheduleBookItems.value.bookId;
    await axios.put(
      `${API_URL}/readingSchedule/progress/${userId}/${bookId}`,
      {
        listType: scheduleBookItems.value.listType,
        currentPage: scheduleBookItems.value.currentPage,
        notes: scheduleBookItems.value.notes,
        isOwned: scheduleBookItems.value.isOwned,
      },

      getAuthConfig()
    );
    showSuccess("Schedule updated successfully.");
    isEdit.value = false;
    scheduleBookItems.value = {
      currentPage: "",
      myNotes: "",
    };
    await loadSchedule();
  } catch (err) {
    showError(err);
  }
}
async function removeScheduledItem(bookId) {
  try{
    await axios.delete(`${API_URL}/readingSchedule/remove/${user.value.id}/${bookId}`
    ,getAuthConfig())
  
  showSuccess("Record Deleted");
  await loadSchedule();
}
catch (err){
  showError();
  console.log(err);
}}

// async function addToWishList(item){
//   try{
//     //check if item status===planned
//     if(!item.listType==='planed'){
//       showError("Cannot be added to wish list")
//     }
//     const userId= user.value.id;
//     const bookId=item.bookId;
//     const startDate= item.startDate||null;
//     const endDate = item.endDate||null;
//     await axios.post(
//   `${API_URL}/readingSchedule/wishList/${userId}/${bookId}`,
//   {
//     startDate,
//     endDate
//   },
//   getAuthConfig()
// );
// showSuccess("Book added to wish list");
// await loadSchedule()
//   }
//   catch (err){
// console.log(err)
// showError()
//   }
// }
function openAdd() {
  isAdd.value = true;
  isEdit.value = false;
  newSchedule.value = {
    listType: "",
    currentPage: 0,
    startDate: "",
    stopDate: "",

  };
  loadBooks();
}
function openWishList(){
  isWishList.value=true;
  
}
function openProgress() {
  isProgress.value = true;
}
function closeProgress() {
  isProgress.value = false;
}
// function closeWishList(){
//   isWishList.value=false;
// }

function editBookInfo(item) {
  isAdd.value = false;
  isEdit.value = true;
  scheduleBookItems.value = { ...item };
  if (item.listType === "finished" && item.book?.pageCount) {
    scheduleBookItems.value.currentPage = item.book.pageCount;
  }
}

function closeAdd() {
  isAdd.value = false;
  newSchedule.value = {
    listType: "",
    currentPage: 0,
    startDate: "",
    stopDate: "",
  };
}
function closeEdit() {
  isEdit.value = false;
  newSchedule.value = {
    listType: "",
    currentPage: 0,
    startDate: "",
    stopDate: "",
  };
}
function clearDialog(){
  computeScheduleResults.value="";
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
<!-----------------------------------------------Styling----------------------------------------------->
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
