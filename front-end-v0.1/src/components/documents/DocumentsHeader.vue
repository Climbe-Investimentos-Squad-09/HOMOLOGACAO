<template>
  <div class="documents-container">
    <button 
      v-if="canCreate" 
      class="create-document-button" 
      @click="$emit('open-create-modal')"
    >
      + Adicionar documentos
    </button>

    <div class="documents-header">
      <div class="search-filter-section">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
              fill="#9E9E9E" />
          </svg>
          <input 
            type="text" 
            placeholder="Procure documentos..." 
            class="search-input" 
            v-model="searchQuery"
            @input="onSearchChange"
          />
        </div>

        <div class="filter-select-wrapper">
          <v-select 
            v-model="selectedFilters" 
            clearable 
            chips 
            label="Filtros" 
            :items="filterOptions" 
            multiple
            variant="outlined" 
            density="comfortable" 
            class="filter-select" 
            hide-details
            @update:model-value="onFiltersChange"
          ></v-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { canEditOrCreate } from '@/utils/permissions';

const emit = defineEmits(['search-changed', 'filters-changed', 'open-create-modal']);

const canCreate = computed(() => canEditOrCreate('documentos_juridicos'));

const searchQuery = ref("");
const filterOptions = ["Aceito", "Rejeitado", "Revisão", "Validado"];
const selectedFilters = ref([]);

const onSearchChange = () => {
  emit('search-changed', searchQuery.value);
};

const onFiltersChange = () => {
  emit('filters-changed', selectedFilters.value);
};

watch(searchQuery, (newValue) => {
  emit('search-changed', newValue);
});

watch(selectedFilters, (newValue) => {
  emit('filters-changed', newValue);
}, { deep: true });
</script>

<style scoped>
.documents-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.create-document-button {
  padding: 9px 40px;
  background-color: #3C6E6C;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.documents-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  padding: 13px 20px;
  border-radius: 8px;
  border: 1px solid #DBDBDB;
}

.search-filter-section {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
  margin-right: 1rem;
  align-items: center;
}

.search-input-wrapper {
  flex-grow: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 40px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #F6F6F6;
}

.filter-select-wrapper {
  min-width: 200px;
  max-width: 250px;
}

.filter-select {
  background-color: #f6f6f6;
}

:deep(.v-field) {
  background-color: #f6f6f6 !important;
  border-radius: 8px !important;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #3C6E6C;
  --v-field-border-width: 2px;
}

:deep(.v-chip) {
  background-color: #3C6E6C !important;
  color: white !important;
}

:deep(.v-chip .v-chip__close) {
  color: white !important;
}
</style>

