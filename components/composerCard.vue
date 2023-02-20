<!-- Composant servant à l'affichage des ingrédiant, il s'agit d'une case contenant l'image -->
<i18n>
{
	"fr": {
		"noThanks": "Retour"
	},
	"en": {
		"noThanks": "Go back"
	}
}
</i18n>

<template>
	<b-modal id="composer-modal" hide-footer hide-header :dialog-class="{modalDialogPortrait: modalDialogPortrait,modalDialogLandscape: modalDialogLandscape}"
		no-close-on-backdrop class="dialog" style="position: relative" >
		<div @click="closeButton" class="close-button"><CloseIcon /></div>
		<div class="text-center" v-if="compositionStore.ingredients && compositionStore.ingredients.length">
			<div v-for="(ingredientCategory, index) in compositionStore.ingredients" :key="index" class="ariane-line montserrat-bold" @click="changeCurrentPage(index)">
				<div v-if="ingredientCategory.id === compositionStore.ingredients[currentPage].id">{{ categoryUsed() }}/{{ categoryMax() }}</div>
				{{ $localizedText(ingredientCategory.category, 'name', settings.locale) }}
			</div>

			<b-row>
				<b-col cols="4" v-for="(ingredient, index) in compositionStore.ingredients[currentPage].rulesIngredient.filter(rule => rule.composable != null)" :key="index">
					<ingredientCard :key="index" :ingredient="ingredient" :currentPage="currentPage" />
				</b-col>
			</b-row>
		</div>

		

		<div class="footer-btn" :style="orientation !== 'portrait' ? 'position: fixed; bottom: 4rem; left: 2rem;height: 50px' : 'position: fixed; top: 5rem; left: 0rem;height: 50px'">
			<button @click.stop="previousPage()">{{ $t('noThanks') }}</button>
		</div>
		<div class="footer-btn" :style=" orientation !== 'portrait' ? 'position: fixed; bottom: 4rem; right: 8rem;height: 50px;width: 50px;' : 'position: fixed; top: 5rem; right: 0rem; height: 50px;'">
			<button @click.stop="nextPage()">
				<img class="center-img check-img" :src="'check.png'" style="width: 40px;position: relative;"/>
			</button>
		</div>
	</b-modal>
</template>

<script setup lang="ts">
import CloseIcon from '@/assets/svg/close.svg'
import { useSettingsStore } from '@/stores/settings'
import { useCompositionStore } from '@/stores/composition'
import { useBasketStore } from '@/stores/basket'

import { onUpdated, onMounted } from 'vue'

const settings = useSettingsStore()
const compositionStore = useCompositionStore()
const basketStore = useBasketStore()


let currentPage = 0;
let orientation = window.screen.orientation.type.split('-')[0]
let modalDialogPortrait = false
let modalDialogLandscape = false

const closeButton = () => {
	$bvModal.hide('composer-modal')
}

const changeCurrentPage = (index) => {
	currentPage = index
	printInfo()
}

const categoryUsed = () => {
	return compositionStore.getCategoryUsed(currentPage)
}

const categoryMax = () => {
	return compositionStore.getCategoryMax(currentPage)
}

const handleOrientationChange = () => {
	orientation = window.screen.orientation.type.split('-')[0]
	if (orientation === 'portrait') {
		modalDialogPortrait = true
		modalDialogLandscape = false
	} else if (orientation === 'landscape') {
		modalDialogPortrait = false
		modalDialogLandscape = true
	}
}

const updateZindex = () => {
	let arianeElements = document.querySelectorAll('.ariane-line')
	let j = 0
	for (let [i, arianeElement] of arianeElements.entries()) {
		if (i === currentPage) j = 20
		
		if (j === 0) {
			arianeElements[i].style.zIndex = i.toString()
		} else {
			arianeElements[i].style.zIndex = j.toString()
			j = j - 1
		}
	}
}

const nextPage = () => {
	//Si l'on n'est pas sur la dernière page on avance dans la composition
	if (compositionStore.ingredients[currentPage + 1]) {
		currentPage += 1
	} else {
		let product = compositionStore.composition.product

		product.ingredients = compositionStore.ingredients
		//ajoute du produit au pannier ou dans le menu
		if (product.menu_id != null) {
			menuStore.selectProduct(product)
		} else {
			basketStore.selectProduct(product, false);
		}


		compositionStore.$reset()
		currentPage = 0
		$bvModal.hide('composer-modal')

		if (product.menu_id != null && $route.name !== 'menuDetails')
			$router.back()
	}
}

const previousPage = () => {
	if (compositionStore.ingredients[currentPage - 1]) {
		currentPage -= 1
	} else {
		$bvModal.hide('composer-modal')
		currentPage = 0
	}
}

onUpdated(() => {
	updateZindex()
})

onMounted(() => {
	updateZindex()
	handleOrientationChange()
	window.addEventListener('orientationchange', handleOrientationChange)
})

</script>

<style>
.modal-content > div > div {
  padding: 0;
}
#composer-modal > .modal-dialog > .modal-content {
  padding: 0;
}
.ariane-line {
  color: black;
  font-size: 20px;
  background-color: white;
  border-radius: 18px;
  padding: 4px 8px;
  display: inline-block;
  position: relative;
  border: 2px solid rgb(32, 30, 30, 0.9);
  margin: -8px -8px 20px;
}

.ariane-line > div {
  position: absolute;
  top: -25px;
  left: 70px;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  padding-top: 6px;
  font-size: 14px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  color: #fff;
  background-color: #000;
  border: 2px solid #fff;
}

.footer-btn > button {
  margin: 20px 10px 10px;
  width: 127px;
  font-size: 17px;
  text-align: center;
  background-color: rgb(105, 147, 47);
  /*border-color: #fff!important;*/
  padding-bottom: 8px;
  padding-top: 8px;
  border-radius: 25px;
  color: #fff;
  outline: 0;
}

.modalDialogPortrait {
  max-width: 700px;
}

.modalDialogLandscape {
  max-width: 1000px;
}

.footer-btn__separation {
  clear: both;
  margin-top: 25px;
  margin-left: 20px;
  margin-right: 20px;
  width: 2px;
  background: #fff;
  height: 40px;
}

.h-line--left {
  clear: both;
  width: 250px;
  background: #fff;
  margin-right: 30px;
}
.h-line--right {
  clear: both;
  width: 250px;
  background: #fff;
  margin-left: 30px;
}
</style>
<style scoped>
.dialog {
  padding: 0;
}
#composer-modal {
  padding: initial;
}
.modal-content > div > div {
  padding: 0;
}
#composer-modal > .modal-dialog > .modal-content {
  padding: 0;
}
.close-button {
  border-radius: 50%;
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -23px;
  right: -23px;
  background: white;
  border: 1px solid black;
}

.close-button > svg {
  width: 20px;
  filter: none;
}
</style>
