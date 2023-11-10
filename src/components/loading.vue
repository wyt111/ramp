<template>
  <div id="loading-indicator">
    <div class="loadingGIF"><img src="../../public/loading.gif" /></div>
  </div>
</template>
<script>
export default {
  name: "CustomLoading",
};
</script>

<style lang="scss" scoped>
html,
body,
#loading-indicator {
  width: 100%;
  height: 100%;
}
#loading-indicator {
  .loadingGIF {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loadingGIF img {
    width: 100px;
    height: 100px;
  }
}
</style>
