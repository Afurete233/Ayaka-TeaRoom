<script type="text/javascript">

const acg_colos = [
  "#e62d73",
  "#0089ff",
  // "#b3a700",
  "#fff233",
  "#19ffa8",
  "#8600cc",
  "#00024d",
  "#fbd7be",
];
const acg_colos_info = [
  "#e62d73",
  "#0089ff",
  "#b3a700",
  "#19ffa8",
  "#8600cc",
  "#00024d",
  "#c8a992",
];
const acg_type = [
  "喜欢",
  "准备看",
  "没看完",
  "已看完",
  "不想看",
  "黑名单",
  "正在看",
];

const age_api = "https://v2.age-api.com:8443/v2/";

const acg_web_url = {
  acgfun: "https://www.agemys.vip/",
  acgfun_mobile: "https://web.age-spa.com:8443/#",
  omofun: "https://omofun.tv/vod/search.html?wd=",
  yinghuacd: "http://www.yinghuacd.com/search/",
  yhdm08: "http://159.75.0.62:11234/ssszz.php?q=",//api
  bimiacg: "https://www.bimiacg4.net/vod/search/wd/",
  dilidili: "https://www.dilidili8.cc/public/api.php?app=video&do=search&q=",
  bilibili: "https://search.bilibili.com/bangumi?keyword="
}
const old_acg_url =
  [{
    "title": "AgeFun",
    "api": acg_web_url.acgfun + "detail/",
    "mode": "0",
    "color": "",
    "bgcolor": "",
    "icon": ""
  },
  {
    "title": "Age手机",
    "api": "https://web.age-spa.com:8443/#/detail/",
    "mode": "0",
    "color": "",
    "bgcolor": "",
    "icon": ""
  },
  {
    "title": "樱花动漫",
    "api": "http://www.yinghuacd.com/search/",
    "mode": "1",
    "color": "",
    "bgcolor": "",
    "icon": ""
  },
  {
    "title": "Bimiacg",
    "api": "https://www.bimiacg4.net/vod/search/wd/",
    "mode": "1",
    "color": "",
    "bgcolor": "",
    "icon": ""
  },
  {
    "title": "Dilidili",
    "api": "https://www.dilidili8.cc/public/api.php?app=video&do=search&q=",
    "mode": "1",
    "color": "",
    "bgcolor": "",
    "icon": ""
  },
  {
    "title": "Bilibili",
    "api": "https://search.bilibili.com/bangumi?keyword=",
    "mode": "1",
    "color": "",
    "bgcolor": "",
    "icon": ""
  }]
const errorimg = 'this.src="' + require("@/assets/error.jpg") + '"';
const nodataimg = require("@/assets/nodata.png");
const type_sw = Array(acg_type.length).fill(false);
const Main_url = "https://www.agemys.vip";
import axios from "axios";

const loadweek = function () {
  var _this = this;
  axios
    .get(age_api + "home-list?update=1&recommend=1")
    .then((response) => {
      _this.saveweeknew = response.data.XinfansInfo;
    });
};


const loading_acg_url_json = function () {
  var _this = this;
  axios
    .get("https://raw.githubusercontent.com/Afurete233/Ayaka_TeaRoom/main/URLdata.json")
    .then((response) => {
      _this.old_acg_url = response.data;
    }).catch(function (error) {
      console.log(error.response);
    });
}

const isNew = function (AID) {
  for (let index = 0; index < this.saveweeknew.length; index++) {
    if (this.saveweeknew[index].id == AID) {
      if (this.saveweeknew[index].isnew) {
        return true;
      }
    }
  }
  return false;
};

export default {
  loadweek,
  loading_acg_url_json,
  old_acg_url,
  isNew,
  nodataimg,
  acg_web_url,
  errorimg,
  acg_colos,
  acg_type,
  type_sw,
  Main_url,
  acg_colos_info,
  saveweeknew: [],
  age_api,
  methods: {},
  mounted() {

  },
};
</script>