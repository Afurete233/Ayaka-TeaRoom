<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="sendtab">
      <el-tab-pane
        v-for="(wd, index) in week"
        :label="wd"
        :name="index + ''"
        :key="index"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "WeekTab",
  props: {
    weeknum: String,
  },
  data() {
    return {
      week: [
        "日曜日",
        "月曜日",
        "火曜日",
        "水曜日",
        "木曜日",
        "金曜日",
        "土曜日",
      ],
      activeName: this.weeknum,
    };
  },

  mounted() {},

  methods: {

    sendtab(num) {
      if (num.index != this.weeknum) this.$emit("gettab", num.index);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>