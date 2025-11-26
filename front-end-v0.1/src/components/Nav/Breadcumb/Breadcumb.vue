<template>
  <div class="breadcrumb">
    <template v-for="(item, idx) in items" :key="idx">
      <router-link
        class="crumb"
        :to="item.link || link"
      >
        {{ item.text }}
      </router-link>
      <span
        v-if="idx < items.length - 1"
        class="separator"
      >/</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    link: {
      type: String,
      default: '/'
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.crumb {
  color: var(--theme-color);
  text-decoration: none;
}

.crumb:hover {
  text-decoration: underline;
}

.separator {
  color: var(--theme-color);
}
</style>
