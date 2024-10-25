<template>
  <div class="c-page">
    <div class="selected-tags">
      {{$t('selectedTags')}} <q-badge
        class="selected-tag"
        color="blue"
        v-for="(item, index) in selectTags"
        :key="item"
      >{{item}}<q-icon
          @click="removeTag(index)"
          name="close"
          class="tag-close"
        ></q-icon></q-badge>
    </div>
    <formEdit
      :formOption="formOption"
      :form="form"
    ></formEdit>
    <div class="upload-box">
      <miUpload
        :isMulti="false"
        @getFiles="getFiles"
      >
        <template v-if="uploadFile.length">
          <img
            v-if="uploadFile[0]"
            :src="uploadFile[0]"
            alt=""
          >
        </template>
      </miUpload>
    </div>
    <div class="form-footer">
      <miButton
        :label="$t('confirmPublish')"
        @click="confirmSubmit"
      ></miButton>
    </div>
  </div>
</template>

<script setup>
import formEdit from "src/components/form/index.vue"
import { getTags, insertArticle } from "src/http/article"
import { useUserStore } from "src/stores/user"
import miButton from "src/components/form/mi-button.vue"
import miUpload from "src/components/form/mi-upload.vue"
import { onMounted, ref, watch } from "vue"
import { uploadImage } from "src/http/common"

const emit = defineEmits(["submit"])

const props = defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  descForm: {
    type: Object,
    default: () => ({})
  },
  upImages: {
    type: Array,
    default: () => []
  },
})

const uploadFile = ref([])

const selectTags = ref([])

const form = ref({})

watch(() => props.tags, (nv) => {
  selectTags.value = nv
}, { deep: true, immediate: true })

watch(() => props.descForm, (nv) => {
  form.value = nv
}, { deep: true, immediate: true })

watch(() => props.upImages, (nv) => {
  uploadFile.value = nv
}, { deep: true, immediate: true })

const formOption = ref([
  {
    key: "tag",
    type: 'select2',
    label: 'selectOrCustomTag',
    data: () => tagData.value,
    rules: [],
    attrs: {
      multiple: true
    },
    events: {
      change(key, value, form, option) {
        selectTags.value.push(key)
        form.tag = ""
      }
    },
    slot: '',
  },
  {
    key: 'ac_desc',
    label: 'articleSummary',
    type: "textarea",
    rules: [],
    attrs: {
      borderless: false,
      outlined: true,
    },
    events: {},
    slot: '',
  }
]);

const getFiles = async (files) => {
  let res = await uploadImage(files)
  uploadFile.value = res.data
}


const tagData = ref([])

const removeTag = (index) => {
  selectTags.value.splice(index, 1)
}

const getTagData = async () => {
  let res = await getTags()
  tagData.value = res.data
}
getTagData()
onMounted(async () => {

})

const confirmSubmit = () => {
  form.value.tags = selectTags.value.join(",")
  if (uploadFile.value.length) {
    form.value.imgSrc = uploadFile.value[0]
  }
  emit("submit", form.value)
}


</script>

<style lang="scss" scoped>
.c-page {
  height: calc(100%);
  position: relative;
  .selected-tags {
    padding: 18px 16px;
    margin-bottom: 20px;
    .selected-tag {
      position: relative;
      padding: 8px 16px;
      margin-right: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      margin-left: 5px;
      .tag-close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px;
        transform: translate(50%, -50%);
        color: #fff;
        border-radius: 50%;
        border: 1px solid;
        background-color: #000;
        cursor: pointer;
      }
    }
  }
  .upload-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200px;
    img {
      width: 100%;
      height: 195px;
      object-fit: scale-down;
    }
  }
  .form-footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
}
</style>