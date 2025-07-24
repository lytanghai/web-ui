<template>
  <div class="loading-overlay">
    <div class="loading-content">
      <img src="../assets/raha-money.gif" alt="Loading..." class="loading-gif" />
       <p class="loading-text">Loading Millionaire Project<span class="dot-animation"></span></p>
    </div>
  </div>
</template>

<script setup>
// No script logic needed
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(65, 62, 62, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: all;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-gif {
  width: 80px;
  height: 80px;
}

.loading-text {
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 500;
}

.dot-animation::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}
@keyframes dots {
  0% {
    content: '';
  }
  25% {
    content: '.';
  }
  50% {
    content: '..';
  }
  75% {
    content: '...!';
  }
  100% {
    content: '';
  }
}

@media (max-width: 600px) {
  .loading-gif {
    width: 60px;
    height: 60px;
  }

  .loading-text {
    font-size: 0.95rem;
  }
}
</style>
