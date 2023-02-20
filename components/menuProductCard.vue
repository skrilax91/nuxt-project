<!-- Composant servant lors de la validation d'un menu, il s'agit d'une case contenant une image du plat -->

<template>
	<div class="product-card rounded text-center">
		<div class="product-img-con">
			<div class="product-img" v-bind:style="props.product.logo ? { 'background-image': 'url(' + getImageUrl(props.product.logo.name + '.' + props.product.logo.ext) + ')' } : { 'background-image': 'url(' + 'defaultStarter.png' + ')' }"></div>
		</div>
		<div class="product-name courgette-regular">{{ localizedText(props.product, "name", settings.locale) }}</div>
	</div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const settings = useSettingsStore();

const props = defineProps({
  product: { type: Object, required: true },
})

</script>

<style scoped>
.product-card {
  height: 220px;
  width: 162px;
  display: inline-block;
  background-color: white;
  margin: 10px;
  position: relative;
  color: black;
}

.product-img-con {
  height: 130px;
  width: 162px;
  margin-bottom: 10px;
}

.product-img {
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  height: 130px;
  width: 162px;
  border-bottom: 1px solid dimgray;
  border-bottom-left-radius: 200px 20px;
  box-shadow: 0px -4px 8px -6px black inset;
}

.product-border {
  border-bottom: 1px solid dimgray;
  width: 50%;
  margin: auto;
  margin-bottom: 5px;
  margin-top: 10px;
}

.product-name {
  margin-top: 25px;
  font-size: 18px;
}
</style>
