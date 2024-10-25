<template>
  <div class="upload-article-page">
    <div class="article-title">
      <div
        class="title-back"
        @click="toBack"
      ><q-icon name="arrow_back"></q-icon> {{$t("back")}}</div>
      <div>{{$t("title")}}</div>
      <div class="title-inputbox">
        <miInput
          input-style="padding-left:15px;font-size:16px"
          outlined
          rounded
          :borderless="false"
          v-model="form.title"
        ></miInput>
      </div>
      <div>
        <miButton
          size="16px"
          @click="onSubmit"
          :label="$t('sendCommit')"
        ></miButton>
      </div>
    </div>
    <div class="article-content">
      <div id="vEditor"></div>
    </div>
    <miDialog
      style="max-width:auto"
      width="600px"
      height="615px"
      v-model="submitDialog"
    >
      <dialogContent
        @submit="confirmSubmit"
        :tags="articleData.tags?articleData.tags.split(','):[]"
        :descForm="{ac_desc:articleData.ac_desc}"
        :upImages="[articleData.imgSrc]"
      ></dialogContent>
    </miDialog>
  </div>
</template>

<script setup>
import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"
import { computed, onMounted, ref } from 'vue';
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import { getArticleByID, insertArticle } from "src/http/article"
import { useUserStore } from 'src/stores/user';
import miDialog from "src/components/mi-dialog.vue"
import dialogContent from "./components/upload-dialogContent.vue"
import { notify } from 'src/utils';
import { useRoute, useRouter } from 'vue-router';
import { config } from 'src/config';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
defineOptions({
  name: 'uploadArticle'
});

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const submitDialog = ref(false)

const form = ref({})

const onSubmit = () => {
  if (!form.value.title) {
    notify($t("commitNo.noTitle"), "warning")
    return
  }
  if (!form.value.context) {
    notify($t("commitNo.noContent"), "warning")
    return
  }
  submitDialog.value = true
}

const confirmSubmit = async (form2) => {
  const userStore = useUserStore()
  form.value.title = encodeURI(form.value.title)
  Object.assign(form.value, form2, {
    user_ID: userStore.user.user_ID,
    author: userStore.user.nickName,
    article_ID: article_ID.value
  })
  let res = await insertArticle(form.value)
  if (res.code === 0) {
    notify($t("commitNo.success"))
    router.push({
      name: "personalCenter", query: {
        tab: 2
      }
    })
  }
}

const article_ID = ref("")

//获取文章数据
const getArticleData = async () => {
  let res = await getArticleByID({ ID: article_ID.value })
  return res.data
}

const contentEdit = ref(null)
const articleData = ref({})
const init = async () => {
  let cacheEnable = true
  if (route.params.uID == user.value.user_ID) {
    if (route.query.aID) {
      article_ID.value = route.query.aID
      let aData = await getArticleData()
      articleData.value = aData
      form.value.title = aData.title
      form.value.context = aData.context
      cacheEnable = false
    } else {
      let editorContext = localStorage.getItem("vditorvEditor") || ""
      form.value.context = editorContext
    }

  } else {
    notify("error", "warning")
  }
  contentEdit.value = new Vditor('vEditor', {
    height: "calc(100vh - 180px)",
    mode: 'sv',
    cache: {
      enable: cacheEnable
    },
    toolbar: [
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "|",
      "line",
      "quote",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "code",
      "inline-code",
      "insert-after",
      "insert-before",
      "undo",
      "redo",
      "upload",
      "link",
      "table",
      "record",
      "edit-mode",
      "both",
      "preview",
      "fullscreen",
      "outline",
      "code-theme",
      "content-theme",
      "export",
      "br"
    ],
    input(val) {
      form.value.context = encodeURI(val)
    },
    after() {
      contentEdit.value.setValue(form.value.context)
    },
    upload: {
      url: (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.yunren.online:14243") + '/v1/common/upload_article', // Replace this with your actual upload endpoint
      headers: {
        'Authorization': localStorage.getItem("token") // If authentication is required
      },
      fieldName: 'files', // The field name for file data in the request
      max: 1024 * 1024 * 30, // Maximum file size allowed (in bytes)
      accept: 'image/*', // File types accepted
      multiple: false, // Whether to allow multiple file uploads
      format: (files, reponseText) => {
        let res = JSON.parse(reponseText)

        const result = JSON.stringify({
          code: 0,
          data: { errFiles: '', succMap: { [files[0].name]: res.data[0] } },
        });
        return result;
      },
    }
  })
}

onMounted(async () => {
  init()
})


const toBack = () => {
  router.go(-1)
}
</script>


<style lang="scss" scoped>
.upload-article-page {
  .article-title {
    margin: 20px 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    .title-back {
      cursor: pointer;
      margin-right: 10px;
      border-radius: 6px;
      padding: 6px;
      &:hover {
        background-color: var(--blue);
        color: #fff;
      }
    }
    .title-inputbox {
      margin: 0 15px;
      width: 50%;
    }
  }
  .article-content {
    margin: 15px;
  }
  .confirm-footer {
  }
}
// ::v-deep .vditor-toolbar {
//   padding-left: 50px !important;
// }
// ::v-deep .vditor-reset {
//   padding: 50px !important;
// }
</style>