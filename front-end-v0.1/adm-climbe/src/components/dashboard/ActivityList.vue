<template>
  <section class="card">
    <h2 class="card-title">{{ title }}</h2>
    <hr />
    <ul class="item-list">
      <li class="list-item">
        <span class="dot"></span>
        <div class="text-container">
          <span class="item-title">Contrato ABC assinado e está ativo</span>
          <span class="item-time">2 horas atrás</span>
        </div>
        <span class="status-badge active">Ativo</span>
      </li>
      <li class="list-item">
        <span class="dot"></span>
        <div class="text-container">
          <span class="item-title">Contrato ABC assinado e está ativo</span>
          <span class="item-time">2 horas atrás</span>
        </div>
        <span class="status-badge active">Ativo</span>
      </li>
      <li class="list-item">
        <span class="dot"></span>
        <div class="text-container">
          <span class="item-title">Contrato ABC assinado e está ativo</span>
          <span class="item-time">2 horas atrás</span>
        </div>
        <span class="status-badge active">Ativo</span>
      </li>
      <li class="list-item">
        <span class="dot"></span>
        <div class="text-container">
          <span class="item-title">Contrato ABC assinado e está ativo</span>
          <span class="item-time">2 horas atrás</span>
        </div>
        <span class="status-badge active">Ativo</span>
      </li>
      <li class="list-item">
        <span class="dot"></span>
        <div class="text-container">
          <span class="item-title">Contrato ABC assinado e está ativo</span>
          <span class="item-time">2 horas atrás</span>
        </div>
        <span class="status-badge active">Ativo</span>
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
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.list-item:last-child {
  border-bottom: none;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #77B4E6;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.text-container {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 0.95rem;
  color: #212529;
}

.item-time {
  display: block;
  font-size: 0.8rem;
  color: #6C757D;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.active {
  background-color: #CFF8D2;
  border: #B5EDB9 solid 1px;
  color: #018D0B;
}
</style>