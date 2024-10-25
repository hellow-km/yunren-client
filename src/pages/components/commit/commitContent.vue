<template>

  <div class="article-commit">
    <div
      class="commit-loadingbox"
      v-show="commitLoading"
    >
      <q-spinner-bars
        class="commit-loading"
        color="primary"
        size="30px"
      />
    </div>
    <div
      class="text-h4"
      style="margin-left:15px"
    >{{$t("commit")}}</div>
    <div>
      <commitTextbox v-model="commitText"></commitTextbox>
      <miButton
        :label="$t('sendCommit')"
        @click="oncommit"
      ></miButton>
    </div>
    <div class="commit-context">
      <div class="commit-list">
        <div
          v-for="item in commitList"
          :key="item.commit_ID"
        >
          <commitContentItem
            :item="item"
            @onReview="onReview"
            @likeCommit="likeCommit"
            @unlikeCommit="unlikeCommit"
            @deleteCommit="ondeleteCommit"
          ></commitContentItem>
          <div
            class="commit-reviews"
            v-for="_item in item.children"
            :key="_item.commit_ID"
          >
            <commitContentItem
              :item="_item"
              @onReview="onReview"
              @likeCommit="likeCommit"
              @unlikeCommit="unlikeCommit"
              @deleteCommit="ondeleteCommit"
            ></commitContentItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import formEdit from "src/components/form/index.vue"
import miButton from "src/components/form/mi-button.vue"
import commitTextbox from "./commitTextbox.vue"
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { deleteCommit, getCommit, insertCommit, upOrDownCommit } from "src/http/article";
import { formatTime, notify } from "src/utils";
import commitContentItem from "./commitContentItem.vue"
const props = defineProps({
  aID: {
    type: String,
    default: ""
  },
})

const emit = defineEmits(["getCommitNum"])

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

const commitText = ref("")

const commitList = ref([])

//评论
const oncommit = async () => {
  if (!commitText.value) {
    return notify($t("commitNo.empty"), "warning")
  }
  let res = await insertCommit({
    user_ID: user.value.user_ID,
    rootCommit_ID: null,
    article_ID: props.aID,
    userNick: user.value.nickName,
    userAvatar: user.value.avartar,
    isRoot: true,
    commitContent: commitText.value
  })
  if (res.code === 0) {
    notify($t("commitNo.success"))
    getCommitList()

  }
}

const commitLoading = ref(false)

//获取评论
const getCommitList = async () => {
  commitLoading.value = true
  let res = await getCommit({ aID: props.aID })
  let commitLists = [], commitItems = []
  res.data.forEach(item => {
    item.up_IDs = item.upUser_IDs ? item.upUser_IDs.split(",") : []
    item.down_IDs = item.downUser_IDs ? item.downUser_IDs.split(",") : []
    item.children = []
    if (item.isRoot) {
      commitLists.push(item)
    } else {
      if (item.rootCommit_ID) {
        const rootCommit = commitLists.find(commit => commit.commit_ID === item.rootCommit_ID);
        if (rootCommit) {
          rootCommit.children = rootCommit.children || [];
          rootCommit.children.push(item);
        }
      }
    }
  })
  //把commitItems的rootCommit_ID对应commitList中的commit_ID
  commitList.value = commitLists
  emit("getCommitNum", commitList.value.length)
  commitLoading.value = false
}

//回复评论
const onReview = async (item) => {
  const reviewCommitText = item.reviewCommitText
  if (!reviewCommitText) {
    return notify($t("commitNo.empty"), "warning")
  }
  let res = await insertCommit({
    user_ID: user.value.user_ID,
    article_ID: props.aID,
    userNick: user.value.nickName,
    userAvatar: user.value.avartar,
    isRoot: false,
    rootCommit_ID: item.isRoot ? item.commit_ID : item.rootCommit_ID,
    commitContent: reviewCommitText,
    toUserNick: item.userNick,
    toUserID: item.user_ID,
    toUserAvatar: item.userAvatar,
    toCommit_ID: item.commit_ID
  })
  if (res.code === 0) {
    notify($t("commitNo.success"))
    getCommitList()
  }
}

//点赞评论
const likeCommit = async (item) => {
  let res = await upOrDownCommit({
    cID: item.commit_ID,
    uID: user.value.user_ID,
    isLike: true
  })
  if (res.code === 0) {
    // notify(res.errMsg)
    item.up_IDs = res.data.ups
  }
}

const ondeleteCommit = async (item) => {
  let res = await deleteCommit({ cID: item.commit_ID })
  if (res.code == 0) {
    notify($t("commitNo.del"))
    getCommitList()

  }
}

//点踩评论
const unlikeCommit = async (item) => {
  let res = await upOrDownCommit({
    cID: item.commit_ID,
    uID: user.value.user_ID,
    isLike: false
  })
  if (res.code === 0) {
    // notify(res.errMsg)
    item.down_IDs = res.data.downs
  }
}

onMounted(() => {
  getCommitList()
})

</script>

<style lang="scss" scoped>
.article-commit {
  position: relative;
  padding: 5px;
  border-radius: 4px;
  .commit-loadingbox {
    position: absolute;
    border-radius: 4px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(222, 222, 222, 0.25);
    .commit-loading {
      position: absolute;
      top: 220px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .commit-context {
    margin-bottom: 50px;
    .commit-list {
      .commit-reviews {
        padding-left: 65px;
      }
    }
  }
}
</style>