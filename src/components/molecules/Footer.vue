<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <p class="footer-copy">
        &copy; {{ currentYear }} <span v-translate="'footer_rights'"></span>
      </p>
      <div class="footer-links">
        <a href="#" class="footer-link" v-translate="'footer_about'"></a>
        <a href="#" class="footer-link" v-translate="'footer_contact'"></a>
        <a href="#" class="footer-link" v-translate="'footer_github'"></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-bg-nav);
  border-top: 1px solid var(--color-border-accent);
  margin-top: auto;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-copy {
  font-size: 0.8rem;
  color: var(--color-text-nav);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  font-size: 0.8rem;
  color: var(--color-text-nav);
  text-decoration: none;
  transition: color 0.15s;
}

.footer-link:hover {
  color: var(--color-text-nav-active);
}

@media (max-width: 600px) {
  .footer-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
