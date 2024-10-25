<template>
  <q-form
    ref="formRef"
    @submit="onSubmit"
    class="q-gutter-md"
  >
    <q-list>
      <q-item
        v-for="item in formOption"
        :key="item.key"
      >
        <template v-if="!item.hide||(item.hide&&typeof item.hide=='function'&&!item.hide(form))">
          <q-item-section v-if="item.slot">
            <slot :name="item.slot"></slot>
          </q-item-section>
          <q-item-section v-else>
            <q-item-label class="q-pb-xs">{{ $t(item.label) }}</q-item-label>
            <miInput
              v-if="!item.type || item.type == 'input'"
              v-model="form[item.key]"
              :onChange="item.events && item.events.change && item.events.change(item.key,form[item.key],form)"
              :attrs="item.attrs"
              :rules="item.rules"
            ></miInput>
            <miCheckbox
              v-else-if="item.type == 'checkbox'"
              v-model="form[item.key]"
              :attrs="item.attrs"
              :events="item.events"
            />
            <miSelect
              v-else-if="item.type == 'select'"
              :value="item.selectValue||'value'"
              :label="item.selectLabel||'label'"
              :options="typeof item.data=='function'?item.data(form):item.data||[]"
              v-model="form[item.key]"
              @onchange="(key,value,option)=>item.events && item.events.change(key,value,form,option)"
            />

            <miSelect2
              v-else-if="item.type == 'select2'"
              :value="item.selectValue||'value'"
              :label="item.selectLabel||'label'"
              :options="typeof item.data=='function'?item.data(form):item.data||[]"
              v-model="form[item.key]"
              @onchange="(key,value,option)=>item.events && item.events.change(key,value,form,option)"
            />

            <div v-else-if="item.type == 'radio'">
              <miRadio
                :data="item.data || []"
                v-model="form[item.key]"
                :attrs="itemR.attrs || {}"
                :events="itemR.events || {}"
              />
            </div>
            <div
              class="pwd-iptbox"
              v-else-if="item.type == 'password'"
            >
              <miInput
                v-model="form[item.key]"
                :onChange="()=>{
                  item.events && item.events.change && item.events.change(item.key,form[item.key],form)
                  item.showStrength&&changePassword(form[item.key]);
                }"
                :type="item.isPwd?'password':'text'"
                :attrs="item.attrs"
                :rules="item.rules"
              >
                <template v-slot:append>
                  <q-icon
                    :name="item.isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="item.isPwd = !item.isPwd"
                  />
                </template>
              </miInput>
              <div v-if="item.showStrength&&isShowPwdBars">
                <div>
                  <div
                    :style="{backgroundColor:pwdBar.color}"
                    class="pwd-bar"
                    v-for="(pwdBar,idx) in pwdArrays"
                    :class="{'pwd-bar-no':pwdStength.index<idx}"
                    :key="pwdBar"
                  >
                  </div>
                </div>
                <div>
                  <span :style="{color:pwdStength.color}">{{pwdStength.label}}</span>
                </div>
              </div>
            </div>
            <miInput
              v-else-if="item.type == 'code'"
              v-model="form[item.key]"
              :onChange="item.events && item.events.change && item.events.change(item.key,form[item.key],form)"
              :attrs="item.attrs"
              :rules="item.rules"
            >
              <template v-slot:append>
                <miButton
                  :loading="coderLoading"
                  :disable="codeTime>0"
                  @click="sendCode(item,form);"
                  :label="codeTime>0?codeTime+'s':$t('sendCode')"
                ></miButton>
              </template>
            </miInput>
            <q-input
              v-else-if="item.type == 'date'"
              filled
              v-model="form[item.key]"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form[item.key]">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <miInput
              v-else-if="item.type == 'number'"
              type="number"
              v-model="form[item.key]"
              :onChange="item.events && item.events.change && item.events.change(item.key,form[item.key],form)"
              :attrs="item.attrs"
              :rules="item.rules"
            ></miInput>
            <div v-else-if="item.type == 'datetime'">

            </div>
            <div v-else-if="item.type == 'textarea'">
              <miInput
                v-model="form[item.key]"
                :maxlength="item.attrs&&item.attrs.maxlength||2000"
                v-bind="item.attrs"
                :events="item.events"
                type="textarea"
                :borderless="false"
                outlined
                :rules="item.rules"
              /><span>{{form[item.key]?form[item.key].length:0}}/{{item.attrs&&item.attrs.maxlength||2000}}</span>
            </div>
          </q-item-section>
        </template>
      </q-item>
    </q-list>
    <slot></slot>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import miSelect from './mi-select.vue';
import miSelect2 from "./mi-select2.vue"
import miCheckbox from './mi-checkbox.vue';
import miInput from './mi-input.vue';
import miRadio from "./mi-radio.vue"
import miButton from "./mi-button.vue"
import miPopup from "../mi-popup.vue"
import { pwdArrays, validPasswordStrength } from "src/utils/index"
const $q = useQuasar();

const data = ref([]);
const addDialog = ref(false);

const props = defineProps({
  formOption: {
    type: Array,
    default: () => [],
  },
  form: {
    type: Object,
    default: () => ({}),
  },
});

const formRef = ref(null)

defineExpose({ formRef })

const codeTime = ref(0)
const tiemr = ref(null)
const coderLoading = ref(false)

//邮箱验证码倒计时
const setCodeTime = (num = 60) => {
  if (codeTime.value) {
    return
  }
  codeTime.value = num
  tiemr.value = window.setInterval(() => {
    codeTime.value--
    sessionStorage.setItem("codeTime", JSON.stringify({ datetime: new Date().getTime(), codeTime: codeTime.value }))
    if (codeTime.value <= 0) {
      window.clearInterval(tiemr.value)
      codeTime.value = 0
    }
  }, 1000)
}

//发送邮箱验证码code
const sendCode = async (item, form) => {
  if (item.events && item.events.sendCode && codeTime.value <= 0) {
    coderLoading.value = true
    await item.events.sendCode(item.key, form[item.key], form).then(() => {
      setCodeTime()
      coderLoading.value = false
    }).catch(() => {
      coderLoading.value = false
    })

  }
}

const pwdStength = ref({})
const isShowPwdBars = ref(false)
//改变密码
const changePassword = (val) => {
  pwdStength.value = validPasswordStrength(val)
  isShowPwdBars.value = true
}

const emit = defineEmits([
  'submit',
  'changeForm',
]);

const onSubmit = () => {
  formRef.value.validate().then(success => {
    if (success) {
      // yay, models are correct
      emit('onSubmit');

    }
    else {
      // oh no, user has filled in
      // at least one invalid value
    }
  })

};

onMounted(() => {
  formRef.value.reset()
  let codeObj = JSON.parse(sessionStorage.getItem("codeTime"))
  if (codeObj) {
    let disTime = new Date() - codeObj.datetime
    let num = codeObj.codeTime - Math.floor(disTime / 1000)
    setCodeTime(num)
  }

})

</script>

<style lang="scss" scoped>
.pwd-bar {
  display: inline-block;
  margin-left: 2px;
  width: 28px;
  height: 6px;
}
.pwd-bar-no {
  opacity: 0;
}
</style>