<template>
    <div v-if="visible" class="loading-overlay">
        <div class="spinner"></div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
html,
body,
#app {
    height: 100%;
    margin: 0;
    padding: 0;
}

.loading-overlay {
    position: absolute;
    /* fix on viewport */
    top: 0;
    left: 0;
    width: 100%;
    /* full viewport width */
    height: 100%;
    /* full viewport height */
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    /* use flex */
    justify-content: center;
    /* center horizontally */
    align-items: center;
    /* center vertically */
    z-index: 9999;
    /* above all content */
    margin: 0;
    padding: 0;
    overflow: hidden;
    /* prevent scroll */
}

.spinner {
    width: 50px;
    height: 50px;
    border: 6px solid #ccc;
    border-top-color: #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Responsive */
@media (max-width: 600px) {
    .spinner {
        width: 40px;
        height: 40px;
        border-width: 5px;
    }
}
</style>
