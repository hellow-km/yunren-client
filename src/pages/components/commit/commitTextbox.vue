<template>
  <div class="commitTextbox">
    <miInput
      ref="commitTextRef"
      class="commitText-ipt"
      type="textarea"
      v-model="commitText"
      :maxlength="maxlength"
      :borderless="false"
      outlined
    ></miInput>
    <span
      class="emoji-btn"
      @click="openEmoji"
    >
      <span>{{emojis[0]}}{{$t("emoji")}}</span>
      <q-popup-proxy
        v-model="emijiVisible"
        style="width:500px;max-height:500px;overflow:auto"
        :offset="[10, 10]"
        transition-show="flip-up"
        transition-hide="flip-down"
      >
        <q-banner class="bg-brown text-white">
          <emojiList
            :emojis="emojis"
            @onSelect="onSelectEmoji"
          ></emojiList>
        </q-banner>
      </q-popup-proxy>
    </span>
    <span class="text-len">{{commitText.length}}/{{maxlength}}</span>
  </div>
</template>

<script setup>
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import emojiList from "./emojiList.vue"

import { onMounted, ref, watch } from "vue"

const props = defineProps({
  maxlength: {
    type: Number,
    default: 2000
  },
  modelValue: {
    type: String,
    default: ""
  }
})

const emijiVisible = ref(false)

const emojis = ref(["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F606}", "\u{1F605}", "\u{1F923}", "\u{1F602}", "\u{1F642}", "\u{1F643}", "\u{1F609}", "\u{1F60A}", "\u{1F607}", "\u{1F970}", "\u{1F60D}", "\u{1F929}", "\u{1F618}", "\u{1F617}", "\u{1F61A}", "\u{1F619}", "\u{1F60B}", "\u{1F61B}", "\u{1F61C}", "\u{1F92A}", "\u{1F61D}", "\u{1F911}", "\u{1F917}", "\u{1F92D}", "\u{1F92B}", "\u{1F914}", "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F636}", "\u{1F60F}", "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F62E}", "\u{1F925}", "\u{1F642}", "\u{1F642}", "\u{1F60C}", "\u{1F614}", "\u{1F62A}", "\u{1F924}", "\u{1F634}", "\u{1F637}", "\u{1F912}", "\u{1F915}", "\u{1F922}", "\u{1F92E}", "\u{1F927}", "\u{1F975}", "\u{1F976}", "\u{1F974}", "\u{1F635}", "\u{1F635}", "\u{1F92F}", "\u{1F920}", "\u{1F973}", "\u{1F60E}", "\u{1F913}", "\u{1F9D0}", "\u{1F615}", "\u{1F61F}", "\u{1F641}", "\u{1F62E}", "\u{1F62F}", "\u{1F632}", "\u{1F633}", "\u{1F97A}", "\u{1F626}", "\u{1F627}", "\u{1F628}", "\u{1F630}"])

const emit = defineEmits(["update:modelValue"])

const commitText = ref("")

const commitTextRef = ref(null)

const blurIndexObj = ref({ start: 0, end: 0 })

const onSelectEmoji = (item) => {
  let startStr = commitText.value.substring(0, blurIndexObj.value.start)
  let endStr = commitText.value.substring(blurIndexObj.value.end)
  commitText.value = startStr + item + endStr
}

const textAreaEl = ref(null)

onMounted(() => {
  let qInputRef = commitTextRef.value.qInputRef.$el
  let textareaRef = qInputRef.getElementsByTagName("textarea")[0]
  textAreaEl.value = textareaRef
  textareaRef.onblur = function () {
    blurIndexObj.value.start = textareaRef.selectionStart
    blurIndexObj.value.end = textareaRef.selectionEnd
  }
})

watch(commitText, (nv) => {
  emit("update:modelValue", nv);
});

watch(
  () => props.modelValue,
  (nv) => {
    commitText.value = nv;
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.commitTextbox {
  margin: 8px 15px;
  position: relative;
  .text-len {
  }
  .emoji-btn {
    cursor: pointer;
    user-select: none;
    position: absolute;
    right: 0;
  }
  .commitText-ipt {
    margin-bottom: 10px;
  }
}
</style>