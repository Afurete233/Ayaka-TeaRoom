<template>
  <div id="info">
    <span>{{ msg }}</span>
    <span :style="{ color: acg_colos[info_num] }">{{
      acg_type[info_num]
    }}</span>
  </div>
</template>
<script>
import DefaultData from "./DefaultData.vue";

export default {
  name: "Info_",
  props: {
    info_json: [],
    info_AID: String,
    info_num: Number,
  },
  data() {
    return {
      msg: "添加:",
      acg_type: DefaultData.acg_type,
      acg_colos: DefaultData.acg_colos_info,
    };
  },

  mounted() {
    var love = 0;
    var type = -1;
    var old = JSON.parse(window.localStorage.getItem(this.info_AID));
    if (old != null) {
      love = old.love;
      type = old.type;
      if (
        (old.love != 0 && this.info_num == old.love - 1) ||
        (old.love != 0 && this.info_num == old.love + 6)
      ) {
        love = 0;
        if (old.type == 0 || old.type == 5) {
          type = -1;
        }
        this.msg = "取消:";
      } else {
        type = this.info_num;
        if (this.info_num == 0) {
          love = 1;
          type = old.type;
        } else if (this.info_num == 5) {
          love = -1;
          type = old.type;
        }
        if (old.type == this.info_num) {
          this.msg = "取消:";
          type = -1;
        }
      }
    } else {
      type = this.info_num;
      if (this.info_num == 0) {
        love = 1;
      } else if (this.info_num == 5) {
        love = -1;
      }
    }

    var data = {
      name: this.info_AID,
      type: type,
      love: love,
      Josn_Data: this.info_json,
    };
    data = JSON.stringify(data);



    window.localStorage.setItem(this.info_AID, data);
  },

  methods: {},
};
</script>

<style >
#info {
  font-weight: bold;
}
</style>