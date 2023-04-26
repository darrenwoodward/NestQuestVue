<template>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="address" placeholder="Enter address" required>
      <button type="submit">Search</button>
    </form>
  </template>
  
  <script>
  export default {
    data() {
      return {
        address: '',
      };
    },
    methods: {
      submitForm() {
        this.$emit('form-submitted', { address: this.address });
      },
    },
  };
  </script>
  