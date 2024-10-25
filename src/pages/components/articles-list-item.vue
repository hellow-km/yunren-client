<template>
  <div class="acticle-list-item">
    <div
      class="acticle-item-img"
      v-if="props.imgSrc"
    >
      <img
        :src="props.imgSrc"
        alt=""
      >
    </div>
    <div class="acticle-item-info">
      <div class="info-head">
        <div class="info-title">{{title}}</div>
        <div class="info-time">{{time}}</div>
      </div>
      <div class="info-content">
        {{ac_desc}}
      </div>
      <div class="info-desc">
        <div class="desc-item"><q-icon name="visibility"></q-icon>{{readNum}}</div>
        <div class="desc-item"><q-icon name="open_in_new"></q-icon>{{commitNum}}</div>
        <div class="desc-item"><q-icon name="thumb_up_off_alt"></q-icon>{{goodNum}}</div>
        <div class="desc-item"><q-icon name="favorite_border"></q-icon>{{likeNum}}</div>
        <div class="desc-item desc-item-flex">
          <div class="desc-item">{{$t("author")}} <span class="author-text">{{author}}</span></div>
          <div
            class="desc-item"
            v-if="tags"
          >
            <q-badge
              class="desc-tag"
              v-for="item in tags.split(',')"
              :key="item"
              color="primary"
            >{{item}}</q-badge>
          </div>
          <div
            @click.stop=""
            class="dot-menu"
            v-if="hasDotMenu"
          >
            ...
            <q-popup-proxy v-model="menuVisible">
              <q-card style="padding:15px">
                <div
                  class="text-h7"
                  style="cursor:pointer"
                  @click="deleteArticle"
                >删除</div>
              </q-card>
            </q-popup-proxy>
          </div>
        </div>
      </div>
      <div class="info-desc desc-time">
        {{createTime?formatTime(createTime):""}}
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar"
import { formatTime } from "src/utils"
import { ref } from "vue"

const menuVisible = ref(false)
const $q = useQuasar()
const props = defineProps({
  imgSrc: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  ac_desc: {
    type: String,
    default: ""
  },
  createTime: {
    type: String,
    default: ""
  },
  readNum: {
    type: Number,
    default: 0
  },
  goodNum: {
    type: Number,
    default: 0
  },
  commitNum: {
    type: Number,
    default: 0
  },
  likeNum: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    default: ""
  },
  tags: {
    type: String,
    default: ""
  },
  hasDotMenu: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["deleteArticle"])

const deleteArticle = () => {
  menuVisible.value = false
  $q.dialog({
    title: $t('dialogTitle'),
    message: $t('dialogMessage'),
    cancel: true,
    ok: $t('dialogCancel'),
    cancel: $t('dialogOk'),
    persistent: true,
  }).onOk(() => {
    // console.log('>>>> OK')
  }).onCancel(() => {
    emit("deleteArticle")
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  });

}

</script>

<style lang="scss" scoped>
.acticle-list-item {
  display: flex;
  padding: 15px 5px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e2;
  &:hover {
    background: #fafafa;
  }
  align-items: center;
  .acticle-item-img {
    width: 160px;
    img {
      width: 160px;
      height: 90px;
      object-fit: scale-down;
    }
  }
  .acticle-item-info {
    width: 100%;
    margin-left: 15px;
    .info-head {
      display: flex;
      .info-title {
        font-size: 24px;
        font-weight: bold;
      }
      .info-time {
        margin-left: auto;
        margin-right: 10px;
        color: #555666;
      }
    }
    .info-content {
      margin: 5px 0;
      font-size: 14px;
      font-weight: 400;
      color: #555666;
      overflow: hidden;
      white-space: normal;
      word-break: break-word;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .info-desc {
      font-size: 14px;
      opacity: 0.88;
      display: flex;
      position: relative;
      flex-wrap: wrap;
      .desc-item {
        margin-right: 15px;
        .q-icon {
          margin-right: 5px;
        }
        .desc-tag {
          margin-right: 10px;
          padding: 5px 10px;
        }
      }
      .desc-item-flex {
        display: flex;
        flex-wrap: wrap;
      }
      .dot-menu {
        position: absolute;
        right: 50px;
        font-size: 20px;
      }
      .author-text {
      }
    }
    .desc-time {
      font-size: 13px;
      margin-top: 5px;
    }
  }
}
</style>
