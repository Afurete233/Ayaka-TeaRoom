<template>
  <el-row>
    <week-tab v-on:gettab="gettab($event)" :weeknum="weeks" />
    <transition name="el-fade-in">
      <el-col>
        <el-timeline>
          <transition-group name="el-zoom-in-top">
            <el-timeline-item v-for="(item, index) in showdata" :timestamp="item.R更新时间str" placement="top"
              draggable="false" :key="index" type="primary" :title="item.R动画名称">
              <span @click="
                dialogacgweb = true;
              acgdata = item;
              ">
                <a target="_blank">
                  <el-card draggable="false" style="border: none" :body-style="{
                    padding: '0px',
                    background: type_color(item.AID),
                  }" v-if="reload" :style="{ background: type_color(item.AID) }">
                    <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" draggable="true" @mousedown.native="move"
                      @dragend.native="up(item.AID, item.R动画名称, item)">
                      <el-card draggable="true" style="border: none" :body-style="{
                        padding: '0px',
                      }">
                        <div style="position: relative">
                          <img draggable="false" :src="item.R封面图小" class="image" width="100%" :onerror="defalutLogoUrl"
                            style="border-radius: 3px 3px 0px 0px;aspect-ratio: 150 / 208;" />
                          <transition v-if="reload" name="el-fade-in-linear">
                            <img src="..\public\heart.svg" v-if="ishow(item.AID)" id="love" />
                            <div v-if="isBlack(item.id)" id="black">黑名单</div>
                          </transition>
                          <h1 v-if="isNew(item.AID)" id="isNew">New!</h1>
                          <span id="NewTitle">{{ item.R新番标题 }}</span>
                        </div>
                        <div id="Title">
                          <span>{{ item.R动画名称 }}</span>
                        </div>
                      </el-card>
                    </el-col>
                    <h4 id="Title">{{ item.R动画名称 }}</h4>
                    <p id="Rjiessao">{{ item.R简介 }}</p>
                  </el-card>
                </a>
              </span>
            </el-timeline-item>
          </transition-group>
        </el-timeline>
      </el-col>
    </transition>
    <el-dialog :title="acgdata.R动画名称" :visible.sync="dialogacgweb" :modal-append-to-body='false'>
      <AltConnectVue :acgdata="acgdata"> </AltConnectVue>
    </el-dialog>
    <el-col>
      <transition name="el-zoom-in-center">
        <el-col id="Tips" v-if="Tips_is">
          <el-card id="Tips_card">
            <span><b>设置:{{ Tips_data }}</b></span>
          </el-card>
        </el-col>
      </transition>
    </el-col>
  </el-row>
</template>

<script>
import AltConnectVue from "./AltConnect.vue";
import WeekTab from "./WeekTab.vue";
import axios from "axios";
import DefaultData from "./DefaultData.vue";
import Info_box from "./info.vue";

