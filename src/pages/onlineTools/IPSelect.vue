<template>
  <q-page class="ipconfig-page">
    <div style="margin-bottom:20px">{{$t("intro.ipSelect")}}</div>
    <div class="options">
      <span>{{ $t('selectQuerySource') }}</span>
      <miSelect
        class="opt-sel"
        :options="ipSourceList"
        v-model="ipSource"
      ></miSelect>
    </div>
    <div>
      <div class="page-line ipConfig-center">
        <div class="ym-label">{{ $t('ipOrDomainQuery') }}</div>
        <miInput
          class="ip-input"
          v-model="ipInput"
          outlined
          :placeholder="$t('inputPlaceholder')"
        >
          <template v-slot:append>
            <miButton
              :label="$t('query')"
              @click="ipSelect"
            ></miButton>
          </template>
        </miInput>
      </div>
      <labelValue
        class="page-line"
        :title="$t('yourIPAddress')"
        :label="ip"
      ></labelValue>

      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('IPAddress')"
        :label="ipForm.ip"
      ></labelValue>
      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('longitude')"
        :label="ipForm.longitude"
      ></labelValue>
      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('latitude')"
        :label="ipForm.latitude"
      ></labelValue>
      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('country')"
        :label="ipForm.county"
      ></labelValue>
      <labelValue
        class="page-line"
        :title="$t('city')"
        :label="ipForm.city"
      ></labelValue>
      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('region')"
        :label="ipForm.region"
      ></labelValue>
      <labelValue
        labelGrayBack
        class="page-line"
        :title="$t('zipCode')"
        :label="ipForm.zip"
      ></labelValue>
    </div>

  </q-page>

</template>

<script setup>
import miInput from "src/components/form/mi-input.vue"
import miButton from "src/components/form/mi-button.vue"
import { ref } from "vue";
import labelValue from "../components/labelValue.vue"
import { getClientIP, getClientIPSimple } from "src/http/common";
import miSelect from "src/components/form/mi-select.vue"
import { notify } from "src/utils";
defineOptions({
  name: 'IPSelect'
});
const ipSourceList = ref([
  {
    value: "ipbase",
    label: $t("source") + "1"
  },
  {
    value: "ipinfo",
    label: $t("source") + "2"
  }
])
const ipSource = ref("ipbase")
const ipInput = ref("")
const ip = ref("")
const ipForm = ref({
  ip: "",
  city: "",
  latitude: "",
  longitude: "",
  county: "",
  region: "",
  zip: ""
})
const ipSelect = async () => {
  try {
    if (ipSource.value == "ipbase") {
      let res = await getClientIP({ ip: ipInput.value })
      if (res.status === 200) {
        let infoData = res.data.data
        ip.value = infoData.ip
        let location = infoData.location
        ipForm.value = {
          ip: infoData.ip,
          city: location.city.name_translated,
          county: location.country.name_translated,
          region: location.region.name_translated,
          latitude: location.latitude,
          longitude: location.longitude,
          zip: location.zip
        }
      } else {
        notify(res.message, "negative")
      }
    } else {
      let res = await getClientIPSimple({ ip: ipInput.value })
      let result = JSON.parse(res.data.result)
      console.log(result);
      ip.value = result.ip
      ipForm.value = {
        ip: result.ip,
        city: result.city,
        county: result.country,
        region: result.region,
        latitude: result.loc.split(",")[0],
        longitude: result.loc.split(",")[1],
        zip: result.postal
      }
    }
  } catch (e) {
    notify($t("noIPCount"), "negative")
  }
}

</script>

<style lang="scss" scoped>
.ipconfig-page {
  .options {
    margin-bottom: 15px;
    .opt-sel {
      display: inline-block;
      width: 150px;
      margin-left: 25px;
    }
  }
  .ym-label {
    width: 200px;
  }
  width: 800px;
  padding-top: 50px;
  margin: 0 auto;
  .ipConfig-center {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    .ip-input {
      width: 100%;
      ::v-deep .q-field__append {
        width: 120px;
        .q-btn {
          width: 120px;
        }
      }
    }
  }
  .page-line {
    margin-top: 8px;
  }
}
</style>
