<template>
  <div class="article-detail-page">
    <div
      class="title-back"
      @click="toBack"
    ><q-icon name="arrow_back"></q-icon> {{ $t('back') }}</div>
    <div class="article-detail-title">{{ articleData.title }}</div>
    <div class="article-detail-info">
      <div class="detail-info-detail">
        <div class="detail-info-detail-flex">
          <div class="info-detail-author">{{ articleData.realNickName || articleData.author }}</div>
          <div class="info-detail-item info-detail-time">{{ formatTime(articleData.createTime) }}</div>
        </div>
        <div class="detail-info-detail-flex">
          <div class="info-detail-item">
            <q-icon name="visibility"></q-icon> {{ $t('readCount') }} {{ articleData.readNum || 0 }}
          </div>
          <div
            class="info-detail-item hover-icon hover-icon-red"
            @click="onlikeArticle()"
          >
            <q-icon
              :class="isLike ? 'active-icon' : ''"
              name="favorite_border"
            ></q-icon> {{ $t('collect') }} {{ articleData.likeNum }}
          </div>
          <div
            class="info-detail-item hover-icon"
            @click="ongoodArticle()"
          >
            <q-icon
              :class="isGood ? 'active-icon' : ''"
              name="thumb_up_off_alt"
            ></q-icon> {{ $t('like') }} {{ articleData.goodNum }}
          </div>
        </div>
        <div class="detail-info-detail-flex">
          <div class="info-detail-item">
            <q-icon name="open_in_new"></q-icon> {{ $t('commentCount') }} {{ articleData.commitNum }}
          </div>
          <div class="info-detail-item">
            <q-icon name="account_box"></q-icon> {{ $t('readUserCount') }} {{ articleData.readUserNum }}
          </div>
        </div>
      </div>
      <div class="detail-info-tags">
        <span>{{ $t('articleTags') }}：</span>
        <span v-if="articleData.tags">
          <q-badge
            class="detail-tag"
            v-for="item in articleData.tags.split(',')"
            :key="item"
            color="primary"
          >{{ item }}</q-badge>
        </span>
      </div>
    </div>
    <div class="article-context"></div>
    <div
      id="vEditor"
      v-show="false"
    ></div>
  </div>
  <commitContent
    @getCommitNum="getCommitNum"
    :aID="aID"
  ></commitContent>

</template>

