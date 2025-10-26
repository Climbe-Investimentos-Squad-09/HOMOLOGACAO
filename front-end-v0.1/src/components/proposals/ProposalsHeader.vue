<template>
  <div class="proposals-container">
    <button class="create-proposal-button" @click="$emit('open-create-modal')">
      + Criar proposta
    </button>

    <div class="proposals-header">
      <div class="search-filter-section">


        <div class="filter-select-wrapper">
          <v-select 
            v-model="selectedFilters" 
            clearable 
            chips 
            label="Todos os status" 
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
import { ref, watch } from "vue";

const emit = defineEmits(['filters-changed']);

const filterOptions = ["Aceito", "Revisão", "Rascunho"];
const selectedFilters = ref([]);

const onFiltersChange = () => {
  emit('filters-changed', selectedFilters.value);
};

watch(selectedFilters, (newValue) => {
  emit('filters-changed', newValue);
}, { deep: true });
</script>

<style scoped>
.proposals-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 1rem;
}

.create-proposal-button {
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

.proposals-header {
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
  justify-content: flex-start;
  width: 100%; 
  align-items: center;
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