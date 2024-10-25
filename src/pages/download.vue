<template>
  <div class="download-page">
    <pre>{{$t("simpleApk")}}</pre>
    <a href="https://www.yunren.online:14243/apk/1.0.0/app-release.apk">
      <miButton :label="'apk '+$t('download')"></miButton>
    </a>
  </div>
</template>

<script setup>
import contentItembar from "src/components/contentItembar.vue"
import miButton from "src/components/form/mi-button.vue"

</script>

<style lang="scss" scoped>
.download-page {
  padding: 25px;
}
</style>
