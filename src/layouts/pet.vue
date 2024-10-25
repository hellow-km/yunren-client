<template>
  <div class="pet-page">
    <span
      class="close-btn"
      @click="closePet"
    >
      <img
        width="20"
        src="../assets/images/common/close.svg"
        alt=""
      >
    </span>
    <div class="pet-menu noDrag">
      <div
        class="pet-menu-item"
        v-for="item in menuActions"
        :key="item.name"
        @click="loadActions(item.path)"
      >
        <span class="menu-item-name">{{item.name}}</span>
      </div>
    </div>
    <img
      @mousedown="onMousedown($event)"
      @mousemove="onMousemove($event)"
      @mouseup="onMouseup($event)"
      draggable="false"
      class="pet-move"
      src="../assets/images/common/move.png"
      alt=""
    >
    <div
      id="yunren-pet"
      @click="openPetMenu"
    >

    </div>
  </div>
</template>

<script setup>
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';
import { MMDLoader } from 'three/addons/loaders/MMDLoader.js';
import { MMDAnimationHelper } from 'three/addons/animation/MMDAnimationHelper.js';
import { onMounted, ref } from 'vue';
const { mainPath, require, path, fs, port, readFileSync } = window.api

const modelListFile = path.join(mainPath, "model")
const actionsListFile = path.join(mainPath, "actions")

const allModels = ref(JSON.parse(readFileSync(modelListFile)))
const allActions = ref(JSON.parse(readFileSync(actionsListFile)))

const props = defineProps({
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  left: {
    type: Number,
    default: 0
  },
  top: {
    type: Number,
    default: 0
  }
})
const localServerUrl = "http://localhost:" + port

const moveObj = ref({
  isDown: false,
  currentX: 0,
  currentY: 0
})

const emit = defineEmits(["changePosition", "setPosition"])

//拖拽事件
const onMousedown = (e) => {
  moveObj.value.isDown = true
  moveObj.value.currentX = e.clientX
  moveObj.value.currentY = e.clientY
  emit("setPosition", e.clientX, e.clientY)
  document.addEventListener("mousemove", onMousemove)
  document.addEventListener("mouseup", onMouseup)
}

//拖拽事件
const onMousemove = (e) => {
  if (moveObj.value.isDown) {
    let left = e.clientX - moveObj.value.currentX
    let top = e.clientY - moveObj.value.currentY

    if (e.clientX <= 0) {
      left = -props.left
    }

    if (e.clientY <= 50) {
      top = -props.top + 50
    }

    if (e.clientX + props.width >= window.innerWidth) {
      left = window.innerWidth - props.width - props.left - 1
    }

    if (e.clientY + props.height >= window.innerHeight) {
      top = window.innerHeight - props.top - props.height - 1
    }

    emit("changePosition", left, top)
  }
}

const closePet = () => {
  window.api.sendMessage("closePet")
}

const menuVisible = ref(false)

//拖拽事件
const onMouseup = (e) => {
  moveObj.value.isDown = false
  document.removeEventListener("mousemove", onMousemove)
  emit("setPosition", e.clientX, e.clientY)
}

const openPetMenu = () => {
  menuVisible.value = true
}

const closePetMenu = () => {
  menuVisible.value = false
}
const scene = new THREE.Scene();

const mmdLoader = new MMDLoader();

const clock = new THREE.Clock();

const helper = new MMDAnimationHelper();

let modelMesh = null
let ikHelper
//加载模型
const loadModel = (el) => {

  const camera = new THREE.PerspectiveCamera(30, el.offsetWidth / el.offsetHeight, 0.1, 500);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setClearColor(0x000000, 0); // 设置背景颜色为透明

  const controls = new OrbitControls(camera, renderer.domElement);

  renderer.setSize(el.offsetWidth, el.offsetHeight);

  el.appendChild(renderer.domElement);

  camera.position.set(0, 0, 0);
  controls.update();

  // 添加环境光
  var ambientLight = new THREE.AmbientLight(0xffffffff, 1.5);
  scene.add(ambientLight);

  // 添加平行光
  var directionalLight = new THREE.DirectionalLight(0xffffffff, 1.5);
  directionalLight.position.set(0, 0, 0);
  scene.add(directionalLight);

  // instantiate a loader
  loadChareter()
  // 渲染场景
  renderer.render(scene, camera);
  camera.position.z = 55;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // cube2.rotation.x += 0.01;
    renderer.render(scene, camera);
    helper.update(clock.getDelta());
    if (modelMesh) {
      // 计算模型的包围盒
      var boundingBox = new THREE.Box3().setFromObject(modelMesh);

      // 计算模型的中心
      var center = new THREE.Vector3();
      boundingBox.getCenter(center);

      // // 将模型居中
      modelMesh.position.sub(center);
    }

  }

  animate();
}

