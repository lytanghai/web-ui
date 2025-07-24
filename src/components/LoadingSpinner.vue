<template>
  <div class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
// no props needed
</script>

<style scoped>
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    pointer-events: all;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 6px solid #040303;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 600px) {
    .spinner {
        width: 40px;
        height: 40px;
        border-width: 5px;
    }
}
</style>
