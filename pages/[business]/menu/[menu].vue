<!-- Page servant à afficher les détails d'un menu permettant sa composition -->

<template>
	<b-col class="scroll-block courgette-regular menu-page" v-bind:style="menuStore.menu.background ? { 'background-image': 'url(' + getImageUrl(menuStore.menu.background.name + '.' + menuStore.menu.background.ext) + ')' } : {}">
		
		<div class="menu-header">
			<Back @click.stop="$router.back()" class="except-mobile"/>
			<span class="museo700">{{ localizedText(menuStore.menu, "name", settings.locale) }}</span>
		</div>
	
		<div class="formula-main museo100 only-portrait">
			{{ $t('formulas') }}

			<div class="formula-carroussel scroll-block">
				<formulaCard v-for="(declination, index) in menuStore.menu.declinaisons" :key="index" :declination="declination" :declinationId="index"/>
			</div>
		</div>

		<b-col cols="12">
			<!-- AFFICHAGE DES PLATS -->
			<div v-for="(category, index) in dataStore.categories" :key="index">
				<b-row>
					<b-col clos="12">
						<div class="category-title" v-if="menuStore.menu.dishes && menuStore.menu.dishes.some(dish => dish.category && dish.category.id == category.id)">
							<span>{{ localizedText(category, "name", settings.locale) }}</span>
							<span>{{ menuStore.categoryUsedCount(category.id) }} / {{ menuStore.getDeclinaisonMax(category.id) }}</span>
						</div>
					</b-col>
				</b-row>
				
				<b-row class="justify-content-center">

					<b-col class="mb-4 dish-col" v-for="(dish, index) in menuStore.getDishesByCategory(category.id)" :key="index">
						<productCard :dish="dish" :isInMenu="true"/>
					</b-col>
				</b-row>
			</div>
		</b-col>

		<b-modal style="background-color: #102939; border-radius: 80px;" size="lg" id="menu-modal" class="menu-modal" centered hide-footer hide-header
			@show="verificationValidateMenu" @hidden="verificationValidateMenuReset" @ok="verificationValidateMenuReset"
		>
			<div class="modal-top text-center" style="font-size: 26px; display: flex;justify-content: space-around;">
				<div style="position: relative; top: -58px;">
					<Nestor />
				</div>
				<div style="padding-right: 100px">
					<span class="museo700">Vous pouvez encore choisir</span>
				</div>
			</div>
			<div class="">
				<b-row style="display: block; color: white; font-family: Museo500; font-size: 24px; text-align: center">
					<b-col v-for="(product, index) in tabSelectMenuText" :key="index">
						- {{ product }}
					</b-col>
				</b-row>
			</div>
			<div class="text-center courgette-regular d-flex justify-content-around" style="position: relative;top: 34px;">
				<b-button @click.stop="$bvModal.hide('menu-modal')" v-on:click="verificationValidateMenuReset()" style="background-color: #0e3b49; color: #ffffff;border: 1px solid #fff;">
					Retour
				</b-button>
				<b-button variant="primary" @click.stop="$bvModal.show('menu-modal-selection')" style="background-color: #ffffff; color: #000000;border: 1px solid #fff;">
						Continuer
				</b-button>
			</div>
		</b-modal>


		<b-modal id="menu-modal-selection" size="lg" class="menu-modal-selection" centered hide-footer hide-header @show="$bvModal.hide('menu-modal')">
			<div class="modal-top" style="font-size: 26px">
				<div class="cart-icon-container">
					<CartIcon height="50px" width="50px" />
				</div>
				<span class="museo300 mt-4">Votre sélection</span>
			</div>
			<div class="menu-card-container py-3 flex-wrap">
				<menuProductCard v-for="(product, index) in menuStore.basket" :key="index" :product="product"/>
			</div>

			<div class="text-center courgette-regular d-flex justify-content-around mb-2">
				<b-button style="background-color: #0e3b49; color: #ffffff; border: none" @click.stop="$bvModal.hide('menu-modal-selection')">
					{{ $t('return') }}
				</b-button>
				<b-button variant="primary" style="background-color: #ffffff; color: #000000; border: none" @click.stop="validateMenu()">
					{{ $t('continue') }}
				</b-button>
			</div>

		</b-modal>
	</b-col>
</template>

<script setup lang="ts">
import Back from '@/assets/svg/Back.svg'
import CartIcon from '@/assets/svg/CartIcon.svg'
import Nestor from '@/assets/svg/Nestor.svg'

import { useSettingsStore } from '@/stores/settings'
import { useDataStore } from '@/stores/data'
import { useMenuStore } from '@/stores/menu'

const settings = useSettingsStore()
const dataStore = useDataStore()
const menuStore = useMenuStore()

const router = useRouter()
const route = useRoute()

const tabSelectMenuText = ref<any[]>([])

definePageMeta({
	layout: 'menu',
})

