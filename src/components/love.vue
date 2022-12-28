<template>
  <el-row draggable="false">
    <el-col>
      <Check_teyp v-on:get_type="get_type($event)" />
    </el-col>
    <transition-group name="el-zoom-in-center">
      <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2" v-for="item in showdata" :key="item.AID" draggable="true"
        @mousedown.native="move" @dragend.native="up(item.AID, item.Title, item)" :title="item.Title">
        <span @click="dialogacgweb = true; acgdata = item;">
          <a target="_blank">
            <el-card style="border: none" :body-style="{ padding: '0px', background: type_color(item.AID) }">
              <div style="position: relative">
                <img draggable="false" :src="
  'https://cdn.aqdstatic.com:966/age/' +
  item.AID +
  '_small.jpg'
" :onerror="defalutLogoUrl" class="image" width="100%" style="border-radius: 3px 3px 0px 0px;
                  aspect-ratio: 150 / 208;" />
                <transition v-if="reload" name="el-fade-in-linear">
                  <img src="..\public\heart.svg" v-if="ishow(item.AID)" id="love" />
                  <div v-if="isBlack(item.AID)" id="black">
                    黑名单
                  </div>
                </transition>
                <h1 v-if="isNew(item.AID)" id="isNew">New!</h1>
                <!-- <span id="NewTitle">{{ item.NewTitle }}</span> -->
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
import Info_box from "./info.vue";
import Check_teyp from "./CheckTeyp.vue";
import DefaultData from "./DefaultData.vue";

export default {
  components: { Check_teyp, AltConnectVue },
  name: "Love_",
  data() {
    return {
      Tips_is: false,
      Tips_data: '',
      acgdata: [],
      dialogacgweb: false,
      defalutLogoUrl: DefaultData.errorimg,
      mian_url: DefaultData.Main_url,
      acg_colos: DefaultData.acg_colos,
      See_type: 0,
      josn_data: {},
      reload: true,
      demo: false,
      title: "",
      AID: 0,
      showdata: [],
      sw: true,
      MAXnum: 20,
      itemnum: 1,
      Allnum: 0,
      nownum: 1,
    };
  },
  methods: {
    sendcontnum() {
      this.$emit("getcontnum", this.nownum - 1);
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
    isNew(id) {
      return DefaultData.isNew(id);
    },
    ishow(id) {
      var data = JSON.parse(window.localStorage.getItem(id));
      if (data != null)
        if (data.love == 1) {
          return true;
        }
    },
    up(AID, title, json) {
      this.AID = AID;
      this.title = title;
      this.josn_data = json;
    },
    redata() {
      let max_length = window.localStorage.length;
      for (let index = this.Allnum; index < max_length; index++) {
        this.Allnum++;
        let key = window.localStorage.key(index);

        var numReg = /^[0-9]*$/;
        var numRe = new RegExp(numReg)
        // if (key == "type_sw" || key == "bg") continue;
        // console.log(key);
        if (!numRe.test(key)) continue;

        let data = JSON.parse(window.localStorage.getItem(key));
        if (data.Josn_Data != null) {
          var re = false;
          if (data.type != -1 || data.love != 0) {
            if (this.See_type == data.type) {
              this.showdata = this.showdata.concat(data.Josn_Data);
              re = true;
            } else {
              if (this.See_type == 0)
                if (data.love == 1) {
                  this.showdata = this.showdata.concat(data.Josn_Data);
                  re = true;
                }
              if (this.See_type == 5)
                if (data.love == -1) {
                  this.showdata = this.showdata.concat(data.Josn_Data);
                  re = true;
                }
            }

            if (re) {
              this.itemnum++;
              this.nownum++;
              if (this.itemnum >= this.MAXnum) {
                this.itemnum == 0;
                return;
              }
            }
          }
        }
      }
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
            this.showdata = [];
            this.Allnum = 0;
            this.itemnum = 1;
            this.MAXnum = this.nownum;
            this.nownum = 1;
            this.redata();
            this.autoadd();
            this.sendcontnum();
          }
        };
      };
    },
    get_type(radio) {
      this.showdata = [];
      this.nownum = 1;
      this.itemnum = 1;
      this.MAXnum = 20;
      this.Allnum = 0;
      this.See_type = radio;

      this.$nextTick(() => {
        this.redata();
        this.sendcontnum();
      });
      var _this = this;
      setTimeout(function () {
        _this.autoadd();
      }, 500);
    },
    autoadd() {
      if (
        document.querySelector("#app > div > section > section > main >span")
          .offsetHeight <
        document.querySelector("#app > div > section > section > main ")
          .offsetHeight
      ) {
        this.itemnum = 1;
        this.redata();
        this.sendcontnum();
      }
    },
    reurl(str) {
      var data = str.split("/").slice(2).join("/");
      return "https://" + data;
    },
  },
  mounted() {
    var _this = this;

    this.showdata = [];
    this.redata();
    this.sendcontnum();

    setTimeout(function () {
      _this.autoadd();
    }, 500);

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
            .offsetHeight
        ) {
          _this.itemnum = 1;
          _this.redata();
          _this.sendcontnum();
        }
      });
  },
};
</script>

<style>
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