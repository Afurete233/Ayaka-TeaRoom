<template>
  <el-row draggable="false" style="background: #ffffff00">
    <el-col v-if="false">
      <transition>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-card>
              <el-carousel indicator-position="outside" height="200px">
                <el-carousel-item v-for="item in 4" :key="item">
                  <h3>{{ item }}</h3>
                </el-carousel-item>
              </el-carousel>
            </el-card>
          </el-col>
        </el-row>
      </transition>
    </el-col>
    <transition-group name="el-zoom-in-center">
      <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-for="item in showdata" :key="item.AID" draggable="true"
        @mousedown.native="move" @dragend.native="up(item.AID, item.Title, item)" :title="item.Title">
        <span @click="
          dialogacgweb = true;
        acgdata = item;
        ">
          <a target="_blank">
            <el-card style="border: none" :body-style="{ padding: '0px', background: type_color(item.AID) }">
              <div style="position: relative">
                <img height="inherit" draggable="false" v-bind:src="item.PicSmall" :onerror="defalutLogoUrl" class="image"
                  width="100%" style="border-radius: 3px 3px 0px 0px;aspect-ratio: 150 / 208;" />
                <transition v-if="reload" name="el-fade-in-linear">
                  <img src="..\public\heart.svg" v-if="ishow(item.AID)" id="love" />
                  <div v-if="isBlack(item.AID)" id="black">黑名单</div>
                </transition>
                <h1 v-if="isNew(item.AID)" id="isNew">New!</h1>
                <span id="NewTitle">{{ item.NewTitle }}</span>
              </div>
              <div id="Title">
                <span>{{ item.Title }}</span>
              </div>
            </el-card>
          </a>
        </span>
      </el-col>
    </transition-group>
    <el-dialog :title="acgdata.Title" :visible.sync="dialogacgweb" :modal-append-to-body='false'>
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
import axios from "axios";
import Info_box from "./info.vue";
import DefaultData from "./DefaultData.vue";

export default {
  name: "Data_",
  Info_box,
  components: {
    AltConnectVue,
  },
  props: {
    Data_type: String,
  },
  data() {
    return {
      Tips_is: false,
      Tips_data: '',
      acgdata: [],
      dialogacgweb: false,
      defalutLogoUrl: DefaultData.errorimg,
      josn_data: JSON,
      mian_url: DefaultData.Main_url,
      acg_colos: DefaultData.acg_colos,
      reload: true,
      demo: false,
      title: "",
      AID: 0,
      showdata: [],
      sw: true,
      MAXnum: 20,
      page: 1,
    };
  },
  methods: {
    isNew(id) {
      return DefaultData.isNew(id);
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
    reload_() {
      this.reload = false;
      this.$nextTick(() => {
        this.reload = true;
      });
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
    up(AID, title, josn) {
      this.josn_data = josn;
      this.AID = AID;
      this.title = title;
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
          }
          this.reload_();
          this.runstart(this.showdata, 0);
        };
      };
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
    autoadd() {
      if (
        document.querySelector("#app > div > section > section > main >span")
          .offsetHeight <
        document.querySelector("#app > div > section > section > main ")
          .offsetHeight &&
        this.page * 20 < this.MAXnum
      ) {
        var _this = this;
        this.page++;
        axios
          .get(
            DefaultData.age_api +
            _this.Data_type +
            "?page=" +
            _this.page +
            "&size=20"
          )
          .then((response) => {
            _this.MAXnum = response.data.AllCnt;
            _this.runstart(response.data.AniPre, 1);
            _this.sw = true;
          })
          .catch((error) => {
            console.log(error);
            _this.errored = true;
          })
          .finally(() => (_this.loading = false));
      }
    },
    setatag() {
      this.$nextTick(() => {
        const links = document.querySelectorAll("a[href]");
        links.forEach((link) => {
          link.addEventListener("click", () => {
            // this.$electron.shell.openExternal(links.getAttribute("href"));
            link.src = link.getAttribute("href");
          });
        });
      });
    },
    reurl(str) {
      var data = str.split("/").slice(2).join("/");
      return "https://" + data;
    },
  },
  mounted() {
    var _this = this;
    axios
      .get(DefaultData.age_api + this.Data_type + "?page=1&size=20")
      .then((response) => {
        this.MAXnum = response.data.AllCnt;
        this.runstart(response.data.AniPre, 1);
        setTimeout(function () {
          _this.autoadd();
          _this.setatag();
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));

    window.onresize = () => {
      this.autoadd();
    };

    document
      .querySelector("#app > div > section > section > main ")
      .addEventListener("scroll", function () {
        if (
          document.querySelector("#app > div > section > section > main")
            .scrollTop +
          window.innerHeight >=
          document.querySelector("#app > div > section > section > main >span")
            .offsetHeight &&
          _this.page * 20 < _this.MAXnum
        ) {
          // 如果开关打开则加载数据
          if (_this.sw == true) {
            // 将开关关闭

            _this.page++;
            // console.log("ok--" + _this.page);
            axios
              .get(
                DefaultData.age_api +
                _this.Data_type +
                "?page=" +
                _this.page +
                "&size=20"
              )
              .then((response) => {
                // _this.showdata = _this.showdata.concat(response.data.AniPre);
                _this.MAXnum = response.data.AllCnt;
                _this.runstart(response.data.AniPre, 1);
                _this.sw = true;
              })
              .catch((error) => {
                console.log(error);
                _this.errored = true;
              })
              .finally(() => (_this.loading = false));

            _this.sw = false;
          }
        }
      });
  },
};
</script>

<style>
a {
  text-decoration: none;
}

.el-card__body {
  padding: 0;
}

.el-card {
  margin: 5px;
  border: none;
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

#Title {
  padding: 14px;
  height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 100%;
}

#NewTitle {
  overflow: hidden;
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