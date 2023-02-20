<!-- Composant permettant de sélectionner une option pour un plat, il s'agit d'une case contenant l'icone correspondante -->

<template>
	<div @click.stop="selectOption" class="option-icons" :class="{'option-active' : isSelected() }">
		<svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" version="1.1">
			<path :d="getPictoPath(result.picto_id)" />
		</svg>
		<b-button variant="light">{{ $localizedText(result, "name", settings.locale) }}</b-button>
	</div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useDataStore } from '@/stores/data'
import { useOptionsStore } from '@/stores/options'

const settings = useSettingsStore()
const menuStore = useDataStore()
const optionsStore = useOptionsStore()


defineProps({
	result: Object,
	currentPage: Number
})

const getPictoPath = (id) => {
	let picto = menuStore.pictos.find(pic => pic.id == id);

	if (!picto)
		return '';
	return picto.path;
}

// Permet de savoir si l'option est sélectionné
const isSelected = () => {
	return optionsStore.options[currentPage].option.results[$vnode.key].state
}

// Permet de sélectionner une option
const selectOption = () => {
	const index = $vnode.key
	optionsStore.selectOption(currentPage, index)
	console.log("click select")
}

</script>

<style scoped>
.option-icons {
  display: inline-block;
  margin-bottom: 15px;
  cursor: pointer;
}

.option-icons > svg {
  width: 180px;
  height: 180px;
  display: block;
  fill: white;
}

.option-icons > button {
  font-size: 20px;
  width: 125px;
  border-radius: 20px;
}

.option-active > button {
  background-color: orange !important;
  border-color: orange !important;
}
.option-active > svg {
  fill: orange !important;
}
</style>
