<template>
  <div class="button-loading-spinner">
    <svg viewBox="25 25 50 50" class="circular">
      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: "ButtonLoading",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@keyframes loading-rotate {
  to {
    transform: rotate(1turn);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
.button-loading-spinner {
  width: 0.2rem;
  height: 0.2rem;
}
.button-loading-spinner .circular {
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #ffffff;
  stroke-linecap: round;
}
</style>