export default {
  components: { WeekTab, AltConnectVue },
  name: "EveryWeek",

  data() {
    return {
      Tips_is: false,
      Tips_data: '',
      acgdata: [],
      dialogacgweb: false,
      defalutLogoUrl: DefaultData.errorimg,
      mian_url: DefaultData.Main_url,
      acg_colos: DefaultData.acg_colos,
      save: [],
      saveimg: [],
      weeks: this.getweekday(),
      reload: true,
      title: "",
      AID: 0,
      showdata: [],
      josn_data: [],
      MAXnum: 20,
      nownum: 0,
      contnum: 0,
      NowRuning: true,
    };
  },

  mounted() {
    var _this = this;
    this.nownum = 0;
    this.MAXnum = 5;

    axios
      .get(DefaultData.age_api + "home-list?update=1&recommend=1")
      .then((response) => {
        _this.save = response.data.XinfansInfo;
        this.$nextTick(() => {
          this.NowRuning = false;
          _this.loding();
        });
      })
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));

    setTimeout(function () {
      if (_this.NowRuning) _this.autoadd();
    }, 500);

    window.onresize = () => {
      if (this.NowRuning) this.autoadd();
    };

    document
      .querySelector("#app > div > section > section > main ")
      .addEventListener("scroll", function () {
        if (
          document.querySelector("#app > div > section > section > main")
            .scrollTop +
          window.innerHeight >=
          document.querySelector("#app > div > section > section > main >span ")
            .offsetHeight
        ) {
          _this.regetdata();
        }
      });
  },
  methods: {
    isNew(id) {
      return DefaultData.isNew(id);
    },
    autoadd(num) {
      if (num == null) num = 0;
      if (
        document.querySelector("#app > div > section > section > main >span ")
          .offsetHeight <
        document.querySelector("#app > div > section > section > main")
          .offsetHeight +
        num
      ) {
        this.regetdata();
      }
    },
    getweekday() {
      var day = new Date().getDay();
      return String(day);
    },
    move(e) {
      // let odiv = e.target; //获取目标元素
      //算出鼠标相对元素的位置
      let disX = e.clientX - 0;
      let disY = e.clientY - 0;
      document.ondragenter = (e) => {
        //鼠标按下并移动的事件
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        this.Tips_is = true;
        var tips1 = document.getElementById("Tips_card");

        this.Tips_data = "取消";
        let colorset = -1;
        if (left > 80 && top < -80) {
          this.Tips_data = "正在看";
          colorset = 6;
        } else if (left < -80 && top > 80) {
          //黑名单
          colorset = 5;
          this.Tips_data = "黑名单";
        } else if (left > 80 && top > 80) {
          //不想看
          colorset = 4;
          this.Tips_data = "不想看";
        } else if (left > 100 && left > top) {
          //喜欢
          colorset = 0;
          this.Tips_data = "喜欢";
        } else if (left < -100 && left < top) {
          //准备看
          colorset = 1;
          this.Tips_data = "准备看";
        } else if (top < -100 && top < left) {
          //没看完
          colorset = 2;
          this.Tips_data = "没看完";
        } else if (top > 100 && top > left) {
          colorset = 3;
          this.Tips_data = "已看完";
          //已看完
        }
        if (colorset != -1)
          tips1.style = "background-color:" + this.acg_colos[colorset];

        document.ondragend = () => {
          document.ondragenter = null;
          document.ondragend = null;
          let type = -1;
          if (left > 80 && top < -80) {
            type = 6;
            //正在看
          } else if (left < -80 && top > 80) {
            //黑名单
            type = 5;
          } else if (left > 80 && top > 80) {
            type = 4;
            //不想看
          } else if (left > 100 && left > top) {
            type = 0;
            //喜欢
          } else if (left < -100 && left < top) {
            type = 1;
            //准备看
          } else if (top < -100 && top < left) {
            type = 2;
            //没看完
          } else if (top > 100 && top > left) {
            type = 3;
            //已看完
          }

          this.Tips_is = false;

          if (type != -1) {
            this.reload_();
            this.$notify.info({
              title: "「" + this.title + "」",
              message: (
                <Info_box
                  info_num={type}
                  info_AID={this.AID}
                  info_json={this.josn_data}
                />
              ),
              showClose: false,
              duration: 1000,
            });
            this.runstart(this.showdata, 0);
            if (this.NowRuning) this.autoadd(300);
          }
        };
      };
    },
    reurl(str) {
      var data = str.split("/").slice(2).join("/");
      return "https://" + data;
    },
    up(AID, title, josn) {
      var rejson = {
        AID: AID,
        Title: title,
        NewTitle: josn.R新番标题,
        PicSmall: josn.R封面图小,
        Href: "/detail/" + AID,
      };

      this.josn_data = rejson;
      this.AID = AID;
      this.title = title;
    },
    reload_() {
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
      });
    },
    runstart(old_data, type) {
      var data = old_data;
      if (type == 0) this.showdata = [];
      if (data != null)
        for (let index = 0; index < data.length; index++) {
          if (this.reshow(data[index].AID)) {
            this.showdata = this.showdata.concat(data[index]);
          }
        }
    },
    reshow(id) {
      var type_sw = JSON.parse(window.localStorage.getItem("type_sw"));
      if (type_sw != null) {
        var data = JSON.parse(window.localStorage.getItem(id));
        if (data != null) {
          for (let index = 0; index < type_sw.length; index++) {
            if (type_sw[index]) {
              if (data.type == index) {
                return false;
              }
              if (index == 0 || index == 5) {
                if (data.love == -1 || data.love == 1) {
                  return false;
                }
              }
            }
          }
          return true;
        }
        return true;
      }
      return true;
    },
    type_color(id) {
      var data = JSON.parse(window.localStorage.getItem(id));
      if (data != null)
        if (data.type == -1 || data.type == 0 || data.type == 5) {
          return;
        } else {
          return this.acg_colos[data.type];
        }
    },
    isBlack(id) {
      var data = JSON.parse(window.localStorage.getItem(id));
      if (data != null)
        if (data.love == -1) {
          return true;
        }
    },
    ishow(id) {
      var data = JSON.parse(window.localStorage.getItem(id));
      if (data != null)
        if (data.love == 1) {
          return true;
        }
    },
    gettab(num) {
      this.showdata = [];
      this.saveimg = [];
      this.nownum = 0;
      this.MAXnum = 5;
      this.weeks = String(num);
      this.loding();
    },
    loding() {
      for (let index = 0; index < this.save.length; index++) {
        if (this.save[index].wd == this.weeks) {
          this.contnum++;
          this.saveimg = this.saveimg.concat(this.save[index]);
        }
      }
      this.regetdata();

      this.NowRuning = true;
    },
    regetdata() {
      for (let index = this.nownum; index < this.saveimg.length; index++) {
        this.getimg(this.saveimg[index].id);
        this.nownum++;
        if (this.nownum >= this.MAXnum) {
          this.MAXnum += 5;
          return;
        }
      }
    },
    getimg(index) {
      var _this = this;
      axios
        .get(DefaultData.age_api + "detail/" + index)
        .then((response) => {
          _this.showdata = _this.showdata.concat(response.data.AniInfo);
          this.runstart(this.showdata, 0);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.el-card {
  margin: 5px;
}

#black {
  position: absolute;
  left: 0px;
  top: 40%;
  white-space: nowrap;
  width: 100%;
  height: 30px;
  background: #00024d;
  color: azure;
  font-size: 20px;
}

#love {
  position: absolute;
  left: 5px;
  top: 5px;
  white-space: nowrap;
}

#Title {
  padding: 14px;
  height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 100%;
}

#NewTitle {
  position: absolute;
  right: 2px;
  bottom: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px;
  background-color: #f4f0f0ce;
  overflow: hidden;
  border-radius: 2.5px;
  max-width: 80%;
  font-size: 10px;
  line-height: 10px;
}

#Rjiessao {
  text-align: start;
  padding: 20px;
}

#isNew {
  border-radius: 5px;
  padding: 2px 6px;
  background: #ffffff;
  color: rgb(242, 57, 143);
  position: absolute;
  right: 5px;
  top: 5px;
  white-space: nowrap;
}

#Tips {
  width: 200px;
  position: fixed;
  top: 60px;
  left: 45%;
  text-align: center;
  z-index: 10;
}

#Tips .el-card {
  border: none;
}

#Tips .el-card__body {
  padding: 10px;
}
</style>