<template>
  <convertPage
    :label="$t('cssText')"
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
import { cssCompress } from "src/http/tool"
const resLabel = ref("")

const onStart = async (htmlText) => {
  try {
    let res = await cssCompress({ context: htmlText })
    resLabel.value = res.data
  } catch (e) {
    resLabel.value =  $t('formatError')
  }
}
</script>

<style lang="scss" scoped>
</style>
