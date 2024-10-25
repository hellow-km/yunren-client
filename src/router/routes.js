let routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("src/pages/home.vue"),
        meta: {
          desc: "网站工具,图片工具,在线工具,website tools,online tools,image tools,云任工具,云任工具在线,gonju,gongju,zaixiangonju",
          keywords:
            "网站工具,图片工具,在线工具,website tools,online tools,image tools,云任工具,云任工具在线,gonju,gongju,zaixiangonju",
          title: "首页",
        },
      },

      {
        path: "/onlineTools",
        name: "onlineTools",
        component: () => import("src/pages/onlineTools.vue"),
        meta: {
          desc: "网站工具,图片工具,在线工具,website tools,online tools,image tools,云任工具,云任工具在线",
          keywords:
            "网站工具,图片工具,在线工具,website tools,online tools,image tools,云任工具,云任工具在线",
          title: "在线工具",
        },
      },
      {
        path: "/wxApp",
        name: "wxApp",
        component: () => import("src/pages/wxApp.vue"),
        meta: {
          desc: "",
          keywords: "",
        },
      },
      {
        name: "notFound",
        path: "/:catchAll(.*)*",
        component: () => import("pages/ErrorNotFound.vue"),
        meta: {
          desc: "404",
          keywords: "404",
        },
      },

      {
        name: "imgCompress",
        path: "/imgCompress",
        component: () => import("src/pages/onlineTools/imgCompress.vue"),
        meta: {
          desc: "在线jpg压缩,在线png压缩,在线webp压缩,图片压缩,免费在线图片压缩,在线压缩,云任图片压缩",
          keywords:
            "在线jpg压缩,在线png压缩,在线webp压缩,图片压缩,免费在线图片压缩,在线压缩,云任图片压缩",
          title: "图片压缩",
        },
      },
      {
        name: "imgConverter",
        path: "/imgConverter",
        component: () => import("src/pages/onlineTools/imgConverter.vue"),
        meta: {
          desc: "免费格式转换,图片格式转换,在线图片格式转换,png转换,jpg转换,webp转换,在线图片大小调整,在线图片旋转,图片免费旋转,云任图片转换",
          keywords:
            "免费格式转换,图片格式转换,在线图片格式转换,png转换,jpg转换,webp转换,在线图片大小调整,在线图片旋转,图片免费旋转,云任图片转换",
          title: "图片转换",
        },
      },
      {
        name: "IPSelect",
        path: "/IPSelect",
        component: () => import("src/pages/onlineTools/IPSelect.vue"),
        meta: {
          desc: "IP查询,云任ip",
          keywords: "IP查询,云任ip",
          title: "IP查询",
        },
      },
      {
        name: "games",
        path: "/games",
        component: () => import("src/pages/games.vue"),
      },
      {
        name: "gameTools",
        path: "/gameTools",
        component: () => import("src/pages/gameTools.vue"),
      },

      {
        name: "articles",
        path: "/articles",
        component: () => import("src/pages/articles.vue"),
        meta: {
          desc: "文章,博客,Vue,前端,后端,生活,Android,js,nodejs",
          keywords: "文章,博客,Vue,前端,后端,生活,Android,js,nodejs",
          title: "文章",
        },
      },
      {
        name: "personalCenter",
        path: "/personalCenter",
        component: () => import("src/pages/personalCenter.vue"),
        meta: {
          desc: "文章,个人中心,个人信息,我的文章,我的博客",
          keywords: "文章,个人中心,个人信息,我的文章,我的博客",
          title: "个人中心",
        },
      },
      {
        name: "uploadArticle",
        path: "/uploadArticle/:uID",
        component: () => import("src/pages/uploadArticle.vue"),
        meta: {
          desc: "文章上传,我的博客上传",
          keywords: "文章上传,我的博客上传",
          title: "文章上传",
        },
      },
      {
        name: "articleDetail",
        path: "/articleDetail/:aID",
        component: () => import("src/pages/articleDetail.vue"),
        meta: {
          title: "文章详情",
        },
      },
      {
        path: "/feetback",
        name: "feetback",
        component: () => import("src/pages/feedback.vue"),
        meta: {
          title: "站长反馈",
        },
      },
      {
        path: "/htmlToXML",
        name: "htmlToXML",
        component: () => import("src/pages/onlineTools/htmlToXML.vue"),
        meta: {
          desc: "在线免费html转xml,online free html to xml",
          keywords: "在线免费html转xml,online free html to xml",
          title: "html转xml",
        },
      },
      {
        path: "/cssCompress",
        name: "cssCompress",
        component: () => import("src/pages/onlineTools/cssCompress.vue"),
        meta: {
          desc: "在线免费css压缩,免费在线css压缩,online free css compress",
          keywords: "在线免费css压缩,免费在线css压缩,online free css compress",
          title: "css压缩",
        },
      },
      {
        path: "/jsonCompress",
        name: "jsonCompress",
        component: () => import("src/pages/onlineTools/jsonCompress.vue"),
        meta: {
          desc: "在线免费json压缩,online free json compress",
          keywords: "在线免费json压缩,online free json compress",
          title: "json压缩",
        },
      },
      {
        path: "/jsCompress",
        name: "jsCompress",
        component: () => import("src/pages/onlineTools/jsCompress.vue"),
        meta: {
          desc: "在线免费js压缩,免费在线js压缩,online free js compress",
          keywords: "在线免费js压缩,免费在线js压缩,online free js compress",
          title: "js压缩",
        },
      },
      {
        path: "/jsObfuscator",
        name: "jsObfuscator",
        component: () => import("src/pages/onlineTools/jsObfuscator.vue"),
        meta: {
          desc: "在线免费js加密,免费在线js加密,online free js Obfuscator",
          keywords: "在线免费js加密,免费在线js加密,online free js Obfuscator",
          title: "js加密",
        },
      },
      {
        path: "/pictureInfo",
        name: "pictureInfo",
        component: () => import("src/pages/onlineTools/pictureInfo.vue"),
        meta: {
          desc: "在线查询图片信息",
          keywords: "在线查询图片信息",
          title: "图片信息获取",
        },
      },
      {
        path: "/download",
        name: "download",
        component: () => import("src/pages/download.vue"),
      },
      {
        path: "/xlsEdit",
        name: "xlsEdit",
        component: () => import("src/pages/onlineTools/xlsEdit.vue"),
        meta: {
          desc: "xls在线编辑,xlsx在线编辑,excel在线编辑,xls在线生成,xlsx在线生成,excel在线生成,云任excel编辑,云任excel在线",
          keywords:
            "xls在线编辑,xlsx在线编辑,excel在线编辑,xls在线生成,xlsx在线生成,excel在线生成,云任excel编辑,云任excel在线",
          title: "xls在线文字编辑",
        },
      },
      {
        path: "/imageMerge",
        name: "imageMerge",
        component: () => import("src/pages/onlineTools/imageMerge.vue"),
        meta: {
          desc: "在线图片合成,logo制作,logo合成,文字合成,店铺图片生成,店铺封面生成,云任logo,云任图片合成",
          keywords:
            "在线图片合成,logo制作,logo合成,文字合成,店铺图片生成,店铺封面生成,云任logo,云任图片合成",
          title: "图片合成",
        },
      },
      {
        path: "/idPhoto",
        name: "idPhoto",
        component: () => import("src/pages/onlineTools/idPhoto.vue"),
      },
      {
        path: "/textToImage",
        name: "textToImage",
        component: () => import("src/pages/onlineTools/textToImage.vue"),
        meta: {
          desc: "文字转图片,文字改图片,文本转图片,云任文字转图片",
          keywords: "文字转图片,文字改图片,文本转图片,云任文字转图片",
          title: "文字转图片",
        },
      },
      {
        path: "/qrRegion",
        name: "qrRegion",
        component: () => import("src/pages/onlineTools/qrRegion.vue"),
        meta: {
          desc: "二维码识别,二维码转链接,二维码转换,二维码转文本,云任二维码识别,云任二维码转链接",
          keywords:
            "二维码识别,二维码转链接,二维码转换,二维码转文本,云任二维码识别,云任二维码转链接",
          title: "二维码识别",
        },
      },
      {
        path: "/qrCreate",
        name: "qrCreate",
        component: () => import("src/pages/onlineTools/qrCreate.vue"),
        meta: {
          desc: "二维码创建,文本转二维码,生成二维码,链接生成二维码,云任生成二维码",
          keywords:
            "二维码创建,文本转二维码,生成二维码,链接生成二维码,云任生成二维码",
          title: "生成二维码",
        },
      },
      {
        path: "/SpriteMake",
        name: "SpriteMake",
        component: () => import("src/pages/onlineTools/SpriteMake.vue"),
        meta: {
          desc: "精灵图制作,图片拼图,图片合成大图,证件照拼图,拼证件照,贴纸板制作,雪碧图制作,雪碧图,精灵图,云任精灵图,云任雪碧图",
          keywords:
            "精灵图制作,图片拼图,图片合成大图,证件照拼图,拼证件照,贴纸板制作,雪碧图制作,雪碧图,精灵图,云任精灵图,云任雪碧图",
          title: "贴纸板制作",
        },
      },
      {
        path: "/SpriteMake",
        name: "SpriteMake",
        component: () => import("src/pages/onlineTools/SpriteMake.vue"),
        meta: {
          desc: "精灵图制作,图片拼图,图片合成大图,证件照拼图,拼证件照,贴纸板制作,雪碧图制作,雪碧图,精灵图,云任精灵图,云任雪碧图",
          keywords:
            "精灵图制作,图片拼图,图片合成大图,证件照拼图,拼证件照,贴纸板制作,雪碧图制作,雪碧图,精灵图,云任精灵图,云任雪碧图",
          title: "贴纸板制作",
        },
      },
      {
        path: "/register",
        name: "register",
        component: () => import("src/components/register.vue"),
      },
      {
        path: "/login",
        name: "login",
        component: () => import("src/components/login.vue"),
      },
      {
        path: "/setting",
        name: "setting",
        component: () => import("src/pages/setting.vue"),
      },
      {
        path: "/forgetPassword",
        name: "forgetPassword",
        component: () => import("src/components/resetPassword.vue"),
      },
      {
        path: "/packageDownload",
        name: "packageDownload",
        component: () => import("src/pages/packageDownload.vue"),
      },
      {
        path: "/videoToGif",
        name: "videoToGif",
        component: () => import("src/pages/videoToGif.vue"),
      },
      {
        path: "/recordVideo",
        name: "recordVideo",
        component: () => import("src/pages/recordVideo.vue"),
      },
    ],
  },
  {
    path: "/pet",
    name: "pet",
    component: () => import("src/layouts/pet.vue"),
  },
  // {
  //   path: "/lightbandTop",
  //   name: "lightbandTop",
  //   component: () => import("src/pages/lightbandTop.vue"),
  // },

  // Always leave this as last one,
  // but you can also remove it
];

if (window.api.isPet) {
  routes = [
    {
      path: "/",
      component: () => import("src/layouts/pet.vue"),
    },
  ];
}

if (window.api.isTop) {
  routes = [
    {
      path: "/",
      component: () => import("src/pages/toTop.vue"),
    },
  ];
}

export default routes;
