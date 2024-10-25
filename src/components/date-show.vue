<template>
  <div
    class="date-show"
    :style="{width:minWidth+'px'}"
  >
    <table
      class="date-show-table"
      :style="{width:minWidth-50+'px'}"
    >
      <thead>
        <th
          v-for="item in weeks"
          :key="item"
        >
          <div :style="{
              width:(minWidth-20)/8+'px',
              maxWidth:(minWidth-20)/8+'px'
            }">{{ item }}</div>
        </th>
      </thead>
      <tbody v-if="isShowDays">
        <tr
          v-for="(row,rowIdx) in rowNum"
          :key="row"
        >
          <td
            v-for="(day, idx) in weeks"
            :key="idx"
          >
            <div :style="{
              width:(minWidth-20)/8+'px',
              maxWidth:(minWidth-20)/8+'px'
            }">
              <slot
                name="markDay"
                v-if="isMarked(tableData[idx][rowIdx])"
              >{{markText}}</slot>
              <slot
                name="today"
                v-else-if="isToday(tableData[idx][rowIdx])"
              >
                <miButton
                  :label="$t('signin')"
                  @click="onClickToday"
                ></miButton>
              </slot>
              <span v-else>
                {{  getShowDate(tableData[idx][rowIdx]) }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatTime, getDaysInMonth } from "src/utils";
import { onMounted, ref } from "vue";
import miButton from "src/components/form/mi-button.vue"

const props = defineProps({
  markDays: {
    type: Array,
    default: () => []
  },
  markText: {
    type: String,
    default: "已签到"
  },
  minWidth: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(["onClickToday"])

const onClickToday = () => {
  emit("onClickToday")
}

const weeks = ref(["日", "一", "二", "三", "四", "五", "六"])

// 获取当前年份和月份
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // 月份是从 0 开始的，需要加 1
// 获取当前月份的所有天
const daysInCurrentMonth = ref(getDaysInMonth(currentYear, currentMonth));
const rowNum = ref(Math.ceil(daysInCurrentMonth.value.length / weeks.value.length))
const tableData = ref([[], [], [], [], [], [], []])
const isShowDays = ref(false)

const isMarked = (date) => {
  if (date) {
    return props.markDays.includes(formatTime(date, "yyyy-MM-dd"))
  } else {
    return false
  }
}

const isToday = (date) => {
  if (date) {
    return formatTime(date, "yyyy-MM-dd") == formatTime(new Date(), "yyyy-MM-dd")
  } else {
    return false
  }
}
//获取
const getShowDate = (date) => {
  if (date) {
    return date.getDate()
  } else {
    return ""
  }
}

onMounted(() => {
  tableData.value = daysInCurrentMonth.value.reduce((prev, cur, index) => {
    // 获取当前日期是星期几
    const dayOfWeek = cur.getDay();
    if (index === 0) {
      for (let i = 0; i < dayOfWeek; i++) {
        prev[i].push("")
      }
    }

    // 将日期添加到相应的星期数组中
    prev[dayOfWeek].push(cur);
    return prev;
  }, [[], [], [], [], [], [], []])
  isShowDays.value = true

})
</script>

<style lang="scss" scoped>
.date-show {
  min-height: 300px;
  .date-show-table {
    width: 100%;
    margin-top: 15px;
    td {
      text-align: center;
    }
    thead {
      height: 45px;
      vertical-align: top;
    }
    tr {
      height: 30px;
      td {
      }
    }
  }
}
</style>