<template>
  <section class="card">
    <h2 class="card-title">{{ title }}</h2>
    <hr>
    <ul class="item-list">
      <li class="list-item">
        <div>
          <p>Renovação de contrato - TechCorp</p>
          <small>Data final: 14/09/2025</small>
        </div>
        <span class="status-badge high-priority">Alta</span>
      </li>
      <li class="list-item">
        <div>
          <p>Renovação de contrato - TechCorp</p>
          <small>Data final: 14/09/2025</small>
        </div>
        <span class="status-badge high-priority">Alta</span>
      </li>
      <li class="list-item">
        <div>
          <p>Renovação de contrato - TechCorp</p>
          <small>Data final: 14/09/2025</small>
        </div>
        <span class="status-badge high-priority">Alta</span>
      </li>
      <li class="list-item">
        <div>
          <p>Renovação de contrato - TechCorp</p>
          <small>Data final: 14/09/2025</small>
        </div>
        <span class="status-badge high-priority">Alta</span>
      </li>
      <li class="list-item">
        <div>
          <p>Renovação de contrato - TechCorp</p>
          <small>Data final: 14/09/2025</small>
        </div>
        <span class="status-badge high-priority">Alta</span>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({ title: String });
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E9ECEF;
}

.card hr {
  border: 1px solid #EBEBEB;
  margin-bottom: 7px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.item-list::-webkit-scrollbar {
  width: 6px;
}

.item-list::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
}

.item-list:hover::-webkit-scrollbar-thumb {
  background-color: #ccc;
}

.item-list::-webkit-scrollbar-track {
  background: transparent;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #F8F9FA;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.high-priority {
  background-color: #FFCFCF;
  border: #FFB9B9 solid 1px;
  color: #AE3B3B;
}
</style>