<template>
  <div v-if="reload">
    <transition name="el-fade-in-linear">
      <div id="contnum" v-if="item == 5">
        <el-button type="primary" @click="goTop">{{ contnum }}</el-button>
      </div>
    </transition>
    <el-container>
      <el-header :class="bg_sw ? null : 'tp'">{{ APPName }}<i class="el-icon-milk-tea" /></el-header>
      <el-container>
        <el-aside style="width: 100px" :style="{ background: bg_sw ? '#ffffff+00' : '#333' }">
          <el-col>
            <el-menu style="border: none" default-active="1" class="el-menu-vertical-demo" background-color="#00000000"
              text-color="#2b597388" active-text-color="#689fd2">
              <el-row id="Sun">
                <el-button type="info" icon="el-icon-ice-cream-square" circle @click="setbg"></el-button>
              </el-row>
              <el-menu-item index="1" @click="
  data_type = 'recommend';
item = 1;
              ">
                <i class="el-icon-menu"></i>
                <span slot="title">开始</span>
              </el-menu-item>
              <el-menu-item index="2" @click="
  data_type = 'update';
item = 2;
              ">
                <i class="el-icon-time"></i>
                <span slot="title">更新</span>
              </el-menu-item>
              <el-menu-item index="4" @click="item = 3">
                <i class="el-icon-ice-tea"></i>
                <span slot="title">时间表</span>
              </el-menu-item>
              <el-menu-item index="5" @click="item = 4">
                <i class="el-icon-search"></i>
                <span slot="title">搜索</span>
              </el-menu-item>
              <el-menu-item index="6" @click="item = 5">
                <i class="el-icon-cold-drink"></i>
                <span slot="title">收藏</span>
              </el-menu-item>
              <el-menu-item index="7" @click="item = 6">
                <i class="el-icon-setting"></i>
                <span slot="title">设置</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main :style="{ background: bg_sw ? '#ffffff+00' : '#333' }">
          <transition-group name="el-fade-in-linear">
            <Data_E v-if="item == 1 || item == 2" :Data_type="data_type" :key="item" />
            <Week v-if="item == 3" :key="item" />
            <Search v-if="item == 4" :key="item" />
            <Love v-if="item == 5" v-on:getcontnum="getcontnum" :key="item" />
            <Setting v-if="item == 6" :key="item" />
          </transition-group>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import DefaultData from "./DefaultData.vue";
import Data_E from "./Data.vue";
import Love from "./love.vue";
import Setting from "./Setting.vue";
import Search from "./Search.vue";
import Week from "./Week.vue";

export default {
  name: "Home_M",
  data() {
    return {
      APPName: "白鷺茶室",
      data_type: "recommend",
      item: 1,
      reload: true,
      bg_sw: true,
      contnum: 0,
    };
  },
  components: {
    Data_E,
    Love,
    Setting,
    Search,
    Week,
  },
  methods: {
    getcontnum(nownum) {
      this.contnum = nownum;
    },
    setbg() {
      this.bg_sw = !this.bg_sw;
    },
    goTop() {
      let top =
        document.querySelector("#app > div > section > section > main  > span")
          .scrollTop ||
        document.querySelector("#app > div > section > section > main")
          .scrollTop;
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.querySelector(
          "#app > div > section > section > main  "
        ).scrollTop =
          document.querySelector(
            "#app > div > section > section > main > span"
          ).scrollTop =
          top -=
          50;
        if (top <= 0) {
          clearInterval(timeTop);
        }
      }, 5);
    },
  },
  mounted() {
    DefaultData.loadweek();
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #72bdfd;
  color: #2b597388;
  font-weight: bold;
  line-height: 60px;
  font-size: 30px;
  letter-spacing: 15px;
  text-align: center;
  position: relative;
  font-style: italic;
}

.el-aside {
  overflow: hidden;
  text-align: center;
  line-height: 200px;
  display: block;
  position: relative;
}

.el-menu-vertical-demo {
  height: calc(100vh - 60px);
}

.el-main {
  left: 100px;
  right: 0;
  top: 60px;
  bottom: 0;
  position: fixed;
  overflow-y: scroll;
  padding: 15px 0px;

}


#Sun {
  width: 80px;
  height: 150px;
  position: absolute;
  left: 0px;
  bottom: 0px;
}

#contnum {
  top: 10px;
  right: 50px;
  z-index: 10;
  position: absolute;
}

.tp {
  background: #1a1c1f;
  background-size: cover;
  background-image: url(https://tva3.sinaimg.cn/mw2000/008q8Kn3gy1h4i5qlbbzng30ku0ak1ky.gif);
}
</style>