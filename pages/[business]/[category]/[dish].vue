<!-- Page servant à afficher les détails d'un plat -->
<template>
	<b-col class="text-white">
		<div class="title courgette-regular">
			<div><Back class="except-mobile" @click="$router.back()" /></div>
			<span>{{ $t('dish.detail') }}</span>
		</div>
		<b-container fluid class="glitch">
			<b-row align-h="center">
				<b-col :cols="value" class="dish-card" :class="{ rounded: rounded }">
					<b-row align-h="center" class="details-container" :class="{ rounded: rounded }" >
						<b-col class="my-3" cols="12">
							<div align-h="center" class="ml-2 courgette-regular dish-name" style="margin-bottom: 10px">
								{{ localizedText(dish, "name", settings.locale) }}
							</div>

							<div id="myBtn" class="picture" v-bind:style="dish.logo ? {'background-image': 'url(' + getImageUrl(dish.logo.name + '.' + dish.logo.ext) + ')'} : { 'background-image': 'url(/defaultStarter.png)' }">
								<div class="layer" :class="{ 'layer-active': getProductCount() > 0 && !isInMenu }" >
									<div v-if="getProductCount() > 0 && !isInMenu">
										<div class="montserrat-bold">{{ getProductCount() }}</div>
									</div>
								</div>
							</div>

							<div id="myModal" class="zoom-modal">
								<div id="caption">{{ localizedText(dish, "name", settings.locale) }}</div>
								<div class="modal-content" id="img01" >
									<img style="height: 100%" alt="" :src="dish.logo ? getImageUrl(dish.logo.name + '.' + dish.logo.ext) :  '/defaultStarter.png'">
								</div>
							</div>

							<div style="line-height: 22px; white-space: pre-line" class="mt-3 description">
								{{ localizedText(dish, "description", settings.locale) }}
							</div>

							<div class="selection-container my-3" v-if="!settings.disableBasket">
								<span class="museo700 select">{{ $t('dish.select') }}</span>
								<Minus @click.stop="removeProduct()" class="selection selection-minus" style="width: 50px; height: 50px" />
								<More @click.stop="startAddProduct()" class="selection selection-more" style="width: 50px; height: 50px" />
							</div>

							<h5 v-if="dish.dishOptions.length > 0" style="margin-bottom: 1rem">
								{{ $t('dish.availableOptions') }}
							</h5>

							<div style="display: flex; justify-content: space-evenly;">
								<div v-for="(option, index) in dish.dishOptions" :key="index" class="option-container">
									<div class="picto svg-resize">
										<img :src="'options.svg'" height="50px" alt="" />
										<svg viewBox="0 0 170 180" xmlns="http://www.w3.org/2000/svg" version="1.1">
											<path :d="menuStore.getPictoById(option.dishOption.picto.id).path" />
										</svg>
									</div>
									<span class="montserrat-bold">{{ localizedText(option.dishOption, "name", settings.locale ) }}</span>
								</div>
							</div>
							<div v-if="dish.price" class="montserrat-bold my-3" style="font-size: 2rem">
								{{ Math.floor(dish.price) === dish.price ? dish.price.toFixed(0) : dish.price.toFixed(2).replace('.', ',') }} €
							</div>
						</b-col>

						<div v-if="localizedText(dish, 'allergen', settings.locale) != '' ">
							<button class="allergens" id="popover-button-variant" href="#" tabindex="0">
								<Allergen width="30" height="30" />
							</button>
							<b-popover target="popover-button-variant" variant="danger" triggers="focus">
								<template v-slot:title>{{ $t('dish.allergens') }}</template>
								{{ localizedText(dish, 'allergen', settings.locale) }}
							</b-popover>
						</div>
					</b-row>

					<b-row class="mt-2">
						<b-col cols="12" style="padding-right: 0">
							<div id="category-suggestion" v-if="categorySuggestions.length">
								<h4 style="color: #546e7a">{{ $t('dish.suggestions') }}</h4>
								<div>
									<b-button @click="$router.push({name: 'business-category', params: { business: route.params.business, category: suggestion.id }})" pill variant="outline-secondary" v-for="(suggestion, index) in categorySuggestions" :key="index" style="color: #556d79; border: 1px solid #59717c">
										{{ localizedText(suggestion, "name", settings.locale) }}
									</b-button>
								</div>
							</div>
						</b-col>
					</b-row>
				</b-col>

				<b-col class="right only-landscape" :cols="(settings.disableBasket) ? 3 : 4" style="margin-bottom: 15px">
					<b-row>
						<b-col cols="12" class="mb-2" v-for="(dish, index) in suggestionList" :key="index">
							<productCard :key="index" :dish="dish" class="is-suggestion" />
						</b-col>
					</b-row>
				</b-col>
			</b-row>
		</b-container>

		<b-container class="only-portrait" fluid>
			<b-row class="flex-row flex-nowrap" style="column-gap: 10px;">
				<div class="product-col" v-for="(dish, index) in suggestionList" :key="index">
					<productCard :key="index" :dish="dish" />
				</div>
			</b-row>
		</b-container>
	</b-col>