<script setup>
import { addRead, getArticleByID, getCommit, getIsLikeAndFavorite, goodArticle, insertCommit, likeArticle, upOrDownCommit } from "src/http/article";
import { formatTime, notify } from "src/utils";
import { computed, nextTick, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Vditor from 'vditor'
import "vditor/src/assets/less/index.less"
import { useUserStore } from "src/stores/user";
import formEdit from "src/components/form/index.vue"
import miButton from "src/components/form/mi-button.vue"
import commitContent from "./components/commit/commitContent.vue"

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

defineOptions({
  name: 'articleDetail'
});


const aID = ref(route.params.aID)

const articleData = ref({})

const editorHtml = ref("")

const contentVisible = ref(false)

//获取文章数据
const getArticleData = async () => {
  let res = await getArticleByID({ ID: aID.value })
  articleData.value = res.data
  const { title, tags, author } = articleData.value
  updateKeywords(`${title},${tags},${author}`, `${title},${tags},${author}`)
  let edt = new Vditor('vEditor', {
    height: "calc(100vh - 295px)",
    mode: "sv",
    cache: {
      enable: false
    },
    preview: {
      mode: 'both' // 预览模式，可选值：both/edit
    },
    after: () => {
      edt.setValue(articleData.value.context)
      nextTick(() => {
        let articleContext = document.getElementsByClassName("article-context")[0]
        edt.vditor.preview.previewElement.style.display = "block"
        articleContext.innerHTML = ""
        articleContext.appendChild(edt.vditor.preview.previewElement)
        contentVisible.value = true
      })
    },

    toolbar: []
  })
}

onBeforeUnmount(() => {
  localStorage.removeItem("vditorvEditor")
})

const isLike = ref(false)

const isGood = ref(false)

//获取是否点赞或收藏
const getLikeAndFavorite = async () => {
  let res = await getIsLikeAndFavorite({ aID: aID.value, uID: userStore.user.user_ID })
  isLike.value = res.data.isLike
  isGood.value = res.data.isGood
}

//收藏
const onlikeArticle = async () => {
  let res = await likeArticle({ aID: aID.value, uID: userStore.user.user_ID })
  if (res.code === 0) {
    let data = res.data
    articleData.value.goodNum = data.goodNum
    articleData.value.likeNum = data.likeNum
    isGood.value = data.isGood
    isLike.value = data.isLike
  }
}

//点赞文章
const ongoodArticle = async () => {
  let res = await goodArticle({ aID: aID.value, uID: userStore.user.user_ID })
  if (res.code === 0) {
    let data = res.data
    articleData.value.goodNum = data.goodNum
    articleData.value.likeNum = data.likeNum
    isGood.value = data.isGood
    isLike.value = data.isLike
  }
}

const getCommitNum = (num) => {
  articleData.value.commitNum = num
}


const onaddRead = async () => {
  await addRead({ aID: aID.value, uID: userStore.user.user_ID })
}
getArticleData()
// onBeforeMount(async () => {
//   await getArticleData()
// })

const updateKeywords = (keywords, desc) => {
  let keywordsMetaTag = document.querySelector('meta[name="keywords"]');
  if (!keywordsMetaTag) {
    keywordsMetaTag = document.createElement("meta");
    keywordsMetaTag.name = "keywords";
    document.head.appendChild(keywordsMetaTag);
  }
  keywordsMetaTag.content = keywords;

  let descriptionMetaTag = document.querySelector(
    'meta[name="description"]'
  );
  if (!descriptionMetaTag) {
    descriptionMetaTag = document.createElement("meta");
    descriptionMetaTag.name = "description";
    document.head.appendChild(descriptionMetaTag);
  }
  descriptionMetaTag.content = desc;
}

onMounted(async () => {
  if (aID.value) {
    localStorage.removeItem("vditorvEditor")
    await onaddRead()
    getLikeAndFavorite()

  }
})

const toBack = () => {
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.article-detail-page {
  padding: 10px 25px;
  margin-top: 10px;
  .title-back {
    display: inline-block;
    cursor: pointer;
    font-size: 18px;
    margin-right: 10px;
    border-radius: 6px;
    padding: 6px;
    &:hover {
      background-color: var(--blue);
      color: #fff;
    }
  }
  .article-detail-title {
    font-size: 30px;
    text-align: center;
    font-weight: 600;
  }
  .article-context {
    margin-top: 10px;
    min-height: calc(100vh - 310px);
  }
  .article-detail-info {
    background-color: #f8f8f8;
    border-radius: 4px;
    padding: 8px 16px;
    margin-top: 15px;
    .detail-info-detail {
      display: flex;
      flex-wrap: wrap;
      .info-detail-author {
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .detail-info-detail-flex {
        display: flex;
        margin-right: 20px;
        .info-detail-item:first-child {
          margin-left: 0px;
        }
      }
    }
    .info-detail-time {
    }
    .info-detail-item {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .q-icon {
        margin-right: 5px;
        font-size: 20px;
      }
    }
    .hover-icon {
      cursor: pointer;
      &:hover {
        color: var(--blue);
      }
      .active-icon {
        color: var(--blue);
      }
    }
    .hover-icon-red {
      &:hover {
        color: #ff0080;
      }
      .active-icon {
        color: #ff0080;
      }
    }

    .detail-info-tags {
      margin-top: 10px;
      display: flex;
      .detail-tag {
        margin-left: 10px;
        padding: 5px 10px;
      }
    }
  }
}
</style>
