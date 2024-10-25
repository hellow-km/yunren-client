<template>
  <div class="nodata-box">
    <img
      src="../assets/images/tools/nodata.png"
      alt=""
    >
    <div class="nodata-text">{{$t("nodata")}}</div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.nodata-box {
  text-align: center;
  margin-top: 30px;
  img {
    max-width: 100%;
  }
}
.nodata-text {
  font-size: 24px;
  text-align: center;
  color: #999;
}
</style>