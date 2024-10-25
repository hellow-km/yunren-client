<template>
  <convertPage
    :label="$t('jsonText')"
    :btnLabel="$t('compress')"
    :resLabel="resLabel"
    @onStart="onStart"
  ></convertPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import { useRouter } from "vue-router";
import { defaultPageWidth, isNewDay, notify } from "src/utils";
import { useQuasar } from "quasar";
import convertPage from "../components/convertPage.vue"
import { minify } from "terser";
const resLabel = ref("")

const onStart = async (htmlText) => {
  try {
    var result = await minify(`var a=${htmlText}`);
    resLabel.value = result.code.substring("var a=".length)
  } catch (e) {
    resLabel.value = $t('formatError')
  }
}
</script>

<style lang="scss" scoped>
</style>