</template>

<script setup lang="ts">
import Minus from '@/assets/svg/Minus.svg'
import More from '@/assets/svg/More.svg'
import Back from '@/assets/svg/Back.svg'
import Allergen from '@/assets/svg/allergen.svg'

import { isPlatform } from '@ionic/vue'

import { useSettingsStore } from '@/stores/settings'
import { useBasketStore } from '@/stores/basket'
import { useDataStore } from '@/stores/data'
import { useOptionsStore } from '@/stores/options'
import { useCompositionStore } from '@/stores/composition'

const settings = useSettingsStore()
const basketStore = useBasketStore()
const menuStore = useDataStore()
const optionsStore = useOptionsStore()
const compositionStore = useCompositionStore()

const router = useRouter()
const route = useRoute()

definePageMeta({
	layout: "menu"
});

let dish: any = menuStore.dishes.find((el: any) => el.id == route.params.dish);
console.log(dish.dishOptions);
console.log(menuStore.options);
let suggestionList = dish.suggestionList.length ? menuStore.dishes.filter((el: any) => dish.suggestionList.includes(el.id) ) : menuStore.dishes.filter((el: any) => (el.category && el.category.id == dish.category.id) && el.id != dish.id).slice(0, 3);
let categorySuggestions: any[] = [];
let isInMenu = (route.params.menu != null);
let orientation = null;
let rounded = true;
let value: any = null;
let tempSuggestions = [];

const getProductCount = () => {
	if (!dish)
		return;
	return (isInMenu) ? menuStore.getProductCount(dish.id) : basketStore.getProductCount(dish.id);
}

const removeProduct = () => {
	basketStore.unselectProductById(dish.id);
}

const addProduct = (data: any) => {
	if (!isInMenu) {
		basketStore.selectProduct(data);
	} else {
		menuStore.selectProduct(data);
		router.back()
	}
}

const startAddProduct = () => {
	if (dish.dishOptions && dish.dishOptions.length) {
		optionsStore.setOptions(dish)
		$bvModal.show('options-modal')
	
	} else if (dish.ingredients && dish.ingredients.length > 0) {
		compositionStore.selectProduct(dish)
		$bvModal.show('composer-modal')
	
	} else
		addProduct(dish)
}

const handleOrientationChange = () => {
	orientation = window.screen.orientation.type.split('-')[0]
	if (orientation === 'portrait') {
		value = 12
	} else if (orientation === 'landscape') {
		value = (settings.disableBasket) ? 9 : 8;
	}
}

if (!isPlatform('capacitor')) {
	console.log(dish.categorySuggestionList)
	if (dish.categorySuggestionList.length)
		categorySuggestions = menuStore.categories.filter((el: any) => dish.categorySuggestionList.includes(el.id));
}

handleOrientationChange()
console.log("categories: %o", categorySuggestions);
window.addEventListener('orientationchange', handleOrientationChange);

</script>

<style scoped>


.product-col {
	flex: 0 0 25%;
	max-width: 25%;
}

@media screen and (max-width: 899px) {
	.product-col {
		flex: 0 0 33.333333%;
		max-width: 33.333333%;
	}
}

@media screen and (max-width: 449px) {
	.product-col {
		flex: 0 0 50%;
		max-width: 50%;
	}
}

