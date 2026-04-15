<template>
  <span class="corner corner--tl" aria-hidden="true"></span>
  <span class="corner corner--tr" aria-hidden="true"></span>
  <span class="corner corner--bl" aria-hidden="true"></span>
  <span class="corner corner--br" aria-hidden="true"></span>
</template>

<style scoped>
.corner {
  position: absolute;
  width: 10px;
  height: 10px;
  pointer-events: none;
  z-index: 1;
}
.corner--tl {
  top: 3px;
  left: 3px;
  border-top: 2px solid var(--color-border-corner);
  border-left: 2px solid var(--color-border-corner);
  border-radius: 2px 0 0 0;
}
.corner--tr {
  top: 3px;
  right: 3px;
  border-top: 2px solid var(--color-border-corner);
  border-right: 2px solid var(--color-border-corner);
  border-radius: 0 2px 0 0;
}
.corner--bl {
  bottom: 3px;
  left: 3px;
  border-bottom: 2px solid var(--color-border-corner);
  border-left: 2px solid var(--color-border-corner);
  border-radius: 0 0 0 2px;
}
.corner--br {
  bottom: 3px;
  right: 3px;
  border-bottom: 2px solid var(--color-border-corner);
  border-right: 2px solid var(--color-border-corner);
  border-radius: 0 0 2px 0;
}
</style>
