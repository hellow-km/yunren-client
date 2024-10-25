<template>
  <div class="score-history">
    <q-table
      flat
      bordered
      :title="$t('scoreDetail')"
      :rows="rows"
      :columns="columns"
      row-key="ID"
      :rows-per-page-label="$t('onePage')"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) =>`总共 ${totalRowsNumber} 条`"
      @update:pagination="updatePagination"
      :pagination="{
        page:pagination.page,
        rowsPerPage:pagination.pageSize,
        rowsNumber:pagination.total,
      }"
      @request="onRequest"
    />
  </div>
</template>

<script setup>
import { getScore_subs } from "src/http/score";
import { useUserStore } from "src/stores/user";
import { formatTime } from "src/utils";
import { onMounted, ref } from "vue";

const userStore = useUserStore()

const columns = ref([
  {
    name: 'score', label: $t('scoreInOut'), field: 'score', sortable: true, format: val => {
      return val > 0 ? ("+" + val) : val
    },
    headerStyle: "width:50px"
  },
  { name: 'subText', label: $t("source"), field: 'subText', sortable: true },
  {
    name: 'createTime', label: $t("time"), field: 'createTime', sortable: true,
    format: val => {
      return formatTime(val)
    }
  },
])
const rows = ref([])

const pagination = ref({
  sortBy: 'desc',
  page: 1,
  pageSize: 10,
  total: 0
})

const getData = async () => {
  let res = await getScore_subs({
    size: pagination.value.pageSize,
    page: pagination.value.page,
    uID: userStore.user.user_ID
  })
  rows.value = res.data.data
  pagination.value.total = res.data.count
}

const onRequest = (context) => {
  Object.assign(pagination.value, {
    page: context.pagination.page,
    pageSize: context.pagination.rowsPerPage
  })
  getData()
}

const updatePagination = (pagena) => {
  console.log("pagena", pagena);
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
.score-history {
  padding: 15px;
}
</style>