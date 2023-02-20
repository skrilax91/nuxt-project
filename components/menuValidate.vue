<template>
  <div class="validate-btn courgette-regular" @click="$bvModal.show('menu-modal')">
    <div class="btn-center" v-html="$t('menu.validate')"></div>
    <div class="btn-border" />
  </div>
</template>
<script>
export default {
}
</script>

<style scoped>
.validate-btn {
  color: white;
  margin: auto;
  display: block;
  margin-top: 20px;
  height: 200px;
  width: 200px;
  font-size: 27px;
  cursor: pointer;
  outline: none;
}

.btn-center {
  position: fixed;
  margin-left: 5px;
  margin-top: 20px;
  width: 190px;
  z-index: 1;
  text-align: center;
}

.btn-border {
  margin: auto;
  z-index: 0;
  background-color: #4c77a5;
  width: 60%;
  height: 60%;
  border: 12px solid #38608b;
  border-radius: 50%;
  box-shadow: 2px 2px 10px 0px #000000;
}
</style>
