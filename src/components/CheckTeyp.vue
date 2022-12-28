<template>
    <el-radio-group v-model="radio">
      <el-radio
        @change="sendmsg"
        class="radio"
        v-for="(text, index) in acg_type"
        :label="index"
        :key="index"
        >{{ text }}</el-radio
      >
    </el-radio-group>
</template>

<script>
import DefaultData from "./DefaultData.vue"

export default {
  name: "CheckTeyp",

  data() {
    return {
      acg_type:DefaultData.acg_type,
      radio: 0,
    };
  },

  mounted() {},

  methods: {
    sendmsg() {
      this.$emit("get_type", this.radio);
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  margin-bottom: 5px;
}
</style>