const validateMenu = () => {
	$bvModal.hide('menu-modal-selection')
	menuStore.validateMenu()
	router.push({ name: 'business', params: { business: route.params.business } });
}

const verificationValidateMenuReset = () => {
	tabSelectMenuText.value = []
}

const verificationValidateMenu = (e: any) => {
	let menu = menuStore.menu.declinaisons[menuStore.activeFormula]
	// définit les tableaux pour stocker les données
	let tabSelectMenu: any[] = []
	let tabSelectMenuProduct: any[] = []

	menu.Text = localizedText(menu, "name", settings.locale)
	menu.basket = menuStore.basket
	console.log('%cmenu.Products','background: red; color:white', menu.basket)

	// Loop to get the selected menu
	menu.rulesDishcatDeclinaisons.forEach((el: any) => {
	if (el.max > 0)
		tabSelectMenu.push(el.dish_category.id)
	})

	// Loop to retrieve the product menu selected
	menu.basket.forEach((el: any) => {
		tabSelectMenuProduct.push(el.category_id)
	})

	// sort array
	tabSelectMenu.sort()
	tabSelectMenuProduct.sort()
		
	// Compare array and put the diff on diffMenu array
	let diffMenu = tabSelectMenu.filter(x => tabSelectMenuProduct.indexOf(x) === -1)
			console.log('diffMenu : ' + diffMenu)
	if (diffMenu.length == 0) {
		console.log('No difference: popup shouldnt appear')
		e.preventDefault()
		$bvModal.show('menu-modal-selection')
	}

	// Loop to get the missing product text
	diffMenu.forEach((el: any) => {
		const cat = dataStore.categories.find(x => x.id == el)
		if (cat)
			tabSelectMenuText.value.push(localizedText(cat, "name", settings.locale))
	})
}

menuStore.setMenu(dataStore.menus.find(el => el.id == route.params.menu));

console.log('%cmenuStore.menu','background: red; color:white', menuStore.menu)
</script>

<style>
#menu-modal .modal-body {
	padding: 0;
}

#menu-modal .modal-content {
	background: #2c3e50;
	border: 1px white solid;
	border-radius: 20px;
	padding: 0;
}

.modal-content {
	padding: 0;
}

.modal-body {
	border-radius: 20px;
	border: 1px solid white;
	padding: 0;
}
</style>

<style scoped>
.menu-page {
	background-size: cover;
	background-position: center center;
	background-repeat: no-repeat;
}

.menu-header span {
	font-size: 25px;
	color: white;
}

.menu-header {
	margin: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
}

.menu-header svg {
	position: absolute;
	left: 5px;
	cursor: pointer;
}

.category-title {
	overflow: hidden;
	text-align: center;
}

.category-title span {
	color: white;
	font-size: 22px;
	margin: 5px;
}

.bottom-navbar {
  background-color: #1c4168;
  overflow: hidden;
  white-space: nowrap;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 666;
}

.category-title:before,
.category-title:after {
	background-color: white;
	content: '';
	display: inline-block;
	height: 1px;
	position: relative;
	vertical-align: middle;
	width: 50%;
}

.dish-col {
	flex: 0 0 25%;
	max-width: 25%;
}

@media screen and (max-width: 1250px) {
	.dish-col {
		flex: 0 0 33.333333%;
		max-width: 33.333333%;
	}
}

@media screen and (max-width: 449px) {
	.dish-col {
		flex: 0 0 50%;
		max-width: 50%;
	}
}

.category-title:before {
	right: 0.5em;
	margin-left: -50%;
}

.category-title:after {
	left: 0.5em;
	margin-right: -50%;
}

.category-title span {
	position: left;
	left: 10px;
}

.menu-card-container {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
}

.formula-main {
	background-color: black;
	padding: 10px;
	text-align: center;
	color: white;
	font-size: 22px;
	width: 100%;
	border-radius: 15px;
	margin-top: 10px;
	margin-bottom: 10px;
}

.formula-carroussel {
	display: flex;
	flex-direction: row;
	overflow: auto;
	column-gap: 10px;
}

.formula-div {
	background-color: black;
	padding: 10px;
	text-align: center;
	color: white;
	font-size: 22px;
	margin-bottom: 10px;
	margin-top: 10px;
	border-radius: 15px;
}

p {
	color: aliceblue;
}

.menu-modal {
	background-color: #102939;
	border-radius: 80px;
}

.modalDialog {
	max-width: 650px;
}

.menu-modal-selection {
	background-color: #102939;
	border-radius: 80px;
}

.modal-top {
	border-top-left-radius: 80px;
	border-top-right-radius: 80px;
	height: 130px;
	color: white;
	font-size: 20px;
	background-color: #273e4c;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

.cart-icon-container {
	width: 110px;
	height: 110px;
	border-radius: 110px;
	background: white;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: -50%;
	left: 50%;
	transform: translateX(-50%);
}
</style>
