<template>
  <div class="qr-region">
    <div>
      <miUpload
        :isMulti="false"
        :maxSize="20*1024*1024"
        @getFiles="getFiles"
        :height="120"
        :width="420"
        accept="image/jpg,image/png, image/jpeg,image/webp"
      ></miUpload>
      <div style="margin-top:20px">
        <labelValue
          :title="$t('result')+':'"
          :label="result"
        ></labelValue>
      </div>
    </div>
  </div>
</template>

<script setup>
import jsQR from 'jsqr';
import { ref } from 'vue';
import miUpload from "src/components/form/mi-upload.vue";
import labelValue from "../components/labelValue.vue"
const canvas_g = ref(null)

const result = ref("")

const getFiles = (files) => {
  const file = files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          result.value = code.data
        } else {
          this.qrCodeData = '';
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvas_g.value;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          console.log(code.data);
        } else {
          this.qrCodeData = '';
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style>
.qr-region {
  display: flex;
  justify-content: center;
}
</style>
