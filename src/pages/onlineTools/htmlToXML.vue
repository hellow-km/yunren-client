<template>
  <convertPage
    :label="$t('htmlText')"
    :btnLabel="$t('toXml')"
    :resLabel="resLabel"
    @onStart="onStart"
    :maxlength="160000"
  ></convertPage>
</template>

<script setup>
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"
import { useRouter } from "vue-router";
import { defaultPageWidth, isNewDay, notify } from "src/utils";
import { useQuasar } from "quasar";
import convertPage from "../components/convertPage.vue"
import { htmlToXml } from "src/http/doNetExe";

const resLabel = ref("")

const onStart = async (htmlText) => {
  let res = await htmlToXml({ htmlText: encodeURI(htmlText) })
  resLabel.value = res.data
}
</script>

<style lang="scss" scoped>
</style>
