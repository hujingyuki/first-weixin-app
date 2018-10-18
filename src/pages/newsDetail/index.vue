<template>
  <web-view :src="link"></web-view>
</template>

<script>
export default {
  data() {
    return {
      link: ''//链接地址
    }
  },
  methods: {},
  onLoad: function (options) {
    this.link = options.link;
  }
}
</script>

<style scoped></style>