.zoom-modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 99; /* Sit on top */
    padding-top: 40px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: none; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.9); /* Black w/ opacity */
}

.modal-content {
    margin: auto;
    display: block;
	height: 90%;
}

@-webkit-keyframes zoom {
	from {-webkit-transform:scale(1)}
	to {-webkit-transform:scale(2)}
}
	
@keyframes zoom {
	from {transform:scale(0.4)}
	to {transform:scale(1)}
}

@-webkit-keyframes zoom-out {
	from {transform:scale(1)}
	to {transform:scale(0)}
}
@keyframes zoom-out {
	from {transform:scale(1)}
	to {transform:scale(0)}
}

.modal-content, #caption {
    -webkit-animation-name: zoom;
    -webkit-animation-duration: 0.6s;
    animation-name: zoom;
    animation-duration: 0.6s;
}

.out {
	animation-name: zoom-out;
	animation-duration: 0.6s;
}

@media only screen and (max-width: 700px){
    .modal-content {
        width: 100%;
    }
}

#caption {
    margin: auto;
    display: block;
    text-align: center;
    color: #ccc;
	font-size: 30px;
}

.allergens {
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  border: none;
}

#category-suggestion {
  width: 100%;
  margin-left: 0px;
  background: #d4dce2;
  border-radius: 0.25rem;
}

.center-text {
  position: absolute;
  z-index: 1;
  top: 80px;
  left: 75px;
  width: 100px;
  text-align: center;
  font-size: 80px;
  color: white;
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 120px;
  color: white;
}

.layer-active {
  background-color: rgba(255, 145, 0, 0.5);
}

.details-container {
  background-color: #e8e8ea;
  color: black;
  position: relative;
}

@media screen and (orientation: landscape) {
	.details-container {
		margin-left: 0px;
	}
}

.option-container {
  border-radius: 25px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.option-container > .picto {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 0 2px 2px;
}

.option-container > .picto > svg {
  height: 25px;
}

.option-container span {
  color: black;
  font-size: 14px;
  flex: 1;
  text-align: center;
  margin: 0 1rem 0 0;
}

.selection-container {
  position: relative;
  display: inline-block;
  /*width: 250px;*/
  width: 260px;
  height: 52px;
  border: 1px black solid;
  border-radius: 30px;
  margin-top: -90px;
}

.selection {
  cursor: pointer;
  position: absolute;
  top: 1px;
}

.selection-minus {
  left: 2px;
}

.selection-more {
  right: 2px;
}

.selection-container span {
  text-align: center;
  position: absolute;
  color: black;
  bottom: 10px;
  left: 55px;
  width: 150px;
}

.info-page {
  height: 50px;
  width: 125px;
  background-color: white;
  color: black;
  font-size: 15px;
  text-align: center;
}

.info-page-border {
  border-bottom: 1px solid white;
}

.inline-block {
  display: inline-block;
}

.title {
  margin: 10px;
}

.title span {
  font-size: 28px;
}

.title div {
  float: left;
  cursor: pointer;
}

.select {
	font-size: 20px;
}

@media screen and (min-width: 1281px) {
	.title span {
		font-size : 40px;
	}

	.description {
		font-size:26px;
		margin: 20px;
	}

	.select {
		font-size:24px
	}

	.glitch {
		width: 75%;
	}

	.dishCardLandscape {
		padding-right: 50px;
	}
}

.dish-name {
  /*font-size: 40px;*/
  font-size: 36px;
  line-height: 1;
}

.dish-name-border {
  font-size: 28px;
  border-bottom: 1px dotted white;
}

.picture {
  width: 100%;
  padding-bottom: 60%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
}

.dishCardLandscape {
  margin-bottom: 15px;
}

.desc-card {
  height: 250px;
  background-color: black;
}

.flex-row {
  overflow-x: auto;
}

.right {
  height: 90vh;
  overflow: hidden;
  overflow-y: scroll;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.dish-card.is-portrait {
  width: 250px;
  height: 300px;
}
.dish-card.is-portrait .image-background {
  height: 180px;
}
.dish-card.is-portrait .bottom-content {
  height: 120px;
}
</style>
