<template>
  <div class="toTop-page">
    <div class="toTop-head">置顶工具</div>
    <div class="toTop-content">
      {{$t("topHelp")}}
      <span
        class="close-btn"
        @click="closeTop"
      ><img
          width="20"
          src="../assets/images/common/close.svg"
          alt=""
        ></span>
    </div>
  </div>
</template>

<script setup>
const closeTop = () => {
  window.api.sendMessage("closeTop")
}
</script>

<style lang="scss" scoped>
.toTop-page {
  height: 100vh;
  width: 100vw;

  position: relative;
  .toTop-head {
    padding: 5px;
    padding-left: 8px;
    -webkit-app-region: drag;
    border-bottom: 1px solid #aaa;
    position: relative;
    height: 30px;
  }
  .close-btn {
    position: absolute;
    top: 5px;
    right: 8px;
    cursor: pointer;
    -webkit-app-region: none;
  }
  .toTop-content {
    font-size: 13px;
    display: flex;
    padding: 10px;
    padding-top: 25px;
    height: 100%;
  }
}
</style>