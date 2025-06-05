<template>
  <div>
    <UserBookList :userId="userId" />
  </div>
</template>

<script>
import UserBookList from "../components/UserBookList.vue";

export default {
  components: { UserBookList },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
};
</script>
