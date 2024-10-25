<template>
  <div class="article-page">
    <div class="articles-head">
      <selectBar
        v-if="titleList.length"
        :list="titleList"
        v-model="bar"
        @change="changeBarSelect"
      ></selectBar>
    </div>
    <searchIpt
      class="search-input"
      v-model="articleSearch"
      @onSearch="onArticleSearch"
      placeholder="searchArticle"
    />
    <div v-if="articlesList.length">

      <div class="articles-ac_desc">
        <div class="articles-list">
          <articlesItem
            class="article-item-anime"
            :title="item.title"
            :likeNum="item.likeNum||0"
            :imgSrc="item.imgSrc"
            :readNum="item.readNum||0"
            :goodNum="item.goodNum||0"
            :ac_desc="item.ac_desc"
            :author="item.realNickName||item.author"
            :commitNum="item.commitNum||0"
            :tags="item.tags"
            :createTime="item.createTime"
            v-for="(item,index) in articlesList"
            @click="readArticle(item)"
            :key="index"
          ><a :href="'/articleDetail?aID='+item.article_ID"></a></articlesItem>
        </div>
        <div
          class="addArticles-btn"
          @click="toArticleUpload()"
        >
          <miButton
            round
            color="primary"
            icon="add"
          ></miButton>
          <q-tooltip>
            <span style="font-size:16px">{{$t("uploadYourArticle")}}</span>
          </q-tooltip>
          <a :href="'/uploadArticle/'+user&&user.user_ID?user.user_ID:'4'"></a>
        </div>
      </div>
      <div class="article-pagination">
        <q-pagination
          v-model="pagination.page"
          :max="Math.ceil(pagination.total/pagination.pageSize)"
          direction-links
          :max-pages="8"
          flat
          color="grey"
          active-color="primary"
          @update:model-value="changePage"
          boundary-links
        />
        <a
          v-for="item in Math.ceil(pagination.total/pagination.pageSize)"
          :key="item"
          :href="'/articles?page='+item"
        ></a>
      </div>
    </div>
    <div v-else>
      <nodata></nodata>
      <div class="nodata-upload">
        <miButton
          @click="toArticleUpload()"
          :label="$t('uploadOne')"
        ></miButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import selectBar from "src/components/select-bar.vue"
import articlesItem from "./components/articles-list-item.vue"
import miButton from "src/components/form/mi-button.vue"
import { computed, nextTick, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useCommonStore } from "src/stores/common";
import { getArticles, getTags } from "src/http/article";
import nodata from "src/components/no-data.vue"
import miInput from "src/components/form/mi-input.vue"
import searchIpt from "src/components/searchIpt.vue"

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const common = useCommonStore()
defineOptions({
  name: 'articles'
});

const titleList = ref([])

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const articleSearch = ref("")

const onArticleSearch = () => {
  pagination.value.page = 1
  getArticle()

}

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const changePage = (value) => {
  router.push({
    name: "articles",
    query: {
      tag: route.query.tag,
      page: pagination.value.page
    }
  })
  pagination.value.page = value
  getArticle()
}

const articlesList = ref([])

const bar = ref("1")

const changeBarSelect = (item, isInit) => {
  bar.value = item.path
  router.push({
    name: "articles",
    query: {
      tag: item.path,
      page: isInit ? (route.query.page || 1) : 1,
    }
  })
  pagination.value.page = isInit ? (route.query.page ? Number(route.query.page) : 1) : 1
  getArticle(item.path)
}

//前往文章详情
const readArticle = (item) => {
  router.push({
    name: "articleDetail",
    params: {
      aID: item.article_ID
    }
  })
}

//前往发布页
const toArticleUpload = () => {
  if (userStore.isLogin) {
    router.push({
      name: "uploadArticle",
      params: {
        uID: user.value.user_ID
      }
    })
  } else {
    common.loginVisible = true
  }
}

//获取标签
const setTags = async () => {
  let res = await getTags()
  res.data.splice(0, 0, { value: "推荐", label: "推荐" })
  titleList.value = res.data.map(item => {
    return {
      title: item.label,
      path: item.label
    }
  })

  if (route.query.tag) {
    changeBarSelect({ path: route.query.tag }, true)
  } else {
    bar.value = titleList.value[0].path
  }
}

//获取文章数据
const getArticle = async (tag) => {
  articlesList.value = []
  tag = tag || route.query.tag || ""
  let res = await getArticles({ tag: tag, page: pagination.value.page, size: pagination.value.pageSize, searchValue: articleSearch.value })
  let data = res.data
  articlesList.value = data.data
  pagination.value.total = data.count
  nextTick(() => {
    animeArticleItems()
  })
}

const animeArticleItems = () => {
  let animeItems = document.getElementsByClassName("article-item-anime")
  let curTop = 50
  for (let i = 0; i < animeItems.length; i++) {
    const el = animeItems[i];
    setTimeout(() => {
      el.style.top = curTop + "px"
      el.style.transform = "translateY(0)"
      curTop += el.offsetHeight
      nextTick(() => {
        el.style.top = "0px"
        el.style.position = "relative"
      });
    }, 100 * (i + 1));
  }
}

const setQueryData = () => {
  if (route.query.page) {
    pagination.value.page = Number(route.query.page)
  }
}

onMounted(async () => {
  setQueryData()
  setTags()
  getArticle()

})
</script>

<style lang="scss" scoped>
.article-page {
  padding: 10px;
  .search-input {
    width: 80%;
    margin: 5px 0;
  }
  .articles-head {
    padding-top: 15px;
    border-bottom: 1px solid #e0e0e2;
    width: 100%;
    display: flex;
    justify-content: left;
    background-color: #fff;
    padding-bottom: 5px;
  }
  .articles-ac_desc {
  }
  .addArticles-btn {
    position: fixed;
    top: 130px;
    right: 100px;
    transition: all 0.3s;
    &:hover {
      transform: scale(1.1);
    }
  }
  .article-pagination {
    margin: 15px 0;
  }
  .article-item-anime {
    transition: all 0.2s;
    position: absolute;
    top: 0;
    transform: translateY(-100%);
  }
  .nodata-upload {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
