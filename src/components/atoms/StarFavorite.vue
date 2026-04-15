<script setup lang="ts">
import { computed } from 'vue'
import { useFavorites } from '../../composables/useFavorites'

const props = defineProps<{ itemId: number }>()
const { isFavorite, toggleFavorite } = useFavorites()

const active = computed(() => isFavorite(props.itemId))
</script>

<template>
  <button
    class="star-btn"
    :class="{ 'star-btn--active': active }"
    :title="active ? 'Retirer des favoris' : 'Ajouter aux favoris'"
    @click.stop="toggleFavorite(itemId)"
  >
    ★
  </button>
</template>

<style scoped>
.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0.1rem;
  color: var(--color-border);
  transition: color 0.15s, transform 0.1s;
}
.star-btn:hover {
  color: var(--color-accent);
  transform: scale(1.15);
}
.star-btn--active {
  color: var(--color-accent);
}
.star-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 2px;
}
</style>
