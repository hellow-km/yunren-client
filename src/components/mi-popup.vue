<template>
  <q-popup-proxy>
    <slot></slot>
  </q-popup-proxy>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
</script>

<style lang="less" scoped>
</style>
