<template>
  <div class="authorizations-view">
    <AuthorizationsTable :authorizations="allAuthorizations" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuthorizationsTable from '../components/authorizations/AuthorizationsTable.vue';

const allAuthorizations = ref([
  {
    id: 'AUTH-001',
    fullName: 'Ana Silva',
    email: 'john.smith@company.com',
    category: 'Login',
  },
  {
    id: 'AUTH-002',
    fullName: 'Ana Silva',
    email: 'john.smith@company.com',
    category: 'Login',
  },
  {
    id: 'AUTH-003',
    fullName: 'Ana Silva',
    email: 'john.smith@company.com',
    category: 'Permissões',
  },
]);
</script>

<style scoped>
.authorizations-view {
  padding: 1rem;
}
</style>
