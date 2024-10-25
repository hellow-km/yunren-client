<template>
  <div>
    <div v-if="articlesList.length">
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
        @click="toUpload(item)"
        :key="index"
        hasDotMenu
        @deleteArticle="ondeleteArticle(item)"
      ></articlesItem>
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
        />
      </div>
    </div>
    <div
      class="myArticle-nodata"
      v-else
    >
      <div class="nodata-box">
        <nodata></nodata>
        <div class="nodata-upload">
          <miButton
            @click="uploadArticle"
            :label="$t('uploadOne')"
          ></miButton>
        </div>
      </div>
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
    </div>
  </div>
</template>

<script setup>
import { tokenUser, updateUser } from "src/http/user";
import { useUserStore } from "src/stores/user";
import { notify } from "src/utils";
import { computed, nextTick, onMounted, ref } from "vue";
import labelValueEdit from "../labelValueEdit.vue"
import miButton from "src/components/form/mi-button.vue"
import articlesItem from "../articles-list-item.vue"
import { getArticles, getUserArticles, realDeleteArticle } from "src/http/article";
import { useRoute, useRouter } from "vue-router";
import nodata from "src/components/no-data.vue"

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const articlesList = ref([])

//获取文章数据
const getArticle = async (tag) => {
  articlesList.value = []
  let res = await getUserArticles({ page: pagination.value.page, size: pagination.value.pageSize, uID: user.value.user_ID })
  let data = res.data
  articlesList.value = data.data
  pagination.value.total = data.count
  nextTick(() => {
    animeArticleItems()
  })
}

const changePage = (value) => {
  router.push({
    name: "personalCenter",
    query: {
      tab: "2",
      page: value
    }
  })
  pagination.value.page = value
  getArticle()
}

const uploadArticle = () => {
  router.push({
    name: "uploadArticle",
    params: {
      uID: userStore.user.user_ID
    }
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

const toUpload = (item) => {
  router.push({
    name: "uploadArticle",
    params: {
      uID: user.value.user_ID
    },
    query: {
      aID: item.article_ID
    }
  })
}

//TODO 删除
const ondeleteArticle = async (item) => {
  let res = await realDeleteArticle({ aID: item.article_ID, uID: user.value.user_ID })
  if (res.code === 0) {
    notify($t("commitNo.del"))
    getArticle()
  }
}

onMounted(() => {
  if (route.query.page) {
    pagination.value.page = Number(route.query.page)
  }
  getArticle()
})

</script>

<style lang="scss" scoped>
.article-item-anime {
  transition: all 0.5s;
  position: absolute;
  top: 0;
  transform: translateY(-100%);
}
.article-pagination {
  margin: 15px 0;
}
.myArticle-nodata {
  display: flex;
  align-items: center;
  justify-content: center;

  .nodata-upload {
    margin-top: 15px;
    text-align: center;
  }
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
</style>