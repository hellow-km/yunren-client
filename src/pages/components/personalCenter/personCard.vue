<template>
  <div>
    <q-card class="person-info">
      <q-item>{{$t('personCard')}}</q-item>
      <div class="card-contain">
        <div class="person-info-avatar">
          <div
            class="avatar-box"
            @click="uploadSelectAvatar"
          >
            <q-avatar size="60px">
              <img
                :src="user.avartar"
                alt=""
              >
            </q-avatar>
            <img
              width="30"
              class="camare-img"
              src="../../../assets/images/personalCenter/camare.png"
              alt=""
            >
            <div class="avatar-overlay"></div>
          </div>
          <span class="info-userName">{{user.userName}}</span>
          <div class="person-info-qd">
            <!-- <miButton @click="openQiandao" color="primary" label="签到"></miButton> -->
          </div>
        </div>
        <div class="my-pack">
          <div>{{$t('myPoints')}}： {{user.jf_score || 0}}</div>
          <miButton
            class="detail-btn"
            @click="openScoreHistory"
            :label="$t('pointsDetails')"
          ></miButton>
        </div>
      </div>
    </q-card>

    <q-card class="basic-info">
      <q-item>{{$t('basicInfo')}}</q-item>
      <div class="card-contain">
        <div>
          <labelValueEdit
            @submit="onUpdateInfo"
            :title="$t('nickname')"
            canEdit
            v-model="user.nickName"
          ></labelValueEdit>
          <labelValueEdit
            @submit="onUpdateInfo"
            :title="$t('email')"
            v-model="user.email"
          ></labelValueEdit>
          <labelValueEdit
            canEdit
            @submit="onUpdateInfo"
            :title="$t('gender')"
            :editOption="[
          { key: 'value', type: 'select', data: [{value: $t('secret'), label: $t('secret')}, {value: $t('male'), label: $t('male')}, {value: $t('female'), label: $t('female')}] }
        ]"
            v-model="user.sex"
          ></labelValueEdit>
          <labelValueEdit
            canEdit
            @submit="onUpdateInfo"
            :title="$t('birthday')"
            :editOption="[{ key: 'value', type: 'date' }]"
            v-model="user.birthday"
          ></labelValueEdit>
          <labelValueEdit
            @submit="onUpdateInfo"
            :title="$t('age')"
            :editOption="[{ key: 'value', type: 'number' }]"
            canEdit
            v-model="user.age"
          ></labelValueEdit>
          <labelValueEdit
            @submit="onUpdateInfo"
            :title="$t('address')"
            canEdit
            v-model="user.address"
          ></labelValueEdit>
          <labelValueEdit
            canEdit
            @submit="onUpdateInfo"
            :title="$t('introduction')"
            :editOption="[{ key: 'value', type: 'textarea' }]"
            v-model="user.introduce"
          ></labelValueEdit>
        </div>
      </div>
      <div class="person-info-footer">
        <miButton
          :disable="!isEdited"
          :label="$t('saveSettings')"
          @click="onUpdateUser"
        ></miButton>
      </div>
    </q-card>
    <miDialog
      v-model="qiandaoVisible"
      width="600px"
      height="400px"
    >
      <qiandaoDia></qiandaoDia>
    </miDialog>

    <miDialog
      v-model="showScoreHistory"
      width="600px"
      height="400px"
    >
      <scoreHistory></scoreHistory>
    </miDialog>

  </div>
</template>

<script setup>
import { tokenUser, updateUser } from "src/http/user";
import { useUserStore } from "src/stores/user";
import { notify, openFileDialog } from "src/utils";
import { computed, onMounted, ref } from "vue";
import labelValueEdit from "../labelValueEdit.vue"
import miButton from "src/components/form/mi-button.vue"
import miDialog from "src/components/mi-dialog.vue"
import { uploadImage } from "src/http/common";
import qiandaoDia from "src/components/qiandao.vue"
import scoreHistory from "./components/scoreHistory.vue"
const userStore = useUserStore()

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const isEdited = ref(false)

const onUpdateInfo = () => {
  isEdited.value = true
}

const onUpdateUser = async () => {
  let res = await updateUser(userStore.user)
  if (res.code === 0) {
    userStore.setUser(userStore.user)
    notify($t("notify.saveSuccess"))
    tokenUser({ token })
  }
}

//上传头像
const uploadSelectAvatar = () => {
  openFileDialog(false).then(async files => {
    let res = await uploadImage(files)
    user.value.avartar = res.data[0]
    onUpdateUser()
  })
}

const qiandaoVisible = ref(false)

const showScoreHistory = ref(false)

const openQiandao = () => {
  qiandaoVisible.value = true
}

const openScoreHistory = () => {
  showScoreHistory.value = true
}

</script>

<style lang="scss" scoped>
.person-info {
  height: 200px;
}
.basic-info {
  position: relative;
  margin-top: 30px;
  height: 600px;
}
.card-contain {
  padding: 16px;
}
.person-info-avatar {
  display: flex;
  align-items: center;
  font-size: 24px;

  .avatar-box {
    position: relative;
    cursor: pointer;
    &:hover {
      .camare-img {
        display: block;
      }
      .avatar-overlay {
        display: block;
      }
    }
    .avatar-overlay {
      position: absolute;
      display: none;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background-color: rgba(33, 33, 33, 0.2);
      border-radius: 50%;
    }
    .camare-img {
      display: none;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .person-info-qd {
    margin-left: auto;
    margin-right: 10px;
  }
  .info-userName {
    margin-left: 15px;
  }
}
.my-pack {
  display: flex;
  margin-top: 25px;
  font-weight: 600;
  margin-left: 5px;
  align-items: center;
  .detail-btn {
    margin-left: 25px;
  }
}
.person-info-footer {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>