<!-- Composant servant à afficher un ingrédiant lors de la composition d'un plat -->

<template>
	<div class="card" @click.stop="selectIngredient()">
		<div class="card-img" v-bind:style="ingredient.ingredients.logo ? {'background-image': 'url(' + $urlForImage(ingredient.ingredients.logo.name + '.' + ingredient.ingredients.logo.ext) + ')'} : { 'background-image': 'url(' + 'none.png' + ')' }">
			<div class="layer" :class="[{ 'layer-active': isSelected() }, {'layer-locked': !canAddMore() && !isSelected()}]"/>
		</div>
		<div class="card-text rounded nexa-light" :class="{ 'card-text-active': isSelected() }">
			<span class="card-center-text montserrat-regular">{{ $localizedText(ingredient.ingredients, "name", settings.locale) }}</span>
		</div>
	</div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings';
import { useCompositionStore } from '@/stores/composition';

const settings = useSettingsStore();
const compositionStore = useCompositionStore();

defineProps({
	ingredient: Object,
	currentPage: Number
})

const selectIngredient = () => {
	const index = $vnode.key
	compositionStore.selectIngredient( currentPage, index )
	console.log("click select")
}

const isSelected = () => {
	if (!compositionStore.ingredients[currentPage])
		return false
	return compositionStore.ingredients[currentPage].rulesIngredient[$vnode.key].state
}

const canAddMore = () => {
	return compositionStore.canAddMore(currentPage, $vnode.key)
}

</script>

<style scoped>
.card {
  margin: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.layer {
  /*border-radius: 10px;*/
  border-radius: 20px;
  top: 0;
  left: 25px;
  width: 100%;
  height: 100%;
}

.layer-active {
  background-color: rgba(255, 145, 0, 0.5);
}

.layer-locked {
  background-color: rgba(128, 128, 128, 0.5);
}

.card-img {
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 20px;
  height: 150px;
  margin: 0 auto 5px;
}

.card-text {
  color: rgb(195, 200, 204);
  border: 2px dotted white;
  width: 100%;
  height: 40px;
  margin: 0 auto;
  font-size: 20px;
  display: table;
}

.card-text-active {
  border: 2px solid orange;
}

.card-center-text {
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}

.rounded {
  border-radius: 0.7rem !important;
}
</style>
