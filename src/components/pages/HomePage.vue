<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'
import { useCraftingList } from '../../composables/useCraftingList'
import { useMaterialCalculator } from '../../composables/useMaterialCalculator'
import { useInventory } from '../../composables/useInventory'
import Header from '../molecules/Header.vue'
import Footer from '../molecules/Footer.vue'
import OrnateCorners from '../atoms/OrnateCorners.vue'

const { isLoggedIn } = useAuth()
const { craftingList } = useCraftingList()
const { inventory } = useInventory()
const { missingMaterials } = useMaterialCalculator(craftingList, inventory)

function navigate(page: 'items' | 'crafts' | 'login' | 'crafting-list'): void {
  ;(window as any).navigateTo?.(page)
}
</script>

<template>
  <div class="page-wrapper">
    <Header />

    <main class="home-main">
      <!-- ── Mode non-connecté : Hero + tuiles ── -->
      <template v-if="!isLoggedIn">
        <section class="hero">
          <div class="hero-inner">
            <div class="hero-icon">⚔</div>
            <h1 class="hero-title" v-translate="'site_title'"></h1>
            <p class="hero-subtitle" v-translate="'home_subtitle'"></p>
            <button class="btn-primary hero-cta" @click="navigate('items')" v-translate="'home_cta_search'"></button>
          </div>
        </section>

        <section class="tiles-section">
          <div class="tiles-grid">
            <button class="tile card-ornate" @click="navigate('items')">
              <OrnateCorners />
              <div class="tile-icon">🗡</div>
              <div class="tile-label" v-translate="'home_tile_items'"></div>
              <div class="tile-sub" v-translate="'home_tile_items_sub'"></div>
            </button>
            <button class="tile card-ornate" @click="navigate('crafts')">
              <OrnateCorners />
              <div class="tile-icon">📜</div>
              <div class="tile-label" v-translate="'home_tile_crafts'"></div>
              <div class="tile-sub" v-translate="'home_tile_crafts_sub'"></div>
            </button>
            <button class="tile card-ornate tile--disabled" disabled>
              <OrnateCorners />
              <div class="tile-icon">👾</div>
              <div class="tile-label" v-translate="'home_tile_monsters'"></div>
              <div class="tile-sub" v-translate="'home_tile_monsters_sub'"></div>
            </button>
            <button class="tile card-ornate" @click="navigate('login')">
              <OrnateCorners />
              <div class="tile-icon">👤</div>
              <div class="tile-label" v-translate="'home_tile_login'"></div>
              <div class="tile-sub" v-translate="'home_tile_login_sub'"></div>
            </button>
          </div>
        </section>
      </template>

      <!-- ── Mode connecté : Dashboard ── -->
      <template v-else>
        <section class="dashboard">
          <div class="dashboard-grid">
            <!-- Colonne gauche : liste de craft -->
            <div class="dashboard-card card-ornate">
              <OrnateCorners />
              <h2 class="dashboard-title" v-translate="'home_dashboard_crafting'"></h2>
              <div v-if="craftingList.length === 0" class="dashboard-empty">
                <p v-translate="'home_dashboard_empty_craft'"></p>
                <button class="btn-primary" @click="navigate('items')" v-translate="'home_dashboard_start'"></button>
              </div>
              <ul v-else class="craft-preview-list">
                <li
                  v-for="entry in craftingList.slice(0, 5)"
                  :key="entry.item.id"
                  class="craft-preview-item"
                >
                  <span class="craft-preview-name">{{ entry.item.name }}</span>
                  <span class="craft-preview-qty">×{{ entry.quantity }}</span>
                </li>
                <li v-if="craftingList.length > 5" class="craft-preview-more">
                  +{{ craftingList.length - 5 }} autres...
                </li>
              </ul>
              <button
                v-if="craftingList.length > 0"
                class="btn-secondary dashboard-see-list"
                @click="navigate('crafting-list')"
                v-translate="'home_dashboard_see_list'"
              ></button>
            </div>

            <!-- Colonne droite : matériaux manquants -->
            <div class="dashboard-card card-ornate">
              <OrnateCorners />
              <h2 class="dashboard-title" v-translate="'home_dashboard_missing'"></h2>
              <div v-if="missingMaterials.length === 0" class="dashboard-all-ok">
                <span v-translate="'all_materials_available'"></span>
              </div>
              <ul v-else class="missing-list">
                <li
                  v-for="mat in missingMaterials.slice(0, 8)"
                  :key="mat.item.id"
                  class="missing-item"
                >
                  <span class="missing-name">{{ mat.item.name }}</span>
                  <span class="missing-qty">×{{ mat.missing }}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </template>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home-main {
  flex: 1;
}

/* Hero */
.hero {
  background: linear-gradient(160deg, var(--color-bg-nav-top) 0%, var(--color-bg-nav) 100%);
  padding: 4rem 1.25rem;
  text-align: center;
  border-bottom: 2px solid var(--color-border-accent);
}
.hero-inner {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.hero-icon {
  font-size: 3rem;
}
.hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin: 0;
}
.hero-subtitle {
  font-size: 1rem;
  color: var(--color-text-on-dark);
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
}
.hero-cta {
  margin-top: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
}

/* Tuiles */
.tiles-section {
  padding: 2.5rem 1.25rem;
  max-width: 900px;
  margin: 0 auto;
}
.tiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}
.tile {
  padding: 1.5rem 1rem;
  text-align: center;
  cursor: pointer;
  border: none;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}
.tile:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}
.tile:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.tile--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.tile--disabled:hover {
  transform: none;
  box-shadow: none;
}
.tile-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}
.tile-label {
  font-weight: 800;
  font-size: 1rem;
  color: var(--color-text-primary);
}
.tile-sub {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Dashboard */
.dashboard {
  padding: 2rem 1.25rem;
  max-width: 1000px;
  margin: 0 auto;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 700px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

.dashboard-card {
  padding: 1.25rem 1.5rem;
}
.dashboard-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-primary);
  margin: 0 0 1rem;
}
.dashboard-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}
.dashboard-all-ok {
  color: var(--color-success);
  font-size: 0.875rem;
  font-weight: 700;
}
.dashboard-see-list {
  margin-top: 1rem;
  font-size: 0.8rem;
}

.craft-preview-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.craft-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  border-bottom: 1px dashed var(--color-border);
  padding-bottom: 0.3rem;
}
.craft-preview-name {
  font-weight: 600;
}
.craft-preview-qty {
  font-weight: 700;
  color: var(--color-accent);
}
.craft-preview-more {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-style: italic;
}

.missing-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.missing-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-error-bg);
  border-radius: 4px;
  color: var(--color-error);
}
.missing-name { font-weight: 600; }
.missing-qty { font-weight: 700; }
</style>
