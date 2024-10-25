<template>
  <div class="commit-roots">
    <div class="root-left">
      <q-avatar><img
          :src="item.realAvatar||item.userAvatar"
          alt=""
        ></q-avatar>
    </div>
    <div class="root-right">
      <div class="user-info">
        <span>@{{item.realNickName||item.userNick}}</span>
        <span v-if="!item.isRoot">&nbsp;{{$t("review")}}&nbsp;@{{item.toUserNick}}</span>
        <span class="user-info-time">{{formatTime(item.createTime)}}</span>
      </div>
      <div class="user-commit-text">
        {{item.commitContent}}
      </div>
      <div class="user-commit-menu">
        <span
          @click="likeCommit(item)"
          class="commit-menu-item"
          :class="user.user_ID&&item.up_IDs.includes(user.user_ID.toString())?'active-icon-up':''"
        >
          <q-icon name="thumb_up_off_alt"></q-icon>({{item.up_IDs.length}})
        </span>
        <span
          class="commit-menu-item"
          @click="unlikeCommit(item)"
          :class="user.user_ID&&item.down_IDs.includes(user.user_ID.toString())?'active-icon-down':''"
        >
          <q-icon name="thumb_up_off_alt"></q-icon>({{item.down_IDs.length}})
        </span>
        <span class="commit-menu-item commit-menu-write">{{$t("review")}}
          <q-popup-proxy style="width:800px;height:260px;padding:10px 20px">
            <commitTextbox
              v-model="item.reviewCommitText"
              target=""
            ></commitTextbox>
            <miButton
              :label="$t('review')"
              @click="onReview(item)"
            ></miButton>
          </q-popup-proxy>
        </span>
        <span
          class="commit-menu-item commit-menu-write"
          v-if="item.user_ID==user.user_ID"
        >{{$t("delete")}}
          <q-popup-proxy v-model="item.showDelPop">
            <q-card style="padding:15px">
              <div class="text-h7">{{$t("deleteCommitTip")}}</div>
              <div style="display:flex;margin-top: 15px;">
                <miButton
                  @click="deleteCommit(item)"
                  :label="$t('confirm')"
                  flat
                ></miButton>
                <miButton
                  @click="item.showDelPop=false"
                  :label="$t('cancel')"
                  flat
                  color="red"
                ></miButton>
              </div>
            </q-card>
          </q-popup-proxy>

        </span>
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
import { getCommit, insertCommit, upOrDownCommit } from "src/http/article";
import { formatTime, notify } from "src/utils";

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
})

const emit = defineEmits(["onReview", "likeCommit", "unlikeCommit", "deleteCommit"])

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

//回复评论
const onReview = async (item) => {
  emit("onReview", item)
}

//点赞评论
const likeCommit = async (item) => {
  emit("likeCommit", item)
}

//点踩评论
const unlikeCommit = async (item) => {
  emit("likeCommit", item)
}

const deleteCommit = async (item) => {
  emit("deleteCommit", item)
}

onMounted(() => {

})

</script>

<style lang="scss" scoped>
.commit-roots {
  display: flex;
  margin-top: 15px;
  .root-left {
    width: 70px;
    img {
      width: 55px;
    }
  }
  .root-right {
    width: 100%;
    .user-commit-text {
      margin-top: 10px;
    }
    .user-info-time {
      margin-left: 10px;
    }
    .user-commit-menu {
      margin-top: 10px;
      .commit-menu-item {
        margin-right: 15px;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          color: rgba(66, 133, 244);
        }
      }
      .commit-menu-write {
        color: #4285f4;
      }
    }
    .active-icon-up {
      color: #ff0080;
    }
    .active-icon-down {
      color: var(--blue);
    }
  }
}
</style>