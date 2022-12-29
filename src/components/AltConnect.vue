<template>
  <el-row>
    <el-col :span="8">
      <el-card style="border: none" :body-style="{ padding: '0px' }">
        <div style="position: relative">
          <img draggable="false" v-bind:src="getimg(this.acgdata.AID)" :onerror="defalutLogoUrl" class="image"
            width="100%" style="border-radius: 3px 3px 0px 0px" />
        </div>
        <div>
          <span id="NewTitle">{{ this.acgdata.NewTitle }}</span>
        </div>
        <div id="Title">
          <span>{{ this.acgdata.Title }}</span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-row>
        <el-col :xs="24" :sm="12" :md="8" v-for="(item, index) in acg_url_data" :key="index">
          <a :href="item.api + (item.mode == 0 ? acgdata.AID : acgdata.Title)" target="_blank">
            <el-button type="primary" plain style="height: 50px;" :title="item.title">
              <img :src="item.icon" width="100%" />
              {{ item.icon == "" ? item.title : "" }}</el-button>
          </a>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import DefaultData from "./DefaultData.vue";

export default {
  name: "AltConnect",

  props: {
    acgdata: [],
  },
  data() {
    return {
      acg_url_data: DefaultData.old_acg_url,
      imgURL: "",
      defalutLogoUrl: DefaultData.errorimg,
    };
  },

  mounted() {

    // var _this = this;
    // _this.acg_url_data = DefaultData.old_acg_url;

    // axios
    //   .get("https://raw.githubusercontent.com/Afurete233/Ayaka_TeaRoom/main/URLdata.json")
    //   .then((response) => {
    //     _this.acg_url_data = response.data;
    //   }).catch(function (error) {
    //     console.log(error.response);
    //     _this.acg_url_data = DefaultData.old_acg_url;
    //   });



  },
  methods: {
    getimg(index) {
      var _this = this;

      if (this.acgdata.Title == undefined) {
        // eslint-disable-next-line vue/no-mutating-props
        this.acgdata.Title = this.acgdata.R动画名称;
      }

      axios
        .get("https://api.agefans.app/v2/detail/" + index)
        .then((response) => {
          _this.imgURL = response.data.AniInfo.R封面图;
          _this.acgdata.NewTitle = response.data.AniInfo.R新番标题;
        });
      return _this.imgURL;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  color: #4297e0;
  text-decoration: none;
}

.el-button {
  width: 100px;
  margin: 5px;
}
</style>