<template>
  <router-view />
  <q-ajax-bar
    ref="bar"
    position="top"
    color="blue"
    size="5px"
    v-show="isShowbar&&!noShowBar"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useHttpStore } from "./stores/http"
import { useUserStore } from "./stores/user";
import { useI18n } from "vue-i18n"
const { t: $t } = useI18n()

window.$t = $t

window.gtag = window.gtag ? window.gtag : () => { }

const noShowBar = ref(window.api.isPet || window.api.isTop)

defineOptions({
  name: 'App'
});
const bar = ref(null)
const httpStore = useHttpStore()
const isShowbar = ref(true)
watch(() => httpStore.isRequested, (nv) => {
  if (nv) {
    isShowbar.value = true
    bar.value.start()
  } else {
    let res = bar.value.stop()
    setTimeout(() => {
      isShowbar.value = false
    }, 500);
  }
}, {
  deep: true,
})


onMounted(async () => {

})

</script>


<style scoped>
</style>