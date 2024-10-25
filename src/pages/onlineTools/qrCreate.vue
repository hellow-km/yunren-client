<template>
  <div class="qr-create">
    <div class="box">
      <div class="options">
        <div>
          <span>{{$t("Enter the QR code text that needs to be generated")}}:</span>
          <miInput
            outlined
            v-model="text"
            type="textarea"
          ></miInput>
        </div>
        <div class="opt-row">
          <span>{{$t("width and height")}}</span>
          <miInput
            input-class="opt-ipt-center"
            v-model="qrWidth"
            type="number"
          ></miInput>
        </div>
      </div>
      <div style="margin:15px 0">
        <miButton
          :disabled="!qrWidth || qrWidth <= 0 || !text"
          :label="$t('Generate')"
          @click="onGenerate"
        ></miButton>
        <miButton
          style="margin-left:10px"
          :disabled="!base64"
          :label="$t('download')"
          @click="onDownload"
        ></miButton>
      </div>
      <div class="page-content">
        <p>{{$t("Generate result")}}</p>
        <canvas ref="canvas_g"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import QRCode from 'qrcode';
import { ref } from 'vue';
import miUpload from "src/components/form/mi-upload.vue";
import miInput from "src/components/form/mi-input.vue"
import labelValue from "../components/labelValue.vue"
import miButton from "src/components/form/mi-button.vue"
import { saveBase64Image } from 'src/utils';
const canvas_g = ref(null)
const text = ref("")
const qrWidth = ref(200)
const base64 = ref("")
const onGenerate = () => {
  if (qrWidth.value && qrWidth.value > 0) {
    QRCode.toCanvas(canvas_g.value, text.value, { width: qrWidth.value }, (error) => {
      if (error) console.error(error);
      else {
        base64.value = canvas_g.value.toDataURL()
      }
    });
  }
}

const onDownload = () => {
  saveBase64Image(base64.value)
}

</script>

<style lang="scss" scoped>
.qr-create {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .box {
    min-width: 400px;
    .options {
      .opt-row {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