const menuActions = allActions.value.filter(item => item.isUsed)
menuActions.push({ name: "停止", path: "" })
const pmxPath = allModels.value.find(item => item.isUsed).path

const loadChareter = (cb) => {
  mmdLoader.load(pmxPath, function (mesh) {
    if (modelMesh) {
      scene.remove(modelMesh)
    }
    modelMesh = mesh
    // 计算模型的包围盒
    var boundingBox = new THREE.Box3().setFromObject(modelMesh);

    // 计算模型的中心
    var center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // // 将模型居中
    modelMesh.position.sub(center);

    // 将MMD模型添加到场景中
    scene.add(modelMesh)

    cb && cb()
  }, function (er, err) {
  }, function (err) {
    console.log("ee", err);

  });
}
let timer = null
const loadActions = (vmdPath, cb) => {
  loadChareter(() => {
    if (!vmdPath) {
      timer && clearTimeout(timer)
      return
    }

    const animationMixer = new THREE.AnimationMixer(modelMesh);
    const vmdPath2 = vmdPath
    mmdLoader.loadAnimation(vmdPath2, modelMesh, function (anim) {
      // 得到动画剪辑
      const action = anim;
      helper.meshes.forEach(mesh => {
        helper.remove(mesh)
      })

      // 将动画剪辑添加到 AnimationMixer 中
      const animationAction = animationMixer.clipAction(anim);

      // 设置动画循环方式为重复播放
      animationAction.setLoop(THREE.LoopOnce);

      // 结束时保持最后一帧的状态
      animationAction.clampWhenFinished = true;

      // 启动动画
      animationAction.play();

      helper.add(modelMesh, {
        animation: animationAction._clip,
        physics: true,
      });
    }, function () { }, function (err) {
      console.log("err", err);
    });
  })
}
function loadScript(src, onLoad) {
  // 创建一个 script 元素
  var script = document.createElement("script");
  // 设置 script 元素的 src 属性为 Google Analytics 跟踪代码的 URL
  script.src = src;

  // 设置 script 元素的 async 属性为 true，使其异步加载
  script.async = true;
  script.onload = function () {
    onLoad && onLoad();
  };
  // 将 script 元素添加到文档的 head 部分，开始加载 Google Analytics 跟踪代码
  document.head.appendChild(script);
}

onMounted(() => {
  const AmmoPath = path.join(mainPath, "public/ammo.js")
  const Ammo = require(AmmoPath)
  let petBox = document.getElementById("yunren-pet")
  window.Ammo = Ammo()
  loadModel(petBox);
  // loadActions(menuActions[0].path)
})

</script>

<style lang="scss" scoped>
.pet-page {
  position: relative;
  width: 300px;
  height: 300px;
  margin: auto;
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    &:active {
      opacity: 0.9;
    }
  }
  #yunren-pet {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: transparent;
  }
  .pet-move {
    -webkit-app-region: drag;
    position: absolute;
    left: 0;
    top: 0;
    width: 30px;
    height: 30px;
    cursor: move;
    user-select: none;

    z-index: 100;
    padding: 5px;
  }
  &:hover {
    .pet-menu {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .pet-menu {
    opacity: 0;
    transform: translateX(-100%);
    z-index: 99999;
    position: absolute;
    left: 0;
    top: 25px;
    transition: all 0.3s;
    .pet-menu-item {
      cursor: pointer;
      padding: 5px;
      border-radius: 8px;
      background-color: rgba(33, 33, 33, 0.8);

      cursor: pointer;
      color: #fff;
      margin-top: 5px;
      font-size: 12px;
      text-align: center;
      &:hover {
        opacity: 0.7;
      }
      &:active {
        opacity: 0.9;
      }
      .menu-item-name {
        display: inline-block;
        max-width: 100px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>