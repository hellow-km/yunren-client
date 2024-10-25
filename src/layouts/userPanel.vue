<template>
  <div class="user-panel">
    <!-- <div class="user-info">

      <img
        class="vip_icon"
        v-if="user.isVip"
        src="../assets/images/header/VIP.svg"
        alt=""
      >
      <img
        class="vip_icon"
        v-else
        src="../assets/images/header/VIP_no.svg"
        alt=""
      >
      {{user.userName}}
    </div> -->
    <q-list
      bordered
      separator
    >
      <q-item
        @click="toPersonal"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="perm_identity" />
        </q-item-section>
        <q-item-section>{{$t("personalCenter")}}</q-item-section>
      </q-item>

      <q-item
        @click="logout"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>
        <q-item-section>{{$t("logout")}}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useUserStore } from "src/stores/user"
import { computed } from "vue"
import { useRouter } from "vue-router"


const userStore = useUserStore()

const user = computed({
  get() {
    return userStore.user
  },
  set(val) {
    userStore.user = val
  }
})

const emit = defineEmits(['logout', "toPersonal"])

const logout = () => {
  emit("logout")
}

const toPersonal = () => {
  emit("toPersonal")
}


</script>

<style lang="scss" scoped>
.user-panel {
  width: 200px;
  .user-info {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  .vip_icon {
    width: 35px;
    height: 35px;
    margin: 0 10px;
  }
}
</style>
